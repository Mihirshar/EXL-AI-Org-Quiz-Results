'use client';

import { motion } from 'framer-motion';
import EXLLogo from './EXLLogo';
import { SCORE_METRICS } from '@/lib/gameData';
import type { QuestionSet } from '@/lib/types';

interface IntroScreenProps {
  onStart: () => void;
  questionSet: QuestionSet;
  onQuestionSetChange: (set: QuestionSet) => void;
}

export default function IntroScreen({ onStart, questionSet, onQuestionSetChange }: IntroScreenProps) {
  const formatTarget = (target: string) => {
    const trimmed = target.trim();
    if (trimmed.startsWith('>')) {
      const value = trimmed.replace(/[>+]/g, '').trim();
      return `More than ${value}`;
    }
    if (trimmed.startsWith('<')) {
      const value = trimmed.replace(/[<+]/g, '').trim();
      return `Less than ${value}`;
    }
    return trimmed.replace('+', '').trim();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-full flex flex-col items-center justify-center px-4 md:px-6 py-8 md:py-12"
    >
      <div className="max-w-3xl w-full text-center">
        {/* Logo */}
        <motion.div variants={itemVariants} className="mb-8">
          <EXLLogo size="lg" />
        </motion.div>

        {/* Eyebrow */}
        <motion.p
          variants={itemVariants}
          className="text-exl-orange font-mono text-xs tracking-[0.3em] uppercase mb-4"
        >
          AI Strategy Simulation
        </motion.p>

        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 gradient-text"
        >
          AI Org Board Challenge
        </motion.h1>

        {/* Hook */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-white/70 mb-4 leading-relaxed"
        >
          Welcome. We aren&apos;t here to look at theoretical, five-year technology roadmaps.
          We are here to execute an aggressive, <span className="text-exl-orange font-semibold">12-month turnaround</span>.
        </motion.p>

        {/* Mandate */}
        <motion.div
          variants={itemVariants}
          className="bg-surface border border-border rounded-2xl p-6 mb-8"
        >
          <p className="text-white/50 font-mono text-xs tracking-wider uppercase mb-3">
            Your Mandate
          </p>
          <p className="text-xl md:text-2xl text-white font-medium">
            Generate a <span className="text-exl-orange font-bold">30–40% surge</span> in enterprise value
            over the next four quarters using AI.
          </p>
        </motion.div>

        {/* Scorecard Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8"
        >
          {SCORE_METRICS.map((metric) => (
            <div
              key={metric.key}
              className="bg-surface-light border border-border rounded-xl p-4 text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-exl-orange font-bold">{metric.key}</span>
                <span className="text-white/30 text-xs">|</span>
                <span className="text-white/50 text-sm">{metric.name}</span>
              </div>
              <p className="text-white/40 text-xs mb-2">{metric.description}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-white/30">Target:</span>
                <span className={`text-xs font-mono font-semibold ${metric.isLimit ? 'text-failure' : 'text-success'}`}>
                  {formatTarget(metric.target)}
                </span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Blind Run Notice */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-border" />
          <p className="font-mono text-xs tracking-[0.2em] text-white/40 uppercase">
            5 Decisions · Blind Run · Reveal at Month 12
          </p>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-border" />
        </motion.div>


        {/* CTA Button */}
        <motion.button
          variants={itemVariants}
          onClick={onStart}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary text-lg group"
        >
          Accept the Mandate
          <motion.span
            className="inline-block ml-2"
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
        </motion.button>
      </div>
    </motion.div>
  );
}
