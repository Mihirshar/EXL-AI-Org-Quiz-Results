import { describe, it, expect } from 'vitest';
import { generateTickerSymbol } from '@/lib/types';

describe('generateTickerSymbol', () => {
  it('returns a 4-letter string for empty or whitespace input', () => {
    const sym1 = generateTickerSymbol('');
    const sym2 = generateTickerSymbol('   ');
    expect(sym1.length).toBeLessThanOrEqual(4);
    expect(sym2.length).toBeLessThanOrEqual(4);
    expect(sym1).toMatch(/^[A-Z]{2,4}$/);
    expect(sym2).toMatch(/^[A-Z]{2,4}$/);
  });

  it('returns uppercase ticker for single short word', () => {
    expect(generateTickerSymbol('nova')).toBe('NOVA');
    expect(generateTickerSymbol('apex')).toBe('APEX');
  });

  it('returns up to 4 chars for single long word', () => {
    const result = generateTickerSymbol('Google');
    expect(result.length).toBeLessThanOrEqual(4);
    expect(result).toMatch(/^[A-Z]+$/);
  });

  it('returns 4 chars for two words (first 2 + first 2)', () => {
    const result = generateTickerSymbol('Gold Man');
    expect(result.length).toBe(4);
    expect(result).toMatch(/^[A-Z]+$/);
  });

  it('returns initials for multiple words', () => {
    const result = generateTickerSymbol('International Business Machines');
    expect(result.length).toBeLessThanOrEqual(4);
    expect(result).toMatch(/^[A-Z]+$/);
  });

  it('handles trimmed company name', () => {
    const result = generateTickerSymbol('  flux  ');
    expect(result).toBe('FLUX');
  });
});
