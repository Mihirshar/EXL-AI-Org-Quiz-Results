'use client';

import { motion } from 'framer-motion';
import { ChoiceOption } from '@/lib/types';

interface ChoiceCardProps {
  choice: ChoiceOption;
  displayLabel?: ChoiceOption; // Visual label shown on badge (defaults to choice)
  description: string;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: () => void;
}

export default function ChoiceCard({
  choice,
  displayLabel,
  description,
  isSelected,
  isDisabled,
  onSelect,
}: ChoiceCardProps) {
  const badgeLabel = displayLabel ?? choice;
  const choiceColors = {
    A: {
      selected: 'from-blue-500/20 to-blue-500/10 border-blue-400 shadow-[0_0_30px_rgba(96,165,250,0.3)]',
      badge: 'bg-blue-500 text-white',
      glow: 'rgba(96,165,250,0.15)',
    },
    B: {
      selected: 'from-purple-500/20 to-purple-500/10 border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.3)]',
      badge: 'bg-purple-500 text-white',
      glow: 'rgba(168,85,247,0.15)',
    },
    C: {
      selected: 'from-amber-500/20 to-orange-500/10 border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.3)]',
      badge: 'bg-amber-500 text-white',
      glow: 'rgba(251,191,36,0.15)',
    },
  };

  return (
    <motion.button
      onClick={onSelect}
      disabled={isDisabled}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut', delay: badgeLabel === 'A' ? 0.1 : badgeLabel === 'B' ? 0.15 : 0.2 }}
      whileHover={!isDisabled ? { scale: 1.01, boxShadow: `0 8px 30px ${choiceColors[choice].glow}` } : {}}
      whileTap={!isDisabled ? { scale: 0.99 } : {}}
      className={`
        w-full text-left p-4 rounded-xl border-2 transition-all duration-300 relative overflow-hidden
        ${isSelected
          ? `bg-gradient-to-r ${choiceColors[choice].selected}`
          : isDisabled
            ? 'bg-surface/50 border-border/50 opacity-50 cursor-not-allowed'
            : 'bg-surface border-border hover:border-exl-orange/50 cursor-pointer'
        }
      `}
    >
      <div className="flex items-start gap-3">
        <div
          className={`
            flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
            font-mono font-bold text-sm transition-all duration-300
            ${isSelected
              ? choiceColors[choice].badge
              : 'bg-border/50 text-white/50'
            }
          `}
        >
          {badgeLabel}
        </div>
        <div className="flex-1">
          <p className={`text-sm leading-snug ${isSelected ? 'text-white' : 'text-white/70'}`}>
            {description}
          </p>
        </div>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2"
        >
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </motion.div>
      )}
    </motion.button>
  );
}
