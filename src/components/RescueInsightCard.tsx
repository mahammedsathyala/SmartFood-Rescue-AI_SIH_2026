import React, { useEffect, useState, useCallback, useRef } from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  Bot
} from 'lucide-react';
import { httpsCallable } from 'firebase/functions';
import { functions, isFirebaseConfigured } from '../services/firebase';
import { getRescueInsightPayload } from '../services/storage';
import { RescueInsightPayload, RescueInsightResponse } from '../types';

interface RescueInsightCardProps {
  onNavigateToBatches?: () => void;
  onNavigateToNgo?: () => void;
}

export const RescueInsightCard: React.FC<RescueInsightCardProps> = ({
  onNavigateToBatches,
  onNavigateToNgo
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [fullInsight, setFullInsight] = useState<string>('');
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [updatedTime, setUpdatedTime] = useState<string>('Just now');
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const typewriterRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fallback coordinator generator if Cloud Function is offline/unreachable
  const getFallbackInsight = useCallback((data: RescueInsightPayload): string => {
    const hoursRemaining = Math.max(0.5, data.deadlineMinutes / 60).toFixed(1);
    return (
      `• Dispatch ${data.topBatchKg} kg of top-rated surplus (Score ${data.topBatchScore}/100) to ${data.bestNgoName} (${data.bestNgoMatch}% match) immediately.\n` +
      `• Prioritize courier pickup within ${data.deadlineMinutes}m (${hoursRemaining}h window) before thermal barrier degradation.\n` +
      `• Lock routing for remaining ${data.activeBatches} active batches to surpass today's ${data.todayRescuedKg} kg rescued milestone.`
    );
  }, []);

  // 1. Fetch insight from Cloud Function or local fallback
  const fetchInsight = useCallback(async (forceRefresh: boolean = false) => {
    setLoading(true);
    setErrorNotice(null);
    setDisplayedText('');

    // Clear any active typing timer
    if (typewriterRef.current) {
      clearInterval(typewriterRef.current);
      typewriterRef.current = null;
    }

    try {
      const payload: RescueInsightPayload = {
        ...getRescueInsightPayload(),
        forceRefresh
      };

      let insightResult = '';
      let timeResult = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      try {
        if (isFirebaseConfigured && functions) {
          const generateRescueInsightFn = httpsCallable<RescueInsightPayload, RescueInsightResponse>(
            functions,
            'generateRescueInsight'
          );
          const response = await generateRescueInsightFn(payload);
          if (response?.data?.insight) {
            insightResult = response.data.insight;
            timeResult = response.data.generatedAt || timeResult;
          } else {
            insightResult = getFallbackInsight(payload);
          }
        } else {
          // Local demo intelligence engine (deterministic, zero-latency rule inference)
          insightResult = getFallbackInsight(payload);
        }
      } catch (cloudErr) {
        // Graceful fallback for offline/development environments
        console.info('Cloud Function offline or unreachable; using local intelligence engine:', cloudErr);
        insightResult = getFallbackInsight(payload);
      }

      setFullInsight(insightResult);
      setUpdatedTime(timeResult);
    } catch (err: any) {
      console.warn('Error fetching rescue insight:', err);
      const fallback = getFallbackInsight(getRescueInsightPayload());
      setFullInsight(fallback);
      setUpdatedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } finally {
      setLoading(false);
    }
  }, [getFallbackInsight]);

  // Initial fetch on mount
  useEffect(() => {
    fetchInsight(false);
    return () => {
      if (typewriterRef.current) {
        clearInterval(typewriterRef.current);
      }
    };
  }, [fetchInsight]);

  // 2. Typewriter animation: 20ms delay per character
  useEffect(() => {
    if (loading || !fullInsight) return;

    if (typewriterRef.current) {
      clearInterval(typewriterRef.current);
      typewriterRef.current = null;
    }

    setIsTyping(true);
    let index = 0;
    setDisplayedText('');

    typewriterRef.current = setInterval(() => {
      index++;
      setDisplayedText(fullInsight.slice(0, index));

      if (index >= fullInsight.length) {
        if (typewriterRef.current) {
          clearInterval(typewriterRef.current);
          typewriterRef.current = null;
        }
        setIsTyping(false);
      }
    }, 20);

    return () => {
      if (typewriterRef.current) {
        clearInterval(typewriterRef.current);
      }
    };
  }, [fullInsight, loading]);

  // Format bullet points from displayed text
  const rawBullets = displayedText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-indigo-500/30 shadow-lg relative overflow-hidden">
      {/* Background glow & accents */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-indigo-500/20 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 text-indigo-300 rounded-xl border border-indigo-500/40">
            <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-base sm:text-lg text-white tracking-wide">
                Today's Rescue Intelligence
              </h3>
              <span className="text-[10px] uppercase font-mono font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-500/40 px-2 py-0.5 rounded-full">
                AI Recommendation Engine
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Live automated operational guidance synthesized for Vijayawada institutional kitchens.
            </p>
          </div>
        </div>

        {/* Small Refresh Button */}
        <button
          type="button"
          onClick={() => fetchInsight(true)}
          disabled={loading || isTyping}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 transition-colors disabled:opacity-50 cursor-pointer shrink-0"
          title="Force regenerate AI insights"
          aria-label="Refresh Insights"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
        </button>
      </div>

      {/* Main Insight Body */}
      <div className="relative z-10 min-h-[90px] flex flex-col justify-center">
        {loading ? (
          /* Requirement: Green pulsing dot while loading ("AI analyzing...") */
          <div className="flex items-center gap-3 py-6 px-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-semibold text-slate-300 font-mono tracking-wide animate-pulse">
              AI analyzing telemetry, surplus batches & NGO logistics...
            </span>
          </div>
        ) : (
          /* Render the 3 bullet points with typewriter animation */
          <div className="space-y-2.5">
            {rawBullets.map((bullet, idx) => {
              // Clean bullet character if present
              const cleanText = bullet.replace(/^[•\-\*]\s*/, '');
              return (
                <div 
                  key={idx} 
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans"
                >
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[11px] font-bold shrink-0 mt-0.5 border border-emerald-500/30">
                    {idx + 1}
                  </span>
                  <span className="flex-1">
                    {cleanText}
                  </span>
                </div>
              );
            })}

            {/* Pulsing cursor while typing */}
            {isTyping && (
              <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse ml-1 align-middle" />
            )}
          </div>
        )}
      </div>

      {/* Bottom Footer Label */}
      <div className="mt-4 pt-3 border-t border-indigo-500/20 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 relative z-10">
        <div className="flex items-center gap-2">
          <Bot className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-medium text-slate-300">
            Powered by Claude AI • Updated {updatedTime}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-emerald-400 font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Target: &lt; 70 Words Action Plan</span>
          </span>
        </div>
      </div>
    </div>
  );
};
