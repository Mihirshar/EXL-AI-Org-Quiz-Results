export interface Scores {
  IV: number;
  OR: number;
  HR: number;
  TV: number;
}

export type ChoiceOption = 'A' | 'B' | 'C';

export const LEVELS = [
  'Board Member',
  'Leadership',
  'Senior Management',
  'Managers',
  'HR',
  'Technology',
  'Operations',
  'Finance',
  'Other',
] as const;

export type Level = typeof LEVELS[number];

export interface Player {
  id: string;
  name: string;
  level: Level;
  scores: Scores;
  archetype: string;
  selfArchetypeId?: string;
  choices: ChoiceOption[];
  completedAt: Date;
  photoUrl?: string;
  avatarUrl?: string;
}

export interface CurrentPlayer {
  name: string;
  level: Level;
  companyName?: string;
  tickerSymbol?: string;
  photoUrl?: string;
  avatarUrl?: string;
  selfArchetypeId?: string;
}

const DEFAULT_TICKERS = ['NOVA', 'APEX', 'FLUX', 'CORE', 'VNTX'];

export function generateTickerSymbol(companyName: string): string {
  if (!companyName || companyName.trim().length === 0) {
    return DEFAULT_TICKERS[Math.floor(Math.random() * DEFAULT_TICKERS.length)];
  }
  
  const name = companyName.trim().toUpperCase();
  const words = name.split(/\s+/).filter(w => w.length > 0);
  
  if (words.length === 1) {
    const word = words[0];
    if (word.length <= 4) {
      return word;
    }
    const consonants = word.replace(/[AEIOU]/g, '');
    if (consonants.length >= 3) {
      return consonants.slice(0, 4);
    }
    return word.slice(0, 4);
  }
  
  if (words.length === 2) {
    return (words[0].slice(0, 2) + words[1].slice(0, 2)).slice(0, 4);
  }
  
  return words.map(w => w[0]).join('').slice(0, 4);
}

export interface LevelStats {
  level: Level;
  avgTV: number;
  avgOR: number;
  avgIV: number;
  avgHR: number;
  playerCount: number;
}

export interface ArchetypeStats {
  name: string;
  count: number;
  color: string;
}

export interface TickerResult {
  type: 'gain' | 'loss' | 'volatile';
  label: string;
  percent: number;
  analystNote: string;
}

export interface StockState {
  price: number;
  history: number[];
  change: number;
  changePercent: number;
}

export interface ChoiceRecord {
  level: number;
  choice: ChoiceOption;
  choiceLabel: string;
  tickerResult: TickerResult;
  priceAfter: number;
}

// Question Set type - 'A' for original questions, 'B' for alternative questions
export type QuestionSet = 'A' | 'B';
