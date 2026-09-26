import {setGlobalOptions} from "firebase-functions";
import {onSchedule} from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";
import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";

// Initialize Firebase Admin SDK
initializeApp();
const db = getFirestore();

setGlobalOptions({maxInstances: 10});

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
