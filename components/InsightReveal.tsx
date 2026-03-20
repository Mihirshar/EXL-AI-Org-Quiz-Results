'use client';

import { motion } from 'framer-motion';
import { Insight } from '@/lib/gameData';
import { ChoiceOption } from '@/lib/types';

interface InsightRevealProps {
  choice: ChoiceOption;
  insight: Insight;
  onNext: () => void;
  onRepeat?: () => void;
  isLastLevel: boolean;
  canRepeat?: boolean;
}

export default function InsightReveal({
  choice,
  insight,
  onNext,
  onRepeat,
  isLastLevel,
  canRepeat = true,
}: InsightRevealProps) {
  const choiceColors = {
    A: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-400/40',
      text: 'text-blue-400',
      icon: '📊',
    },
    B: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-400/40',
      text: 'text-purple-400',
      icon: '📈',
    },
    C: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-400/40',
      text: 'text-amber-400',
      icon: '⚠️',
    },
  };

  const colors = choiceColors[choice];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="space-y-3"
    >
      {/* Insight Card */}
      <div className={`rounded-xl border-2 p-4 ${colors.bg} ${colors.border}`}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">{colors.icon}</span>
          <span className={`font-mono text-xs font-semibold ${colors.text}`}>
            Strategy {choice} — Outcome
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-white/40 font-mono text-[10px] uppercase tracking-wider mb-1">
              Immediate Impact
            </p>
            <p className="text-white/80 leading-snug text-sm">{insight.first}</p>
          </div>

          <div className="h-px bg-border" />

          <div>
            <p className="text-white/40 font-mono text-[10px] uppercase tracking-wider mb-1">
              Long-term Consequence
            </p>
            <p className="text-white/80 leading-snug text-sm">{insight.second}</p>
          </div>

          {/* Extra details — diagnosis / hidden connection / outcome */}
          {(insight.diagnosis || insight.hiddenConnection || insight.outcome) && (
            <>
              <div className="h-px bg-border" />
              <div className="grid grid-cols-1 gap-2">
                {insight.diagnosis && (
                  <div className="flex items-start gap-2">
                    <span className="text-xs mt-0.5">🧭</span>
                    <div>
                      <p className="text-white/30 font-mono text-[9px] uppercase tracking-wider">Diagnosis</p>
                      <p className={`text-xs font-medium ${colors.text}`}>{insight.diagnosis}</p>
                    </div>
                  </div>
                )}
                {insight.hiddenConnection && (
                  <div className="flex items-start gap-2">
                    <span className="text-xs mt-0.5">🔗</span>
                    <div>
                      <p className="text-white/30 font-mono text-[9px] uppercase tracking-wider">Hidden Connection</p>
                      <p className={`text-xs font-medium ${colors.text}`}>{insight.hiddenConnection}</p>
                    </div>
                  </div>
                )}
                {insight.outcome && (
                  <div className="flex items-start gap-2">
                    <span className="text-xs mt-0.5">🎯</span>
                    <div>
                      <p className="text-white/30 font-mono text-[9px] uppercase tracking-wider">Outcome</p>
                      <p className={`text-xs font-bold ${colors.text}`}>{insight.outcome}</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex items-center gap-2"
      >
        {/* Repeat Button */}
        {canRepeat && onRepeat && (
          <motion.button
            onClick={onRepeat}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-2 px-4 rounded-lg font-medium text-sm text-white/70 border border-border hover:border-white/30 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Repeat Question
          </motion.button>
        )}

        {/* Next/Results Button */}
        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className={`btn-primary ${canRepeat && onRepeat ? 'flex-1' : 'w-full'}`}
        >
          {isLastLevel ? 'View Results' : 'Next Decision'}
          <span className="ml-2">→</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
