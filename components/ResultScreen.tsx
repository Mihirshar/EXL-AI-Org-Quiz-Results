'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScoreMeter from './ScoreMeter';
import ShareCertificate from './ShareCertificate';
import { Scores, SCORE_METRICS, getLevels } from '@/lib/gameData';
import { determineArchetype, isWinningOutcome, ARCHETYPES } from '@/lib/archetypes';
import { usePlayerContext } from '@/lib/playerContext';
import { useConfetti } from '@/lib/useConfetti';
import { StockState, ChoiceRecord, QuestionSet } from '@/lib/types';
import Image from 'next/image';

interface ResultScreenProps {
  scores: Scores;
  choices: ('A' | 'B')[];
  userAvatarUrl?: string;
  stockState?: StockState;
  choiceRecords?: ChoiceRecord[];
  tickerSymbol?: string;
  questionSet?: QuestionSet;
  onReset: () => void;
  onViewDashboard: () => void;
}

function MiniStockChart({ data, height = 60 }: { data: number[]; height?: number }) {
  if (data.length < 2) return null;

  const min = Math.min(...data) * 0.98;
  const max = Math.max(...data) * 1.02;
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = height - ((value - min) / range) * height;
    return { x, y, value };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const isPositive = data[data.length - 1] >= data[0];
  const color = isPositive ? '#00FF88' : '#FF3B3B';

  return (
    <svg width="100%" height={height} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="miniChartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      {points.map((point, i) => (
        <motion.circle
          key={i}
          cx={point.x}
          cy={point.y}
          r={i === points.length - 1 ? 4 : 2}
          fill={color}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 + i * 0.1 }}
        />
      ))}
    </svg>
  );
}

function getMarketVerdict(changePercent: number): { label: string; color: string; icon: string; description: string } {
  if (changePercent >= 20) {
    return { label: 'EUPHORIC', color: '#00FF88', icon: '🚀', description: 'Exceptional shareholder value created' };
  } else if (changePercent >= 10) {
    return { label: 'BULLISH', color: '#00FF88', icon: '📈', description: 'Strong market confidence in leadership' };
  } else if (changePercent >= 0) {
    return { label: 'CAUTIOUS', color: '#FFB800', icon: '📊', description: 'Steady performance, room for growth' };
  } else if (changePercent >= -10) {
    return { label: 'NERVOUS', color: '#FFB800', icon: '😰', description: 'Market uncertainty, recovery possible' };
  } else {
    return { label: 'PANIC', color: '#FF3B3B', icon: '📉', description: 'Significant value destruction' };
  }
}

function getInvestmentInsight(changePercent: number): string {
  if (changePercent >= 20) {
    return "Your strategic decisions created exceptional shareholder value. The market rewarded your bold vision with a transformative rally.";
  } else if (changePercent >= 10) {
    return "Solid market performance reflecting balanced leadership. Investors see a company positioned for sustainable growth.";
  } else if (changePercent >= 0) {
    return "A cautious approach maintained market stability. While not explosive, your steady hand preserved investor confidence.";
  } else if (changePercent >= -10) {
    return "Market uncertainty reflected in modest decline. Strategic pivots created short-term volatility but recovery remains possible.";
  } else {
    return "Aggressive pivots created significant market volatility. Investors are seeking clarity on the path forward.";
  }
}

export default function ResultScreen({ scores, choices, userAvatarUrl, stockState, choiceRecords, tickerSymbol = 'EXLS', questionSet, onReset, onViewDashboard }: ResultScreenProps) {
  const archetype = determineArchetype(scores);
  const isWinner = isWinningOutcome(scores);
  const { players, currentPlayer } = usePlayerContext();
  const selfArchetype = currentPlayer?.selfArchetypeId
    ? ARCHETYPES.find((a) => a.id === currentPlayer.selfArchetypeId)
    : null;

  const hasMultiplePlayers = players.length > 1;
  const [showCertificate, setShowCertificate] = useState(false);
  const [showKnowledgeGraph, setShowKnowledgeGraph] = useState(false);
  const { fireSuccess, fireStars } = useConfetti();

  useEffect(() => {
    if (isWinner) {
      const timer = setTimeout(() => {
        fireSuccess();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isWinner, fireSuccess]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Compact Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-3 border-b border-border/30 flex-shrink-0"
      >
        <p className="font-mono text-[9px] text-exl-orange tracking-[0.2em] uppercase mb-0.5">
          Month 12 · Strategy Audit Complete
        </p>
        <h1 className="text-lg font-bold text-white">
          {isWinner ? '🎉 Transformation Complete' : 'Strategy Analysis Complete'}
        </h1>
      </motion.div>

      {/* Main Content - Two Column Layout (stacks on mobile) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Column - Results */}
        <div className="flex-1 p-3 md:p-4 overflow-y-auto">
          <div className="max-w-xl mx-auto space-y-4">
            {/* User Info & Choices Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                {userAvatarUrl && (
                  <img 
                    src={userAvatarUrl} 
                    alt="You"
                    className="w-10 h-10 rounded-full border-2 border-exl-orange object-cover"
                  />
                )}
                <div>
                  <p className="text-white font-medium text-sm">{currentPlayer?.name || 'Strategist'}</p>
                  <p className="text-white/40 text-xs">{currentPlayer?.level}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {choices.map((choice, index) => (
                  <span
                    key={index}
                    className={`font-mono font-bold px-2 py-0.5 rounded text-xs
                      ${choice === 'A' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}
                    `}
                  >
                    {choice}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Scorecard - Compact Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="font-mono text-[9px] text-white/40 uppercase tracking-wider mb-2">Your Scorecard</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                {SCORE_METRICS.map((metric, index) => (
                  <ScoreMeter
                    key={metric.key}
                    label={metric.name}
                    scoreKey={metric.key}
                    value={scores[metric.key]}
                    delay={0.4 + index * 0.05}
                    compact={true}
                  />
                ))}
              </div>
            </motion.div>

            {/* Archetype Result - Compact */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-surface border border-border rounded-xl p-4"
              style={{ borderColor: `${archetype.color}40` }}
            >
              <div className="flex items-start gap-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: `${archetype.color}20` }}
                >
                  {archetype.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[9px] text-white/40 uppercase tracking-wider">You Are</p>
                  <h3 className="text-white font-bold text-lg leading-tight">{archetype.name}</h3>
                  <p className="text-white/50 text-xs">{archetype.subtitle}</p>
                </div>
              </div>
              <p className="text-white/60 text-xs leading-relaxed mt-3 line-clamp-3">
                {archetype.diagnosis}
              </p>
            </motion.div>

            {/* Self vs Actual Comparison - Compact */}
            {selfArchetype && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-surface/50 border border-border rounded-lg p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{selfArchetype.icon}</span>
                    <div>
                      <p className="text-[9px] text-white/40 uppercase">You Said</p>
                      <p className="text-white text-xs font-medium">{selfArchetype.name.replace('The ', '')}</p>
                    </div>
                  </div>
                  <div className="text-white/30">→</div>
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="text-[9px] text-white/40 uppercase text-right">Reality</p>
                      <p className="text-white text-xs font-medium">{archetype.name.replace('The ', '')}</p>
                    </div>
                    <span className="text-lg">{archetype.icon}</span>
                  </div>
                  <div className="ml-2">
                    {selfArchetype.id === archetype.id ? (
                      <span className="text-green-400 text-lg">✓</span>
                    ) : (
                      <span className="text-amber-400 text-lg">!</span>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Stock Performance Card */}
            {stockState && choiceRecords && choiceRecords.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                className="bg-surface border border-border rounded-xl p-4"
                style={{ borderColor: stockState.change >= 0 ? '#00FF8840' : '#FF3B3B40' }}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: stockState.change >= 0 ? '#00FF88' : '#FF3B3B' }}
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <span className="font-mono text-sm font-bold text-white">{tickerSymbol}</span>
                    <span className="text-white/40 text-[10px] font-mono">NYSE</span>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/50">
                    MARKET CLOSED
                  </span>
                </div>

                {/* Price and Return */}
                <div className="flex items-end justify-between mb-3">
                  <div>
                    <p className="text-white/50 text-[9px] font-mono uppercase tracking-wider mb-1">Final Price</p>
                    <motion.p
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.8, type: "spring" }}
                      className="font-mono text-2xl font-bold text-white"
                    >
                      ${stockState.price.toFixed(2)}
                    </motion.p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/50 text-[9px] font-mono uppercase tracking-wider mb-1">Total Return</p>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.9, type: "spring" }}
                      className={`
                        px-2 py-1 rounded font-mono text-sm font-bold
                        ${stockState.change >= 0 ? 'bg-ticker-gain/20 text-ticker-gain' : 'bg-ticker-loss/20 text-ticker-loss'}
                      `}
                    >
                      {stockState.change >= 0 ? '▲' : '▼'} {stockState.change >= 0 ? '+' : ''}{stockState.changePercent.toFixed(1)}%
                    </motion.div>
                  </div>
                </div>

                {/* Mini Chart */}
                <div className="mb-3 p-2 bg-white/5 rounded-lg">
                  <MiniStockChart data={stockState.history} height={50} />
                </div>

                {/* Market Verdict */}
                {(() => {
                  const verdict = getMarketVerdict(stockState.changePercent);
                  return (
                    <div className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: `${verdict.color}10` }}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{verdict.icon}</span>
                        <div>
                          <p className="text-white/50 text-[8px] font-mono uppercase">Market Verdict</p>
                          <p className="font-mono text-xs font-bold" style={{ color: verdict.color }}>
                            {verdict.label}
                          </p>
                        </div>
                      </div>
                      <p className="text-white/40 text-[10px] text-right max-w-[140px]">
                        {verdict.description}
                      </p>
                    </div>
                  );
                })()}

                {/* Decision Timeline */}
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-white/50 text-[9px] font-mono uppercase tracking-wider mb-2">
                    Decision Impact Timeline
                  </p>
                  <div className="space-y-1.5">
                    {choiceRecords.map((record, index) => {
                      const level = getLevels(questionSet || 'A')[index];
                      const tc = {
                        gain: { text: 'text-ticker-gain', bg: 'bg-ticker-gain/10', icon: '🟢' },
                        loss: { text: 'text-ticker-loss', bg: 'bg-ticker-loss/10', icon: '🔴' },
                        volatile: { text: 'text-ticker-volatile', bg: 'bg-ticker-volatile/10', icon: '🟡' },
                      }[record.tickerResult.type];

                      return (
                        <motion.div
                          key={record.level}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1 + index * 0.1 }}
                          className={`flex items-center justify-between p-2 rounded-lg ${tc.bg}`}
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <span className="text-xs flex-shrink-0">{tc.icon}</span>
                            <div className="min-w-0 flex-1">
                              <p className="text-white text-[10px] font-medium truncate">
                                M{level.month?.replace('Month ', '') || index + 1}: {level.title}
                              </p>
                              <p className="text-white/40 text-[9px] italic truncate">
                                {record.tickerResult.analystNote}
                              </p>
                            </div>
                          </div>
                          <p className={`font-mono text-[10px] font-bold flex-shrink-0 ml-2 ${tc.text}`}>
                            {record.tickerResult.percent >= 0 ? '+' : ''}{record.tickerResult.percent.toFixed(1)}%
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Investment Insight */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="mt-3 pt-3 border-t border-white/10"
                >
                  <p className="text-white/50 text-[9px] font-mono uppercase tracking-wider mb-1">
                    Analyst Summary
                  </p>
                  <p className="text-white/60 text-xs leading-relaxed italic">
                    &ldquo;{getInvestmentInsight(stockState.changePercent)}&rdquo;
                  </p>
                </motion.div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-2 pt-2"
            >
              <button onClick={onReset} className="btn-primary text-sm py-2 px-4">
                Play Again
              </button>
              <button
                onClick={() => {
                  fireStars();
                  setShowCertificate(true);
                }}
                className="btn-secondary text-sm py-2 px-4"
              >
                Certificate
              </button>
              <button
                onClick={() => setShowKnowledgeGraph(true)}
                className="btn-secondary text-sm py-2 px-4"
              >
                Knowledge Graph
              </button>
              {hasMultiplePlayers && (
                <button onClick={onViewDashboard} className="btn-secondary text-sm py-2 px-4">
                  Analytics
                </button>
              )}
            </motion.div>
          </div>
        </div>

        {/* Right Column - Infographic (hidden on mobile, shown at bottom on tablet, side on desktop) */}
        {archetype.infographicImage && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="hidden sm:flex w-full lg:w-[45%] flex-shrink-0 p-3 md:p-4 border-t lg:border-t-0 lg:border-l border-border/30 items-center justify-center"
          >
            <div 
              className="relative w-full h-64 sm:h-80 lg:h-full lg:max-h-[500px] rounded-xl overflow-hidden border-2"
              style={{ 
                borderColor: `${archetype.color}50`,
                boxShadow: `0 0 40px ${archetype.color}20`
              }}
            >
              <Image
                src={archetype.infographicImage}
                alt={`${archetype.name} Leadership Profile`}
                fill
                className="object-contain bg-black/20"
                priority
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              
              {/* Bottom label */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent"
              >
                <div className="flex items-center gap-2">
                  <span 
                    className="text-xl p-1.5 rounded-lg"
                    style={{ backgroundColor: `${archetype.color}30` }}
                  >
                    {archetype.icon}
                  </span>
                  <div>
                    <p className="text-white font-semibold text-sm">{archetype.name}</p>
                    <p className="text-white/60 text-[10px]">{archetype.subtitle}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Certificate Modal */}
      <AnimatePresence>
        {showCertificate && (
          <ShareCertificate
            playerName={currentPlayer?.name || 'Strategist'}
            playerLevel={currentPlayer?.level}
            archetype={archetype}
            scores={scores}
            isWinner={isWinner}
            avatarUrl={userAvatarUrl}
            onClose={() => setShowCertificate(false)}
          />
        )}
      </AnimatePresence>

      {/* Knowledge Graph Overlay */}
      <AnimatePresence>
        {showKnowledgeGraph && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center px-4 py-6"
          >
            <div className="w-full max-w-6xl mb-4 flex justify-between items-center">
              <p className="text-white/70 text-sm md:text-base font-medium">
                EXL AI Conclave: The Knowledge Graph of Enterprise Consequence
              </p>
              <button
                onClick={() => setShowKnowledgeGraph(false)}
                className="text-white/70 hover:text-white text-sm px-3 py-1 rounded border border-white/30 hover:border-white transition-colors"
              >
                Close
              </button>
            </div>
            <div className="relative w-full max-w-6xl aspect-[16/9] rounded-xl overflow-hidden border border-white/20 bg-black">
              <Image
                src="/knowledge-graph-enterprise-consequence.png"
                alt="Knowledge Graph of Enterprise Consequence"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
