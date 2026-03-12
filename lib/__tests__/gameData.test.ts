import { describe, it, expect } from 'vitest';
import {
  calculateScoresForSet,
  getLevels,
  selectRandomSet,
  INITIAL_SCORES,
  TOTAL_LEVELS,
} from '@/lib/gameData';
import type { QuestionSet } from '@/lib/types';

describe('getLevels', () => {
  it('returns Set A levels when questionSet is A', () => {
    const levels = getLevels('A');
    expect(levels).toHaveLength(TOTAL_LEVELS);
    expect(levels[0].id).toBe(1);
    expect(levels[0].title).toBeDefined();
    expect(levels[0].scoring).toHaveProperty('A');
    expect(levels[0].scoring).toHaveProperty('B');
  });

  it('returns Set B levels when questionSet is B', () => {
    const levelsA = getLevels('A');
    const levelsB = getLevels('B');
    expect(levelsB).toHaveLength(TOTAL_LEVELS);
    expect(levelsB[0].id).toBe(1);
    expect(levelsB[0].title).toBeDefined();
    expect(levelsB[0].scoring).toHaveProperty('A');
    expect(levelsB[0].scoring).toHaveProperty('B');
    expect(levelsB).not.toBe(levelsA);
  });
});

describe('selectRandomSet', () => {
  it('returns only "A" or "B"', () => {
    const valid: QuestionSet[] = ['A', 'B'];
    for (let i = 0; i < 20; i++) {
      expect(valid).toContain(selectRandomSet());
    }
  });

  it('returns both A and B over many calls', () => {
    const results = new Set<QuestionSet>();
    for (let i = 0; i < 100; i++) {
      results.add(selectRandomSet());
    }
    expect(results.has('A')).toBe(true);
    expect(results.has('B')).toBe(true);
  });
});

describe('calculateScoresForSet', () => {
  it('returns initial scores when choices array is empty', () => {
    expect(calculateScoresForSet([], 'A')).toEqual(INITIAL_SCORES);
    expect(calculateScoresForSet([], 'B')).toEqual(INITIAL_SCORES);
  });

  it('accumulates scores correctly for one level (Set A level 1)', () => {
    const levels = getLevels('A');
    const level1 = levels[0];
    const choiceA = level1.scoring.A;
    const choiceB = level1.scoring.B;

    const scoresA = calculateScoresForSet(['A'], 'A');
    expect(scoresA.IV).toBe(INITIAL_SCORES.IV + choiceA.IV);
    expect(scoresA.OR).toBe(INITIAL_SCORES.OR + choiceA.OR);
    expect(scoresA.HR).toBe(INITIAL_SCORES.HR + choiceA.HR);
    expect(scoresA.TV).toBe(INITIAL_SCORES.TV + choiceA.TV);

    const scoresB = calculateScoresForSet(['B'], 'A');
    expect(scoresB.IV).toBe(INITIAL_SCORES.IV + choiceB.IV);
    expect(scoresB.OR).toBe(INITIAL_SCORES.OR + choiceB.OR);
    expect(scoresB.HR).toBe(INITIAL_SCORES.HR + choiceB.HR);
    expect(scoresB.TV).toBe(INITIAL_SCORES.TV + choiceB.TV);
  });

  it('accumulates scores for all 5 levels', () => {
    const choices: ('A' | 'B')[] = ['A', 'B', 'A', 'B', 'B'];
    const scores = calculateScoresForSet(choices, 'A');
    expect(typeof scores.IV).toBe('number');
    expect(typeof scores.OR).toBe('number');
    expect(typeof scores.HR).toBe('number');
    expect(typeof scores.TV).toBe('number');
  });

  it('produces different totals for Set A vs Set B with same choice pattern', () => {
    const choices: ('A' | 'B')[] = ['B', 'B', 'B', 'A', 'B'];
    const scoresA = calculateScoresForSet(choices, 'A');
    const scoresB = calculateScoresForSet(choices, 'B');
    expect(scoresA).not.toEqual(scoresB);
  });
});
