'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Archetype } from '@/lib/archetypes';
import { Scores } from '@/lib/gameData';
import { ChoiceOption } from '@/lib/types';

interface StrategicAdviceProps {
  archetype: Archetype;
  scores: Scores;
  choices: ChoiceOption[];
  playerName: string;
  isWinner: boolean;
}

interface AdviceContent {
  headline: string;
  keyStrengths: string[];
  areasForGrowth: string[];
  nextSteps: string[];
  industryBenchmark: string;
}

const ARCHETYPE_ADVICE: Record<string, AdviceContent> = {
  'balanced-catalyst': {
    headline: 'You\'ve mastered the art of sustainable AI transformation',
    keyStrengths: [
      'Excellent balance between technology investment and human development',
      'Strong risk management while maintaining innovation velocity',
      'Built genuine organizational buy-in for AI initiatives',
    ],
    areasForGrowth: [
      'Consider accelerating pilot programs once foundation is solid',
      'Explore more aggressive automation in low-risk areas',
      'Build centers of excellence to scale best practices',
    ],
    nextSteps: [
      'Document your transformation playbook for future initiatives',
      'Identify "AI Champions" within each business unit',
      'Establish metrics for measuring long-term AI ROI',
    ],
    industryBenchmark: 'Top 15% of enterprise AI transformations',
  },
  'technology-accelerator': {
    headline: 'Your speed-to-market is exceptional, now focus on sustainability',
    keyStrengths: [
      'Rapid technology deployment and adoption',
      'Strong bias for action and execution',
      'Early mover advantage in AI capabilities',
    ],
    areasForGrowth: [
      'Invest more heavily in change management and training',
      'Build governance frameworks before scaling further',
      'Create feedback loops between tech teams and business users',
    ],
    nextSteps: [
      'Launch an AI literacy program within 30 days',
      'Establish weekly "tech-business" alignment meetings',
      'Create a technology adoption scorecard with human readiness metrics',
    ],
    industryBenchmark: 'Top 25% for innovation velocity, opportunity to improve sustainability',
  },
  'governance-champion': {
    headline: 'Your risk management is world-class, time to unlock growth',
    keyStrengths: [
      'Exceptional compliance and security posture',
      'Strong stakeholder trust and confidence',
      'Robust foundation for sustainable scaling',
    ],
    areasForGrowth: [
      'Identify "safe-to-fail" experiments to accelerate learning',
      'Create fast-track approval paths for low-risk AI initiatives',
      'Balance protection with innovation velocity',
    ],
    nextSteps: [
      'Define a "risk appetite" framework for AI experimentation',
      'Launch a controlled pilot in a non-critical business area',
      'Create an AI innovation sandbox with appropriate guardrails',
    ],
    industryBenchmark: 'Top 10% for risk management, opportunity in value generation',
  },
  'efficiency-optimizer': {
    headline: 'Strong financial engineering, now invest in your people',
    keyStrengths: [
      'Excellent short-term financial impact',
      'Clear ROI demonstration to stakeholders',
      'Streamlined operations and reduced costs',
    ],
    areasForGrowth: [
      'Reinvest efficiency gains into workforce development',
      'Balance cost-cutting with capability building',
      'Focus on employee retention and engagement',
    ],
    nextSteps: [
      'Allocate 20% of savings to upskilling programs',
      'Create new value-add roles for displaced workers',
      'Develop AI-augmented career paths for high performers',
    ],
    industryBenchmark: 'Top 20% for efficiency, priority area is human capital',
  },
};

export default function StrategicAdvice({
  archetype,
  scores,
  choices,
  playerName,
  isWinner,
}: StrategicAdviceProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [displayedItems, setDisplayedItems] = useState(0);

  const advice = ARCHETYPE_ADVICE[archetype.id] || ARCHETYPE_ADVICE['balanced-catalyst'];

  useEffect(() => {
    if (isExpanded) {
      const totalItems = advice.keyStrengths.length + advice.areasForGrowth.length + advice.nextSteps.length;
      let current = 0;
      const interval = setInterval(() => {
        current++;
        setDisplayedItems(current);
        if (current >= totalItems) {
          clearInterval(interval);
        }
      }, 150);
      return () => clearInterval(interval);
    }
  }, [isExpanded, advice]);

  const getItemIndex = (section: 'strengths' | 'growth' | 'steps', index: number) => {
    if (section === 'strengths') return index;
    if (section === 'growth') return advice.keyStrengths.length + index;
    return advice.keyStrengths.length + advice.areasForGrowth.length + index;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-surface to-surface/50 rounded-xl border border-border overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-exl-orange/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-exl-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="text-left">
            <h3 className="text-white font-semibold text-sm">Personalized Strategic Advice</h3>
            <p className="text-white/50 text-xs">Based on your decisions and leadership profile</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              {/* Headline */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 rounded-lg bg-exl-orange/10 border border-exl-orange/20"
              >
                <p className="text-exl-orange font-medium text-sm">
                  {playerName}, {advice.headline}
                </p>
              </motion.div>

              {/* Key Strengths */}
              <div>
                <h4 className="text-white/60 text-xs font-mono uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="text-green-400">●</span> Key Strengths
                </h4>
                <ul className="space-y-1.5">
                  {advice.keyStrengths.map((strength, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ 
                        opacity: displayedItems > getItemIndex('strengths', i) ? 1 : 0,
                        x: displayedItems > getItemIndex('strengths', i) ? 0 : -10,
                      }}
                      className="flex items-start gap-2 text-sm text-white/70"
                    >
                      <span className="text-green-400 mt-1">✓</span>
                      {strength}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Areas for Growth */}
              <div>
                <h4 className="text-white/60 text-xs font-mono uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="text-amber-400">●</span> Areas for Growth
                </h4>
                <ul className="space-y-1.5">
                  {advice.areasForGrowth.map((area, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ 
                        opacity: displayedItems > getItemIndex('growth', i) ? 1 : 0,
                        x: displayedItems > getItemIndex('growth', i) ? 0 : -10,
                      }}
                      className="flex items-start gap-2 text-sm text-white/70"
                    >
                      <span className="text-amber-400 mt-1">→</span>
                      {area}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Next Steps */}
              <div>
                <h4 className="text-white/60 text-xs font-mono uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="text-blue-400">●</span> Recommended Next Steps
                </h4>
                <ul className="space-y-1.5">
                  {advice.nextSteps.map((step, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ 
                        opacity: displayedItems > getItemIndex('steps', i) ? 1 : 0,
                        x: displayedItems > getItemIndex('steps', i) ? 0 : -10,
                      }}
                      className="flex items-start gap-2 text-sm text-white/70"
                    >
                      <span className="text-blue-400 font-mono text-xs mt-0.5">{i + 1}.</span>
                      {step}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Industry Benchmark */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: displayedItems > advice.keyStrengths.length + advice.areasForGrowth.length + advice.nextSteps.length - 1 ? 1 : 0 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10"
              >
                <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-white/60 text-xs">
                  Industry Benchmark: <span className="text-white font-medium">{advice.industryBenchmark}</span>
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
