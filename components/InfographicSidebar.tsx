'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { getLevels, getChoiceInfographics, ChoiceInfographic, Level } from '@/lib/gameData';
import { QuestionSet, ChoiceOption } from '@/lib/types';

interface InfographicSidebarProps {
  currentLevelIndex: number;
  choices: ChoiceOption[];
  selectedChoice: ChoiceOption | null;
  questionSet?: QuestionSet;
}

const THEME_STYLES = {
  tech: {
    gradient: 'from-blue-600 via-cyan-500 to-blue-700',
    accent: 'text-cyan-400',
    border: 'border-cyan-500/30',
    glow: 'shadow-[0_0_20px_rgba(6,182,212,0.2)]',
    bg: 'bg-gradient-to-br from-cyan-900/20 to-blue-900/30',
    icon: '💻',
  },
  people: {
    gradient: 'from-emerald-600 via-green-500 to-teal-600',
    accent: 'text-emerald-400',
    border: 'border-emerald-500/30',
    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.2)]',
    bg: 'bg-gradient-to-br from-emerald-900/20 to-teal-900/30',
    icon: '👥',
  },
  risk: {
    gradient: 'from-red-600 via-orange-500 to-amber-600',
    accent: 'text-orange-400',
    border: 'border-orange-500/30',
    glow: 'shadow-[0_0_20px_rgba(249,115,22,0.2)]',
    bg: 'bg-gradient-to-br from-orange-900/20 to-red-900/30',
    icon: '⚠️',
  },
  growth: {
    gradient: 'from-purple-600 via-violet-500 to-indigo-600',
    accent: 'text-violet-400',
    border: 'border-violet-500/30',
    glow: 'shadow-[0_0_20px_rgba(139,92,246,0.2)]',
    bg: 'bg-gradient-to-br from-violet-900/20 to-purple-900/30',
    icon: '📈',
  },
  balance: {
    gradient: 'from-amber-500 via-yellow-400 to-orange-500',
    accent: 'text-amber-400',
    border: 'border-amber-500/30',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.2)]',
    bg: 'bg-gradient-to-br from-amber-900/20 to-yellow-900/30',
    icon: '⚖️',
  },
};

const trendConfig = {
  up: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', arrow: '▲' },
  down: { color: 'text-red-400', bg: 'bg-red-500/20', arrow: '▼' },
  neutral: { color: 'text-amber-400', bg: 'bg-amber-500/20', arrow: '◆' },
};

function InfographicCard({ data, levelIndex }: { data: ChoiceInfographic; levelIndex: number }) {
  const theme = THEME_STYLES[data.theme];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-xl border ${theme.border} ${theme.glow} ${theme.bg}`}
    >
      {/* Content - Compact */}
      <div className="relative p-3">
        {/* Header row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-sm shadow`}>
              {theme.icon}
            </div>
            <div>
              <h3 className={`text-base font-bold ${theme.accent} leading-tight`}>
                {data.headline}
              </h3>
              <p className="text-white/40 text-[11px] leading-tight">
                {data.subheadline}
              </p>
            </div>
          </div>
          <span className="text-white/20 text-[10px] font-mono">D{levelIndex + 1}</span>
        </div>

        {/* Key Stats Grid - Compact */}
        <div className="grid grid-cols-3 gap-1.5 mb-2">
          {data.keyStats.map((stat, i) => {
            const trend = trendConfig[stat.trend];
            return (
              <div
                key={i}
                className={`rounded-lg p-2 ${trend.bg} border border-white/5`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`text-base font-bold ${trend.color} flex items-center gap-0.5`}>
                    <span className="text-[10px] opacity-70">{trend.arrow}</span>
                    {stat.value}
                  </div>
                  <div className="text-white/40 text-[9px] font-mono uppercase tracking-wide leading-tight">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Insight quote - Compact */}
        <div className="relative pl-3 py-1.5 mb-2">
          <div className={`absolute left-0 top-0 bottom-0 w-0.5 rounded-full bg-gradient-to-b ${theme.gradient}`} />
          <p className="text-white/60 text-[11px] italic leading-snug">
            &ldquo;{data.insight}&rdquo;
          </p>
        </div>

        {/* Leadership Quality Badge - Compact */}
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border ${theme.border} ${theme.bg}`}>
          <span className="text-sm">{data.qualityIcon}</span>
          <div>
            <p className="text-white/30 text-[8px] font-mono uppercase tracking-wider leading-none">Leadership</p>
            <p className={`${theme.accent} text-xs font-semibold leading-tight`}>{data.leadershipQuality}</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={`h-0.5 bg-gradient-to-r ${theme.gradient}`} />
    </motion.div>
  );
}

function ChoiceHistory({ choices, questionSet = 'A' }: { choices: ChoiceOption[]; questionSet?: QuestionSet }) {
  if (choices.length === 0) return null;

  const choiceInfographics = getChoiceInfographics(questionSet);

  return (
    <div className="flex gap-1 flex-wrap">
      {choices.map((choice, index) => {
        const info = choiceInfographics[index + 1]?.[choice];
        
        return (
          <div
            key={index}
            className={`
              flex items-center gap-1 px-2 py-1 rounded-full border border-white/10
              ${choice === 'A' ? 'bg-blue-500/10' : choice === 'B' ? 'bg-purple-500/10' : 'bg-amber-500/10'}
            `}
          >
            <span className="text-[9px]">{info?.qualityIcon || '?'}</span>
            <span className={`
              text-[10px] font-bold
              ${choice === 'A' ? 'text-blue-400' : choice === 'B' ? 'text-purple-400' : 'text-amber-400'}
            `}>
              {choice}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function WaitingState({ levelTitle }: { levelTitle: string }) {
  return (
    <motion.div
      key="waiting"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col items-center justify-center text-center px-4"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-4xl mb-3"
      >
        🤔
      </motion.div>
      <p className="text-white/50 text-sm mb-1">Make your selection</p>
      <p className="text-white/30 text-xs">
        Choose your strategy for <span className="text-exl-orange">{levelTitle}</span>
      </p>
    </motion.div>
  );
}

export default function InfographicSidebar({ currentLevelIndex, choices, selectedChoice, questionSet = 'A' }: InfographicSidebarProps) {
  const levels = getLevels(questionSet);
  const choiceInfographics = getChoiceInfographics(questionSet);
  
  const currentLevel = levels[currentLevelIndex];
  const currentInfo = selectedChoice && choiceInfographics[currentLevelIndex + 1]
    ? choiceInfographics[currentLevelIndex + 1][selectedChoice]
    : null;

  const showWaiting = !selectedChoice && currentLevel;

  return (
    <div className="p-3 h-full flex flex-col overflow-hidden">
      {/* Header - Minimal */}
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/10">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">📊</span>
          <span className="font-medium text-white text-sm">Strategic Intel</span>
        </div>
        {choices.length > 0 && <ChoiceHistory choices={choices} questionSet={questionSet} />}
      </div>

      {/* Main Content - Fixed height, no scroll */}
      <div className="flex-1 flex flex-col justify-center min-h-0">
        <AnimatePresence mode="wait">
          {showWaiting && currentLevel && (
            <WaitingState levelTitle={currentLevel.title} />
          )}

          {currentInfo && (
            <InfographicCard 
              key={`${currentLevelIndex}-${selectedChoice}`}
              data={currentInfo} 
              levelIndex={currentLevelIndex}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Footer - Minimal */}
      <div className="pt-2 border-t border-white/5">
        <p className="text-white/15 text-[8px] text-center font-mono">
          Gartner • McKinsey • BCG • Deloitte
        </p>
      </div>
    </div>
  );
}
