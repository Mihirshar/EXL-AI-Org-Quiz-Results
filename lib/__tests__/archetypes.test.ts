import { describe, it, expect } from 'vitest';
import { determineArchetype, isWinningOutcome } from '@/lib/archetypes';
import type { Scores } from '@/lib/gameData';

describe('determineArchetype', () => {
  it('returns Balanced Catalyst when TV > 35, OR < 40, HR > 20, IV > 0', () => {
    const scores: Scores = { TV: 55, OR: 25, HR: 60, IV: 10 };
    const archetype = determineArchetype(scores);
    expect(archetype.id).toBe('balanced-catalyst');
  });

  it('returns Technology Accelerator when IV > 40 and (OR >= 20 or HR <= 10)', () => {
    const scores: Scores = { TV: 30, OR: 50, HR: -50, IV: 95 };
    const archetype = determineArchetype(scores);
    expect(archetype.id).toBe('technology-accelerator');
  });

  it('returns Efficiency Optimizer when TV >= 35 and HR < 0', () => {
    const scores: Scores = { TV: 40, OR: 30, HR: -20, IV: 10 };
    const archetype = determineArchetype(scores);
    expect(archetype.id).toBe('efficiency-optimizer');
  });

  it('returns Governance Champion when OR < 20 and (TV <= 35 or IV <= 20)', () => {
    const scores: Scores = { TV: 25, OR: 10, HR: 15, IV: 5 };
    const archetype = determineArchetype(scores);
    expect(archetype.id).toBe('governance-champion');
  });

  it('does not return Balanced Catalyst when HR <= 20', () => {
    const scores: Scores = { TV: 40, OR: 30, HR: 15, IV: 10 };
    const archetype = determineArchetype(scores);
    expect(archetype.id).not.toBe('balanced-catalyst');
  });

  it('does not return Balanced Catalyst when OR >= 40', () => {
    const scores: Scores = { TV: 50, OR: 45, HR: 30, IV: 10 };
    const archetype = determineArchetype(scores);
    expect(archetype.id).not.toBe('balanced-catalyst');
  });

  it('returns one of the four known archetypes for edge scores', () => {
    const scores: Scores = { TV: 35, OR: 39, HR: 21, IV: 1 };
    const archetype = determineArchetype(scores);
    const ids = ['balanced-catalyst', 'technology-accelerator', 'governance-champion', 'efficiency-optimizer'];
    expect(ids).toContain(archetype.id);
  });
});

describe('isWinningOutcome', () => {
  it('returns true when scores match Balanced Catalyst criteria', () => {
    expect(isWinningOutcome({ TV: 55, OR: 25, HR: 60, IV: 10 })).toBe(true);
    expect(isWinningOutcome({ TV: 36, OR: 39, HR: 21, IV: 1 })).toBe(true);
  });

  it('returns false when TV <= 35', () => {
    expect(isWinningOutcome({ TV: 35, OR: 30, HR: 25, IV: 5 })).toBe(false);
  });

  it('returns false when OR >= 40', () => {
    expect(isWinningOutcome({ TV: 40, OR: 40, HR: 25, IV: 5 })).toBe(false);
  });

  it('returns false when HR <= 20', () => {
    expect(isWinningOutcome({ TV: 40, OR: 30, HR: 20, IV: 5 })).toBe(false);
  });

  it('returns false when IV <= 0', () => {
    expect(isWinningOutcome({ TV: 40, OR: 30, HR: 25, IV: 0 })).toBe(false);
  });
});
