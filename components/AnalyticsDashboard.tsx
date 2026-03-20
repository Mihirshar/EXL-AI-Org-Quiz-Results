'use client';

import { motion } from 'framer-motion';
import EXLLogo from './EXLLogo';
import ArchetypeBarChart from './charts/ArchetypeBarChart';
import LevelBarChart from './charts/LevelBarChart';
import Leaderboard from './charts/Leaderboard';
import { usePlayerContext } from '@/lib/playerContext';
import { useState, useEffect, useMemo } from 'react';
import { Player, LevelStats, ArchetypeStats } from '@/lib/types';
import { getAllPlayersFromFirestore } from '@/lib/db';
import { ARCHETYPES } from '@/lib/archetypes';

interface AnalyticsDashboardProps {
  onBack: () => void;
  onPlayAgain: () => void;
}

export default function AnalyticsDashboard({ onBack, onPlayAgain }: AnalyticsDashboardProps) {
  const { players: sessionPlayers } = usePlayerContext();
  const [dbPlayers, setDbPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getAllPlayersFromFirestore();
        setDbPlayers(data as Player[]);
      } catch (err) {
        console.error("Failed to load players from Firestore", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Merge session players with DB players (avoiding duplicates by id)
  const allPlayers = useMemo(() => {
    const map = new Map<string, Player>();
    dbPlayers.forEach(p => map.set(p.id, p));
    sessionPlayers.forEach(p => map.set(p.id, p));
    return Array.from(map.values());
  }, [dbPlayers, sessionPlayers]);

  const levelStats: LevelStats[] = useMemo(() => {
    const stats: Record<string, any> = {};
    allPlayers.forEach(p => {
      if (!stats[p.level]) {
        stats[p.level] = { level: p.level, count: 0, totalTV: 0, totalOR: 0, totalIV: 0, totalHR: 0 };
      }
      stats[p.level].count += 1;
      stats[p.level].totalTV += p.scores.TV;
      stats[p.level].totalOR += p.scores.OR;
      stats[p.level].totalIV += p.scores.IV;
      stats[p.level].totalHR += p.scores.HR;
    });

    return Object.values(stats).map(s => ({
      level: s.level,
      playerCount: s.count,
      avgTV: Math.round(s.totalTV / s.count),
      avgOR: Math.round(s.totalOR / s.count),
      avgIV: Math.round(s.totalIV / s.count),
      avgHR: Math.round(s.totalHR / s.count),
    }));
  }, [allPlayers]);

  const archetypeStats: ArchetypeStats[] = useMemo(() => {
    const counts: Record<string, number> = {};
    allPlayers.forEach(p => {
      counts[p.archetype] = (counts[p.archetype] || 0) + 1;
    });
    return Object.entries(counts).map(([id, count]) => {
      const arch = ARCHETYPES.find(a => a.id === id);
      return {
        name: arch ? arch.name : id,
        count,
        color: arch ? arch.color : '#666666'
      };
    }).sort((a, b) => b.count - a.count);
  }, [allPlayers]);

  const leaderboard = useMemo(() => {
    return [...allPlayers].sort((a, b) => b.scores.TV - a.scores.TV);
  }, [allPlayers]);

  const totalPlayers = allPlayers.length;
  const avgTV = totalPlayers > 0
    ? Math.round(allPlayers.reduce((sum, p) => sum + p.scores.TV, 0) / totalPlayers)
    : 0;
  const successRate = totalPlayers > 0
    ? Math.round((allPlayers.filter((p) => p.scores.TV > 35 && p.scores.OR < 40 && p.scores.HR > 0).length / totalPlayers) * 100)
    : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-full px-6 py-8 overflow-y-auto"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <EXLLogo size="sm" withGlow={false} />
            <div>
              <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
              <p className="text-white/50 text-sm">Live session performance metrics</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={onBack} className="btn-secondary text-sm">
              ← Back to Results
            </button>
            <button onClick={onPlayAgain} className="btn-primary text-sm">
              Play Again
            </button>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-surface border border-border rounded-xl p-5 text-center">
            <p className="text-white/40 font-mono text-xs uppercase tracking-wider mb-2">
              Total Players
            </p>
            <p className="text-4xl font-bold text-exl-orange">{totalPlayers}</p>
          </div>
          <div className="bg-surface border border-border rounded-xl p-5 text-center">
            <p className="text-white/40 font-mono text-xs uppercase tracking-wider mb-2">
              Avg Turnaround Value
            </p>
            <p className="text-4xl font-bold text-white">
              {avgTV > 0 ? '+' : ''}{avgTV}
            </p>
          </div>
          <div className="bg-surface border border-border rounded-xl p-5 text-center">
            <p className="text-white/40 font-mono text-xs uppercase tracking-wider mb-2">
              Success Rate
            </p>
            <p className="text-4xl font-bold text-exl-orange">{successRate}%</p>
          </div>
        </motion.div>

        {/* Charts Row - Bar Charts Only */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Archetype Distribution */}
          <motion.div
            variants={itemVariants}
            className="bg-surface border border-border rounded-2xl p-6"
          >
            <h2 className="font-mono text-xs text-white/40 uppercase tracking-wider mb-4">
              Leadership Archetype Distribution
            </h2>
            <ArchetypeBarChart data={archetypeStats} />
          </motion.div>

          {/* Level Performance */}
          <motion.div
            variants={itemVariants}
            className="bg-surface border border-border rounded-2xl p-6"
          >
            <h2 className="font-mono text-xs text-white/40 uppercase tracking-wider mb-4">
              Average TV Score by Level
            </h2>
            <LevelBarChart data={levelStats} />
          </motion.div>
        </div>

        {/* Leaderboard */}
        <motion.div
          variants={itemVariants}
          className="bg-surface border border-border rounded-2xl p-6"
        >
          <h2 className="font-mono text-xs text-white/40 uppercase tracking-wider mb-4">
            Session Leaderboard — Top Performers
          </h2>
          <Leaderboard players={leaderboard} maxRows={15} />
        </motion.div>

        {/* Footer */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-8 pb-8 text-white/30 text-sm flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <span className="animate-pulse">Syncing complete data from cloud...</span>
          ) : (
            <span>Live aggregated data across all organizations and sessions</span>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
