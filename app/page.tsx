'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayerProvider, usePlayerContext } from '@/lib/playerContext';
import RegistrationScreen from '@/components/RegistrationScreen';
import IntroScreen from '@/components/IntroScreen';
import GameScreen from '@/components/GameScreen';
import ResultScreen from '@/components/ResultScreen';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import MonthTimeline from '@/components/MonthTimeline';
import InfographicSidebar from '@/components/InfographicSidebar';
import StockTicker from '@/components/StockTicker';
import TickerSidebar from '@/components/TickerSidebar';
import ArchetypeReveal from '@/components/ArchetypeReveal';
import EXLLogo from '@/components/EXLLogo';
import {
  INITIAL_SCORES,
  Scores,
  generateSingleDisplayOrder,
  INITIAL_STOCK,
  calculateStockState,
  getTickerResult,
  getLevels,
  getChoiceInfographics,
  calculateScoresForSet,
  generateVariantIndicesForSet,
  generateDisplayOrderForSet,
  Level as GameLevel,
} from '@/lib/gameData';
import { determineArchetype, Archetype } from '@/lib/archetypes';
import { Level, StockState, ChoiceRecord, QuestionSet, ChoiceOption } from '@/lib/types';

type Phase = 'registration' | 'intro' | 'game' | 'calculating' | 'result' | 'dashboard';

const contentTransition = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3, ease: 'easeInOut' },
};

function GameContent() {
  const [phase, setPhase] = useState<Phase>('registration');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [choices, setChoices] = useState<ChoiceOption[]>([]);
  const [scores, setScores] = useState<Scores>(INITIAL_SCORES);
  const [finalArchetype, setFinalArchetype] = useState<Archetype | null>(null);
  const [currentSelectedChoice, setCurrentSelectedChoice] = useState<ChoiceOption | null>(null);

  // Question Set selected at intro screen
  const [questionSet, setQuestionSet] = useState<QuestionSet>('C');

  // Derived data based on question set
  const levels = getLevels(questionSet);
  const choiceInfographics = getChoiceInfographics(questionSet);

  const [variantIndices, setVariantIndices] = useState<{ A: number; B: number; C: number }[]>(() => generateVariantIndicesForSet(questionSet));
  const [displayOrder, setDisplayOrder] = useState<ChoiceOption[][]>(() => generateDisplayOrderForSet(questionSet));
  const [showTicker, setShowTicker] = useState(true);
  const [stockState, setStockState] = useState<StockState>(INITIAL_STOCK);
  const [choiceRecords, setChoiceRecords] = useState<ChoiceRecord[]>([]);
  const [showEdgeGlow, setShowEdgeGlow] = useState<'gain' | 'loss' | 'volatile' | null>(null);
  const [mobilePanel, setMobilePanel] = useState<'intel' | 'stock' | null>(null);

  const { setCurrentPlayer, addPlayer, currentPlayer, clearCurrentPlayer, updateCurrentPlayerAvatar } = usePlayerContext();

  const handleRegister = useCallback((name: string, level: Level, companyName?: string, photoUrl?: string, avatarUrl?: string, selfArchetypeId?: string) => {
    setCurrentPlayer(name, level, companyName, photoUrl, selfArchetypeId);
    if (avatarUrl) {
      updateCurrentPlayerAvatar(avatarUrl);
    }
    setPhase('intro');
  }, [setCurrentPlayer, updateCurrentPlayerAvatar]);

  const handleStart = useCallback(() => {
    setVariantIndices(generateVariantIndicesForSet(questionSet));
    setDisplayOrder(generateDisplayOrderForSet(questionSet));
    setPhase('game');
  }, [questionSet]);

  const handleChoice = useCallback((choice: ChoiceOption) => {
    setCurrentSelectedChoice(choice);

    // Immediately update stock price when option is selected
    const level = levels[currentLevel];
    const tickerResult = getTickerResult(level.id, choice, questionSet);
    const choiceInfo = choiceInfographics[level.id]?.[choice];

    const previewRecord: ChoiceRecord = {
      level: level.id,
      choice: choice,
      choiceLabel: choiceInfo?.headline || `Option ${choice}`,
      tickerResult,
      priceAfter: 0,
    };

    // Calculate from committed records + the preview selection
    const previewRecords = [...choiceRecords, previewRecord];
    const newStockState = calculateStockState(previewRecords);

    setStockState(newStockState);
  }, [currentLevel, choiceRecords, levels, questionSet, choiceInfographics]);

  const handleNext = useCallback(() => {
    if (currentSelectedChoice === null) return;

    const level = levels[currentLevel];
    const tickerResult = getTickerResult(level.id, currentSelectedChoice, questionSet);
    const choiceInfo = choiceInfographics[level.id]?.[currentSelectedChoice];

    // Commit the choice record (stock state already updated in handleChoice)
    const newRecord: ChoiceRecord = {
      level: level.id,
      choice: currentSelectedChoice,
      choiceLabel: choiceInfo?.headline || `Option ${currentSelectedChoice}`,
      tickerResult,
      priceAfter: stockState.price,
    };

    const newRecords = [...choiceRecords, newRecord];
    setChoiceRecords(newRecords);

    const newChoices = [...choices, currentSelectedChoice];
    setChoices(newChoices);
    setScores(calculateScoresForSet(newChoices, questionSet));

    setCurrentSelectedChoice(null);

    if (currentLevel < levels.length - 1) {
      const nextLevel = currentLevel + 1;
      setCurrentLevel(nextLevel);
      // Randomize display order for the next level
      setDisplayOrder(prev => {
        const newOrder = [...prev];
        newOrder[nextLevel] = generateSingleDisplayOrder(levels[nextLevel]);
        return newOrder;
      });
    } else {
      const finalScores = calculateScoresForSet(newChoices, questionSet);
      const archetype = determineArchetype(finalScores);
      setFinalArchetype(archetype);
      setPhase('calculating');
    }
  }, [currentLevel, choices, currentSelectedChoice, choiceRecords, stockState.price, levels, questionSet, choiceInfographics]);

  const handleUndo = useCallback(() => {
    if (choices.length > 0) {
      const newChoices = choices.slice(0, -1);
      const newRecords = choiceRecords.slice(0, -1);
      const prevLevel = Math.max(0, currentLevel - 1);
      setChoices(newChoices);
      setChoiceRecords(newRecords);
      setScores(calculateScoresForSet(newChoices, questionSet));
      setStockState(calculateStockState(newRecords));
      setCurrentLevel(prevLevel);
      setCurrentSelectedChoice(null);
      // Randomize display order for the level we're going back to
      setDisplayOrder(prev => {
        const newOrder = [...prev];
        newOrder[prevLevel] = generateSingleDisplayOrder(levels[prevLevel]);
        return newOrder;
      });
    }
  }, [choices, currentLevel, choiceRecords, questionSet]);

  const handleCalculationComplete = useCallback(() => {
    const finalScores = calculateScoresForSet(choices, questionSet);
    const archetype = determineArchetype(finalScores);

    if (currentPlayer) {
      addPlayer({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: currentPlayer.name,
        level: currentPlayer.level,
        scores: finalScores,
        archetype: archetype.id,
        selfArchetypeId: currentPlayer.selfArchetypeId,
        choices: choices,
        completedAt: new Date(),
        photoUrl: currentPlayer.photoUrl,
        avatarUrl: currentPlayer.avatarUrl,
      });
    }

    setPhase('result');
  }, [choices, currentPlayer, addPlayer, questionSet]);

  const handleViewDashboard = useCallback(() => {
    setPhase('dashboard');
  }, []);

  const handleBackToResults = useCallback(() => {
    setPhase('result');
  }, []);

  const handleReset = useCallback(() => {
    const newQuestionSet: QuestionSet = 'C';
    setQuestionSet(newQuestionSet);

    setPhase('registration');
    setCurrentLevel(0);
    setChoices([]);
    setChoiceRecords([]);
    setScores(INITIAL_SCORES);
    setStockState(INITIAL_STOCK);
    setFinalArchetype(null);
    setCurrentSelectedChoice(null);
    setVariantIndices(generateVariantIndicesForSet(newQuestionSet));
    setDisplayOrder(generateDisplayOrderForSet(newQuestionSet));
    clearCurrentPlayer();
  }, [clearCurrentPlayer]);

  const handleTickerFlash = useCallback((type: 'gain' | 'loss' | 'volatile') => {
    setShowEdgeGlow(type);
    setTimeout(() => setShowEdgeGlow(null), 2000);
  }, []);

  const showHeader = phase === 'game' || phase === 'calculating' || phase === 'result';
  const showSidebars = phase === 'game';
  const showTickerInHeader = phase === 'game';

  return (
    <main className="relative h-screen bg-background overflow-hidden flex flex-col">
      <BackgroundOrbs />

      {/* Persistent Header with Timeline */}
      <AnimatePresence>
        {showHeader && (
          <motion.header
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4 }}
            className="relative z-20 flex-shrink-0 border-b border-border/50 bg-background/80 backdrop-blur-sm"
          >
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
              <div className="flex items-center justify-between gap-2 md:gap-8">
                <EXLLogo size="sm" withGlow={false} />

                {/* Ticker - visible on tablet and up during game */}
                {showTickerInHeader && (
                  <div className="flex-1 max-w-md mx-2 md:mx-4 hidden md:block">
                    <StockTicker
                      stockState={stockState}
                      tickerSymbol={currentPlayer?.tickerSymbol}
                      onFlash={handleTickerFlash}
                    />
                  </div>
                )}

                <div className="flex-1 max-w-2xl hidden sm:block">
                  <MonthTimeline
                    currentLevel={currentLevel}
                    completedLevels={choices.length}
                    isComplete={phase === 'result' || phase === 'calculating'}
                  />
                </div>
                <div className="flex-1 sm:hidden text-center">
                  <span className="text-xs text-white/60 font-mono">
                    {phase === 'result' || phase === 'calculating' ? 'Complete' : `${currentLevel + 1}/5`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {currentPlayer && (
                    <>
                      {currentPlayer.avatarUrl || currentPlayer.photoUrl ? (
                        <img
                          src={currentPlayer.avatarUrl || currentPlayer.photoUrl}
                          alt={currentPlayer.name}
                          className="w-8 h-8 rounded-full border border-exl-orange/50"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-exl-orange/20 flex items-center justify-center text-exl-orange font-bold text-sm">
                          {currentPlayer.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex overflow-hidden">
        {/* Left Sidebar - Strategic Intel */}
        <AnimatePresence>
          {showSidebars && (
            <motion.aside
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="hidden md:flex flex-shrink-0 w-80 border-r border-border/50 bg-background/50 backdrop-blur-sm overflow-y-auto flex-col"
            >
              <InfographicSidebar
                currentLevelIndex={currentLevel}
                choices={choices}
                selectedChoice={currentSelectedChoice}
                questionSet={questionSet}
              />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {phase === 'registration' && (
              <motion.div key="registration" {...contentTransition} className="h-full">
                <RegistrationScreen onRegister={handleRegister} />
              </motion.div>
            )}

            {phase === 'intro' && (
              <motion.div key="intro" {...contentTransition} className="h-full">
                <IntroScreen
                  onStart={handleStart}
                  questionSet={questionSet}
                  onQuestionSetChange={setQuestionSet}
                />
              </motion.div>
            )}

            {phase === 'game' && (
              <motion.div key={`game-${currentLevel}`} {...contentTransition} className="h-full">
                <GameScreen
                  level={levels[currentLevel]}
                  currentLevelIndex={currentLevel}
                  scores={scores}
                  selectedChoice={currentSelectedChoice}
                  variantIndices={variantIndices[currentLevel]}
                  displayOrder={displayOrder[currentLevel]}
                  stockState={stockState}
                  onChoice={handleChoice}
                  onNext={handleNext}
                  onUndo={handleUndo}
                  onReset={handleReset}
                  canUndo={choices.length > 0}
                />
              </motion.div>
            )}

            {phase === 'calculating' && finalArchetype && (
              <motion.div key="calculating" {...contentTransition} className="h-full">
                <ArchetypeReveal
                  archetype={finalArchetype}
                  userAvatarUrl={currentPlayer?.avatarUrl || currentPlayer?.photoUrl}
                  onComplete={handleCalculationComplete}
                />
              </motion.div>
            )}

            {phase === 'result' && (
              <motion.div key="result" {...contentTransition} className="h-full">
                <ResultScreen
                  scores={scores}
                  choices={choices}
                  userAvatarUrl={currentPlayer?.avatarUrl || currentPlayer?.photoUrl}
                  stockState={stockState}
                  choiceRecords={choiceRecords}
                  tickerSymbol={currentPlayer?.tickerSymbol}
                  questionSet={questionSet}
                  onReset={handleReset}
                  onViewDashboard={handleViewDashboard}
                />
              </motion.div>
            )}

            {phase === 'dashboard' && (
              <motion.div key="dashboard" {...contentTransition} className="h-full">
                <AnalyticsDashboard
                  onBack={handleBackToResults}
                  onPlayAgain={handleReset}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Sidebar - Stock Ticker */}
        <AnimatePresence>
          {showSidebars && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.4 }}
              className="hidden lg:flex flex-shrink-0 relative"
            >
              {/* Toggle Button */}
              <button
                onClick={() => setShowTicker(!showTicker)}
                className="absolute -left-3 top-4 z-20 w-6 h-12 bg-surface border border-border/50 rounded-l-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                title={showTicker ? 'Hide ticker' : 'Show ticker'}
              >
                <svg
                  className={`w-4 h-4 text-white/60 transition-transform duration-300 ${showTicker ? '' : 'rotate-180'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Sidebar Content */}
              <aside
                className={`
                  w-80 xl:w-96 border-l border-border/50 bg-background/50 backdrop-blur-sm overflow-y-auto flex-col flex
                  transition-all duration-300 ease-in-out
                  ${showTicker ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}
                `}
              >
                <TickerSidebar
                  stockState={stockState}
                  choiceRecords={choiceRecords}
                  currentLevelIndex={currentLevel}
                  tickerSymbol={currentPlayer?.tickerSymbol}
                  companyName={currentPlayer?.companyName}
                />
              </aside>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Bottom Sheet Overlays — only during game phase */}
      <AnimatePresence>
        {showSidebars && mobilePanel !== null && (
          <motion.div
            key="mobile-overlay-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobilePanel(null)}
            className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSidebars && mobilePanel === 'intel' && (
          <motion.div
            key="mobile-intel"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-[80vh] bg-background border-t border-border/60 rounded-t-2xl overflow-hidden flex flex-col"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>
            <div className="flex-1 overflow-y-auto">
              <InfographicSidebar
                currentLevelIndex={currentLevel}
                choices={choices}
                selectedChoice={currentSelectedChoice}
                questionSet={questionSet}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSidebars && mobilePanel === 'stock' && (
          <motion.div
            key="mobile-stock"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-[80vh] bg-background border-t border-border/60 rounded-t-2xl overflow-hidden flex flex-col"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>
            <div className="flex-1 overflow-y-auto">
              <TickerSidebar
                stockState={stockState}
                choiceRecords={choiceRecords}
                currentLevelIndex={currentLevel}
                tickerSymbol={currentPlayer?.tickerSymbol}
                companyName={currentPlayer?.companyName}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Floating Bottom Bar — only during game phase */}
      <AnimatePresence>
        {showSidebars && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-3 py-2 bg-surface/90 backdrop-blur-md border border-border/60 rounded-full shadow-2xl"
          >
            <button
              onClick={() => setMobilePanel(mobilePanel === 'intel' ? null : 'intel')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${mobilePanel === 'intel'
                ? 'bg-exl-orange text-white shadow-[0_0_12px_rgba(242,101,34,0.5)]'
                : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
            >
              <span>📊</span> Intel
            </button>
            <div className="w-px h-4 bg-white/20" />
            <button
              onClick={() => setMobilePanel(mobilePanel === 'stock' ? null : 'stock')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${mobilePanel === 'stock'
                ? 'bg-ticker-gain/20 text-ticker-gain shadow-[0_0_12px_rgba(0,255,136,0.3)]'
                : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
            >
              <span>📈</span> ${stockState.price.toFixed(0)}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function Home() {
  return (
    <PlayerProvider>
      <GameContent />
    </PlayerProvider>
  );
}
