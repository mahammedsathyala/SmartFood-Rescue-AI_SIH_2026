import {setGlobalOptions} from "firebase-functions";
import {onSchedule} from "firebase-functions/v2/scheduler";
import {onCall} from "firebase-functions/v2/https";
import {
  onDocumentCreated,
  onDocumentUpdated,
} from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import {initializeApp} from "firebase-admin/app";
import {getFirestore, FieldValue} from "firebase-admin/firestore";

// Initialize Firebase Admin SDK
initializeApp();
const db = getFirestore();

setGlobalOptions({maxInstances: 10});

export interface RescueInsightPayload {
  activeBatches: number;
  topBatchScore: number;
  topBatchKg: number;
  bestNgoName: string;
  bestNgoMatch: number;
  deadlineMinutes: number;
  todayRescuedKg: number;
  forceRefresh?: boolean;
}

/**
 * Helper to call Claude / Gemini AI or synthesize prompt-aligned recommendations
 */
async function generateAiRecommendationText(
  data: RescueInsightPayload
): Promise<string> {
  const prompt =
    "You are a food rescue coordinator AI for a college canteen in Vijayawada, India. " +
    `Based on: Active surplus batches: ${data.activeBatches}, ` +
    `Top batch quality score: ${data.topBatchScore}/100, ` +
    `Top batch quantity: ${data.topBatchKg} kg, ` +
    `Closest NGO recipient: ${data.bestNgoName} (${data.bestNgoMatch}% match), ` +
    `Shelf life deadline: ${data.deadlineMinutes} minutes remaining, ` +
    `Today rescued so far: ${data.todayRescuedKg} kg. ` +
    "Give exactly 3 short actionable recommendations in under 70 words total. " +
    "Be specific with numbers. Format as 3 bullet points.";

  // 1. Anthropic Claude API integration
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (anthropicKey) {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 250,
          messages: [{role: "user", content: prompt}],
        }),
      });
      if (response.ok) {
        const result = (await response.json()) as {
          content?: {text?: string}[];
        };
        const text = result.content?.[0]?.text;
        if (text && text.trim()) {
          return text.trim();
        }
      } else {
        logger.warn("Anthropic API non-ok status:", response.status);
      }
    } catch (e) {
      logger.warn("Failed to call Anthropic API:", e);
    }
  }

  // 2. Google Gemini API integration
  const geminiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const url =
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          contents: [{parts: [{text: prompt}]}],
        }),
      });
      if (response.ok) {
        const result = (await response.json()) as {
          candidates?: {content?: {parts?: {text?: string}[]}}[];
        };
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim()) {
          return text.trim();
        }
      }
    } catch (e) {
      logger.warn("Failed to call Gemini API:", e);
    }
  }

  // 3. Fallback deterministic coordinator synthesis matching exact prompt constraints (<70 words, 3 bullets)
  const hoursRemaining = Math.max(0.5, data.deadlineMinutes / 60).toFixed(1);
  return (
    `• Dispatch ${data.topBatchKg} kg surplus (Score ${data.topBatchScore}/100) to ${data.bestNgoName} (${data.bestNgoMatch}% match) immediately.\n` +
    `• Secure courier pickup within ${data.deadlineMinutes}m (${hoursRemaining}h window) before thermal barrier degradation.\n` +
    `• Route remaining ${data.activeBatches} active batches to exceed today's ${data.todayRescuedKg} kg rescued milestone.`
  );
}

/**
 * Callable Cloud Function: generateRescueInsight
 * Caches daily response in Firestore: insights/{YYYY-MM-DD}
 * Regenerates if activeBatches count changed or forceRefresh requested.
 */
export const generateRescueInsight = onCall(async (request) => {
  const data = (request.data || {}) as RescueInsightPayload;
  logger.info("generateRescueInsight invoked", {payload: data});

  const now = new Date();
  const todayDocId = now.toISOString().split("T")[0];
  const insightDocRef = db.collection("insights").doc(todayDocId);

  // Check Firestore cache unless forceRefresh is true
  if (!data.forceRefresh) {
    try {
      const snap = await insightDocRef.get();
      if (snap.exists) {
        const cached = snap.data();
        if (
          cached &&
          cached.activeBatches === data.activeBatches &&
          typeof cached.insight === "string"
        ) {
          logger.info("Serving cached insight from Firestore", {todayDocId});
          return {
            insight: cached.insight,
            generatedAt: cached.generatedAt ||
              now.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"}),
          };
        }
      }
    } catch (cacheErr) {
      logger.warn("Firestore cache read bypassed:", cacheErr);
    }
  }

  // Generate fresh insight via LLM (or robust synthesis)
  const insight = await generateAiRecommendationText(data);
  const generatedAt = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Save to Firestore cache
  try {
    await insightDocRef.set(
      {
        insight,
        generatedAt,
        activeBatches: data.activeBatches,
        topBatchKg: data.topBatchKg,
        topBatchScore: data.topBatchScore,
        updatedAt: now.toISOString(),
      },
      {merge: true}
    );
  } catch (saveErr) {
    logger.warn("Firestore cache write error:", saveErr);
  }

  return {
    insight,
    generatedAt,
  };
});

/**
 * Scheduled Cloud Function running every 6 hours.
 * Sweeps the `batches` collection, checks if deadlineDateTime has passed,
 * and if donationStatus is still "Surplus Detected", updates it to "Expired".
 */
export const checkExpiredFoodBatches = onSchedule(
  "every 6 hours",
  async (event) => {
    logger.info("Starting scheduled food batch deadline check...", {
      scheduleTime: event.scheduleTime,
    });

    const nowIso = new Date().toISOString();
    let updatedCount = 0;

    try {
      const batchesSnapshot = await db
        .collection("batches")
        .where("donationStatus", "==", "Surplus Detected")
        .get();

      if (batchesSnapshot.empty) {
        logger.info("No surplus food batches found pending deadline check.");
        return;
      }

      const batchWriter = db.batch();

      batchesSnapshot.forEach((doc) => {
        const data = doc.data();
        const deadlineDateTime = data.deadlineDateTime;

        if (deadlineDateTime && deadlineDateTime < nowIso) {
          logger.info(`Batch ${doc.id} expired at ${deadlineDateTime}.`);
          const expirationNotice =
            `[System: Automatically expired past deadline at ${nowIso}]`;
          batchWriter.update(doc.ref, {
            donationStatus: "Expired",
            updatedAt: nowIso,
            notes: data.notes ?
              `${data.notes} ${expirationNotice}` :
              expirationNotice,
          });
          updatedCount++;
        }
      });

      if (updatedCount > 0) {
        await batchWriter.commit();
        logger.info(`Updated ${updatedCount} food batches to 'Expired'.`);
      } else {
        logger.info("All active surplus batches are within valid shelf life.");
      }
    } catch (error) {
      logger.error("Error during food batch expiration check:", error);
      throw error;
    }
  },
);

/**
 * 1. onBatchCreated — Firestore onDocumentCreated trigger on 'batches/{batchId}'
 * Immediately checks if temperature in linked IoT data exceeds threshold (8°C).
 * If breach: updates batch.qualityStatus -> 'Needs Manual Inspection'.
 * Log: "Batch {batchId} created, IoT threshold check complete".
 */
export const onBatchCreated = onDocumentCreated(
  "batches/{batchId}",
  async (event) => {
    const batchId = event.params.batchId;
    const snap = event.data;
    if (!snap) {
      logger.warn(`onBatchCreated invoked without data for ${batchId}`);
      return;
    }

    const batchData = snap.data();
    let currentTemp: number | null = null;

    try {
      // Check linked IoT readings in 'iot_readings'
      const readingSnap = await db.collection("iot_readings").doc(batchId).get();
      if (readingSnap.exists) {
        const readingData = readingSnap.data();
        if (typeof readingData?.temperature === "number") {
          currentTemp = readingData.temperature;
        }
      }

      // Check linked IoT telemetry in 'iot_data'
      if (currentTemp === null) {
        const dataSnap = await db.collection("iot_data").doc(batchId).get();
        if (dataSnap.exists) {
          const iotData = dataSnap.data();
          if (typeof iotData?.temperature === "number") {
            currentTemp = iotData.temperature;
          }
        }
      }

      // Fallback check on embedded temperature field
      if (currentTemp === null && typeof batchData?.temperature === "number") {
        currentTemp = batchData.temperature;
      }

      // Safe cold-chain threshold check (8°C)
      const isBreach = currentTemp !== null && currentTemp > 8.0;

      if (isBreach) {
        logger.warn(
          `Temperature breach detected on newly created batch ${batchId}: ${currentTemp}°C > 8°C.`
        );
        await snap.ref.update({
          qualityStatus: "Needs Manual Inspection",
          updatedAt: new Date().toISOString(),
          notes: batchData.notes
            ? `${batchData.notes} [System Alert: IoT Core Temp ${currentTemp}°C breached 8°C threshold]`
            : `[System Alert: IoT Core Temp ${currentTemp}°C breached 8°C threshold]`,
        });
      }

      logger.info(`Batch ${batchId} created, IoT threshold check complete`, {
        batchId,
        temperature: currentTemp,
        breached: isBreach,
      });
    } catch (error) {
      logger.error(`Error during onBatchCreated IoT check for ${batchId}:`, error);
    }
  },
);

/**
 * 2. onBatchStatusChanged — Firestore onDocumentUpdated on 'batches/{batchId}'
 * - When donationStatus changes to 'Offered':
 *     Writes to Firestore: notifications/{timestamp}
 *     { type: 'NGO_ALERT', batchId, ngoId: batch.matchedNgoId, message: '...', createdAt: now }
 * - When donationStatus changes to 'Delivered':
 *     Calculates ESG impact: mealsRescued = kg * 4, co2Avoided = kg * 2.5
 *     Appends to Firestore: esg_ledger/{YYYY-MM}
 *     { batchId, kg, mealsRescued, co2Avoided, date: now }
 */
export const onBatchStatusChanged = onDocumentUpdated(
  "batches/{batchId}",
  async (event) => {
    const batchId = event.params.batchId;
    const change = event.data;
    if (!change) return;

    const beforeData = change.before.data();
    const afterData = change.after.data();

    const beforeStatus = beforeData?.donationStatus;
    const afterStatus = afterData?.donationStatus;

    if (!afterStatus || beforeStatus === afterStatus) {
      return;
    }

    const now = new Date();
    const nowIso = now.toISOString();

    try {
      // Transition 1: donationStatus -> 'Offered'
      if (afterStatus === "Offered") {
        const timestamp = now.getTime().toString();
        await db.collection("notifications").doc(timestamp).set({
          type: "NGO_ALERT",
          batchId,
          ngoId: afterData.matchedNgoId || null,
          message: "New food surplus available for pickup",
          createdAt: nowIso,
        });
        logger.info(`NGO_ALERT notification emitted for batch ${batchId}`);
      }

      // Transition 2: donationStatus -> 'Delivered'
      if (afterStatus === "Delivered") {
        const kg = Number(afterData.remainingKg || afterData.preparedKg || 0);
        const mealsRescued = Math.round(kg * 4);
        const co2Avoided = Number((kg * 2.5).toFixed(1));
        const currentMonth = nowIso.slice(0, 7); // "YYYY-MM"

        const esgEntry = {
          batchId,
          kg,
          mealsRescued,
          co2Avoided,
          date: nowIso,
        };

        const monthDocRef = db.collection("esg_ledger").doc(currentMonth);

        // Append to esg_ledger/{YYYY-MM} document with arrayUnion and totals
        await monthDocRef.set(
          {
            month: currentMonth,
            entries: FieldValue.arrayUnion(esgEntry),
            totalKg: FieldValue.increment(kg),
            totalMeals: FieldValue.increment(mealsRescued),
            totalCO2: FieldValue.increment(co2Avoided),
            updatedAt: nowIso,
          },
          {merge: true},
        );

        // Also record in subcollection entries for direct collection queries
        await monthDocRef.collection("entries").doc(batchId).set(esgEntry, {merge: true});

        logger.info(`ESG ledger record created for delivered batch ${batchId}`, {
          kg,
          mealsRescued,
          co2Avoided,
          currentMonth,
        });
      }
    } catch (error) {
      logger.error(`Error in onBatchStatusChanged for ${batchId}:`, error);
    }
  },
);

/**
 * 3. onDeliveryCompleted — Firestore onDocumentUpdated on 'batches/{batchId}'
 * Specifically fires only on 'Delivered' transition.
 * Sends confirmation log to Firestore: audit_log/{batchId}
 * { event: 'DELIVERED', timestamp: now, completedBy: batch.assignedDriver }
 */
export const onDeliveryCompleted = onDocumentUpdated(
  "batches/{batchId}",
  async (event) => {
    const batchId = event.params.batchId;
    const change = event.data;
    if (!change) return;

    const beforeStatus = change.before.data()?.donationStatus;
    const afterData = change.after.data();
    const afterStatus = afterData?.donationStatus;

    // Fires strictly when donationStatus transitions into 'Delivered'
    if (beforeStatus === "Delivered" || afterStatus !== "Delivered") {
      return;
    }

    const nowIso = new Date().toISOString();
    const completedBy = afterData.assignedDriver || "Unassigned Driver";

    try {
      await db.collection("audit_log").doc(batchId).set(
        {
          event: "DELIVERED",
          timestamp: nowIso,
          completedBy,
          batchId,
          foodItem: afterData.foodItem || "Surplus Meal Batch",
          deliveredKg: afterData.remainingKg || afterData.preparedKg || 0,
        },
        {merge: true},
      );

      logger.info(`Audit log recorded for delivered batch ${batchId}`, {
        completedBy,
        timestamp: nowIso,
      });
    } catch (error) {
      logger.error(`Error writing audit_log for delivered batch ${batchId}:`, error);
    }
  },
);

/**
 * 4. weeklyESGDigest — Scheduled every Monday at 09:00 IST (cron: '0 3 * * 1')
 * - Reads all esg_ledger/{current-month} documents / entries
 * - Sums up: totalKg, totalMeals, totalCO2
 * - Writes summary to Firestore: reports/weekly-{date}
 *   { totalKgRescued, totalMealsSaved, totalCO2Avoided, weekEnding: now }
 * - Logs the summary
 */
export const weeklyESGDigest = onSchedule(
  "0 3 * * 1",
  async (event) => {
    logger.info("Starting weekly ESG Digest generation...", {
      scheduleTime: event.scheduleTime,
    });

    const now = new Date();
    const nowIso = now.toISOString();
    const dateStr = nowIso.split("T")[0];
    const currentMonth = nowIso.slice(0, 7); // "YYYY-MM"

    let totalKg = 0;
    let totalMeals = 0;
    let totalCO2 = 0;

    try {
      const monthDocRef = db.collection("esg_ledger").doc(currentMonth);
      const monthSnap = await monthDocRef.get();

      if (monthSnap.exists) {
        const monthData = monthSnap.data();
        if (monthData?.entries && Array.isArray(monthData.entries)) {
          for (const entry of monthData.entries) {
            totalKg += Number(entry.kg || 0);
            totalMeals += Number(entry.mealsRescued || 0);
            totalCO2 += Number(entry.co2Avoided || 0);
          }
        } else if (typeof monthData?.totalKg === "number") {
          totalKg = monthData.totalKg;
          totalMeals = monthData.totalMeals || 0;
          totalCO2 = monthData.totalCO2 || 0;
        }
      }

      // If array entries were not found or empty, inspect subcollection entries
      if (totalKg === 0) {
        const entriesSnap = await monthDocRef.collection("entries").get();
        entriesSnap.forEach((doc) => {
          const entry = doc.data();
          totalKg += Number(entry.kg || 0);
          totalMeals += Number(entry.mealsRescued || 0);
          totalCO2 += Number(entry.co2Avoided || 0);
        });
      }

      totalKg = Number(totalKg.toFixed(1));
      totalCO2 = Number(totalCO2.toFixed(1));

      const reportId = `weekly-${dateStr}`;
      const reportPayload = {
        totalKgRescued: totalKg,
        totalMealsSaved: totalMeals,
        totalCO2Avoided: totalCO2,
        weekEnding: nowIso,
        month: currentMonth,
        generatedAt: nowIso,
      };

      await db.collection("reports").doc(reportId).set(reportPayload, {merge: true});

      logger.info("Weekly ESG Digest completed:", reportPayload);
    } catch (error) {
      logger.error("Error generating weekly ESG Digest:", error);
      throw error;
    }
  },
);

/**
 * 5. onIoTThresholdBreach — Firestore onDocumentUpdated on 'iot_readings/{batchId}'
 * - When temperature field changes AND new value > settings.safeTempThreshold (8°C):
 *     Writes critical alert to Firestore: alerts/{timestamp}
 *     { type: 'TEMP_BREACH', batchId, temperature: newTemp, severity: 'critical', createdAt: now }
 *     Updates the batch document: qualityStatus -> 'Needs Manual Inspection'
 */
export const onIoTThresholdBreach = onDocumentUpdated(
  "iot_readings/{batchId}",
  async (event) => {
    const batchId = event.params.batchId;
    const change = event.data;
    if (!change) return;

    const beforeData = change.before.data();
    const afterData = change.after.data();

    if (!afterData) return;

    const oldTemp = beforeData?.temperature;
    const newTemp = afterData.temperature;

    // Trigger only when temperature field value changes
    if (typeof newTemp !== "number" || oldTemp === newTemp) {
      return;
    }

    try {
      // Query threshold from settings/default (fallback safe threshold: 8.0°C)
      let safeTempThreshold = 8.0;
      try {
        const settingsSnap = await db.collection("settings").doc("default").get();
        if (settingsSnap.exists) {
          const data = settingsSnap.data();
          if (typeof data?.safeTempThreshold === "number") {
            safeTempThreshold = data.safeTempThreshold;
          }
        }
      } catch (settingsError) {
        logger.warn("Using default safeTempThreshold 8.0°C:", settingsError);
      }

      if (newTemp > safeTempThreshold) {
        const now = new Date();
        const nowIso = now.toISOString();
        const timestamp = now.getTime().toString();

        logger.warn(
          `Critical temperature breach: Batch ${batchId} measured ${newTemp}°C > threshold ${safeTempThreshold}°C`
        );

        // 1. Write critical alert to alerts/{timestamp}
        await db.collection("alerts").doc(timestamp).set({
          type: "TEMP_BREACH",
          batchId,
          temperature: newTemp,
          safeThreshold: safeTempThreshold,
          severity: "critical",
          createdAt: nowIso,
        });

        // 2. Update the batch document: qualityStatus -> 'Needs Manual Inspection'
        const batchRef = db.collection("batches").doc(batchId);
        const batchSnap = await batchRef.get();

        if (batchSnap.exists) {
          const batchData = batchSnap.data();
          const breachNote =
            `[CRITICAL ALERT: IoT Core Temp ${newTemp}°C exceeded ${safeTempThreshold}°C limit at ${nowIso}]`;

          await batchRef.update({
            qualityStatus: "Needs Manual Inspection",
            updatedAt: nowIso,
            notes: batchData?.notes
              ? `${batchData.notes} ${breachNote}`
              : breachNote,
          });

          logger.info(`Batch ${batchId} marked as 'Needs Manual Inspection' due to IoT threshold breach`);
        }
      }
    } catch (error) {
      logger.error(`Error in onIoTThresholdBreach for ${batchId}:`, error);
    }
  },
);

