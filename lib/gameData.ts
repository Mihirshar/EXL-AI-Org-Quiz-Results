import { TickerResult, StockState, ChoiceRecord, Scores, QuestionSet, ChoiceOption } from './types';

export type { Scores };

export type ScoreKey = 'IV' | 'OR' | 'HR' | 'TV';

export interface ScoreChange {
  IV: number;
  OR: number;
  HR: number;
  TV: number;
}

export interface Insight {
  first: string;
  second: string;
  diagnosis?: string;        // Set B: "You chose speed over structure"
  hiddenConnection?: string; // Set B: "Linear Logic" / "Causal Logic"
  outcome?: string;          // Set B: "Hallucinations / Compliance Failure"
}

export interface Infographic {
  title: string;
  stat: string;
  description: string;
  source: string;
  icon: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface ChoiceInfographic {
  headline: string;
  subheadline: string;
  keyStats: Array<{
    value: string;
    label: string;
    trend: 'up' | 'down' | 'neutral';
  }>;
  insight: string;
  leadershipQuality: string;
  qualityIcon: string;
  theme: 'tech' | 'people' | 'risk' | 'growth' | 'balance';
}

export interface Level {
  id: number;
  title: string;
  month: string;
  scenario: string;
  choices: {
    A: string[];  // Array of 5 variants for Option A
    B: string[];  // Array of 5 variants for Option B
    C?: string[]; // Optional third option (Set A extension)
  };
  scoring: {
    A: ScoreChange;
    B: ScoreChange;
    C?: ScoreChange;
  };
  insights: {
    A: Insight;
    B: Insight;
    C?: Insight;
  };
  infographics: {
    A: Infographic[];
    B: Infographic[];
    C?: Infographic[];
  };
}

export const SCORE_METRICS: { key: ScoreKey; name: string; description: string; target: string; isLimit?: boolean }[] = [
  { key: 'TV', name: 'Turnaround Value', description: 'Enterprise value generation', target: '> +35' },
  { key: 'OR', name: 'Operational Risk', description: 'Risk exposure level', target: '< +40', isLimit: true },
  { key: 'IV', name: 'Innovation Velocity', description: 'Speed of AI adoption', target: '> 0' },
  { key: 'HR', name: 'Human Readiness', description: 'Workforce AI capability', target: '> 0' },
];

export const INITIAL_SCORES: Scores = {
  IV: 0,
  OR: 0,
  HR: 0,
  TV: 0,
};

export type { QuestionSet };

// SET A - Original questions (Gartner/cultural shift focus)
export const LEVELS_SET_A: Level[] = [
  {
    id: 1,
    title: 'The Readiness Dilemma',
    month: 'Month 1',
    scenario: `Gartner data reveals that most AI initiatives fail because organizations treat AI as a plug-and-play technology rather than a cultural shift. You have a $10M budget to kickstart your 12-month turnaround. How do you allocate it?`,
    choices: {
      A: [
        'Invest 90% of the budget in enterprise AI licenses to maximize immediate technological capabilities, leaving 10% for basic software training.',
        'Allocate the vast majority of funds to acquiring cutting-edge AI platforms immediately, with minimal investment in workforce preparation.',
        'Prioritize rapid technology acquisition—pour resources into best-in-class AI tools now and address training gaps later.',
        'Fast-track AI deployment by channeling 90% of capital into enterprise licenses, treating training as a secondary concern.',
        'Maximize technological firepower upfront: secure comprehensive AI licensing while keeping upskilling investment minimal.',
      ],
      B: [
        'Split the budget 50/50—funding AI tools alongside a massive "AI Literacy and Context Engineering" upskilling program.',
        'Balance technology and people equally: invest half in AI platforms and half in building workforce AI fluency.',
        'Pursue a dual-track strategy—equal investment in tools and a comprehensive "AI Readiness" training initiative.',
        'Adopt a human-centered approach: match every dollar spent on AI tools with equivalent investment in employee upskilling.',
        'Build capabilities alongside technology: allocate equal resources to AI platforms and workforce transformation programs.',
      ],
      C: [
        '"The Strategy Paralysis" – Spend 70% of the budget hiring a top-tier Big 4 consulting firm to build a comprehensive, 3-5 year "AI Strategy & Ethics Roadmap" before buying any actual software.',
        '"The Strategy Paralysis" – Spend 70% of the budget hiring a top-tier Big 4 consulting firm to build a comprehensive, 3-5 year "AI Strategy & Ethics Roadmap" before buying any actual software.',
        '"The Strategy Paralysis" – Spend 70% of the budget hiring a top-tier Big 4 consulting firm to build a comprehensive, 3-5 year "AI Strategy & Ethics Roadmap" before buying any actual software.',
        '"The Strategy Paralysis" – Spend 70% of the budget hiring a top-tier Big 4 consulting firm to build a comprehensive, 3-5 year "AI Strategy & Ethics Roadmap" before buying any actual software.',
        '"The Strategy Paralysis" – Spend 70% of the budget hiring a top-tier Big 4 consulting firm to build a comprehensive, 3-5 year "AI Strategy & Ethics Roadmap" before buying any actual software.',
      ],
    },
    scoring: {
      A: { IV: 20, OR: 15, HR: -20, TV: -5 },
      B: { IV: 5, OR: -5, HR: 20, TV: 10 },
      C: { IV: -20, OR: -10, HR: 5, TV: -15 },
    },
    insights: {
      A: {
        first: 'You roll out shiny new tools globally in week one. Execution speed is incredible.',
        second: 'The tools become expensive "shelfware." Employees lack the skills to prompt effectively, triggering deep cultural resistance and stalling your turnaround value completely.',
      },
      B: {
        first: 'The rollout feels frustratingly slow. The board questions the heavy training expenditure in Q1.',
        second: 'By month four, highly literate "fusion teams" autonomously identify high-margin use cases. The foundation for rapid, compounding growth is locked in.',
      },
      C: {
        first: 'The board feels incredibly safe. You have beautiful PowerPoint decks and zero execution risk in Q1.',
        second: 'You burned 4 months and most of your budget planning for a future that will change in 6 months. You mathematically cannot hit a 40% turnaround in the remaining 8 months.',
      },
    },
    infographics: {
      A: [
        { title: 'AI Tool Adoption', stat: '87%', description: 'of AI tools become shelfware within 12 months', source: 'Gartner 2024', icon: '📉', trend: 'down' },
        { title: 'Tech-First Failures', stat: '70%', description: 'of AI initiatives fail due to lack of change management', source: 'McKinsey', icon: '⚠️', trend: 'down' },
        { title: 'Adoption Timeline', stat: '6-18mo', description: 'typical time for enterprise AI to show ROI without training', source: 'Deloitte', icon: '⏰', trend: 'neutral' },
      ],
      B: [
        { title: 'Upskilled Teams ROI', stat: '3.5x', description: 'higher AI adoption rate with proper training', source: 'BCG 2024', icon: '📈', trend: 'up' },
        { title: 'Fusion Team Impact', stat: '40%', description: 'faster time-to-value with cross-functional AI teams', source: 'Gartner', icon: '🚀', trend: 'up' },
        { title: 'Change Success', stat: '2.6x', description: 'more likely to succeed with human-centered approach', source: 'MIT Sloan', icon: '✅', trend: 'up' },
      ],
    },
  },
  {
    id: 2,
    title: 'The Domain Crucible',
    month: 'Month 4',
    scenario: `Operations wants to deploy Generative AI to handle complex, highly regulated client data (e.g., claims processing, underwriting). Generic models hallucinate; Everest Group emphasizes the need for Domain-Specific Language Models (DSLMs).`,
    choices: {
      A: [
        'Deploy a generic, off-the-shelf LLM wrapper for a fast, cheap rollout to hit immediate quarterly targets.',
        'Launch quickly with a standard large language model—speed to market matters more than customization right now.',
        'Go with a ready-made AI solution to demonstrate rapid progress and satisfy short-term performance expectations.',
        'Opt for immediate deployment using an out-of-the-box LLM to show quick wins and meet this quarter\'s goals.',
        'Prioritize velocity: implement a generic AI model now to capture early mover advantage in the market.',
      ],
      B: [
        'Delay 60 days to fine-tune a Domain-Specific Language Model (DSLM) trained on proprietary enterprise data with robust RAG architecture.',
        'Invest two months in building a customized AI model trained specifically on your industry\'s regulatory requirements and internal data.',
        'Take time to develop a precision-tuned model with retrieval-augmented generation for accurate, compliant outputs.',
        'Accept a short-term delay to create a specialized AI system that truly understands your domain\'s complexity and compliance needs.',
        'Build it right: dedicate 60 days to training a model on proprietary data with enterprise-grade accuracy safeguards.',
      ],
      C: [
        '"The Mega-vendor Suite" – Buy a massive, multi-million dollar "pre-packaged AI" enterprise suite from a legacy vendor. It promises to do everything and requires rewriting your internal processes.',
        '"The Mega-vendor Suite" – Buy a massive, multi-million dollar "pre-packaged AI" enterprise suite from a legacy vendor. It promises to do everything and requires rewriting your internal processes.',
        '"The Mega-vendor Suite" – Buy a massive, multi-million dollar "pre-packaged AI" enterprise suite from a legacy vendor. It promises to do everything and requires rewriting your internal processes.',
        '"The Mega-vendor Suite" – Buy a massive, multi-million dollar "pre-packaged AI" enterprise suite from a legacy vendor. It promises to do everything and requires rewriting your internal processes.',
        '"The Mega-vendor Suite" – Buy a massive, multi-million dollar "pre-packaged AI" enterprise suite from a legacy vendor. It promises to do everything and requires rewriting your internal processes.',
      ],
    },
    scoring: {
      A: { IV: 25, OR: 30, HR: -10, TV: 0 },
      B: { IV: -5, OR: -10, HR: 10, TV: 15 },
      C: { IV: 10, OR: 10, HR: -25, TV: -5 },
    },
    insights: {
      A: {
        first: 'Marketing announces a quick AI win. Analysts are impressed. Your stock ticks up on "AI-first" PR.',
        second: 'Claims errors surface; regulatory fines hit. Customer trust erodes. The short-term PR win becomes a long-term liability.',
      },
      B: {
        first: 'You face internal grumbling about delays. Competitors mock your "slow" AI strategy.',
        second: 'Your DSLM achieves 98% accuracy in regulated workflows. Clients consolidate more business with you, generating sticky, high-margin revenue.',
      },
      C: {
        first: 'IT loves having "one throat to choke." Deployment begins systematically.',
        second: 'The business units revolt. Forcing operations to abandon their workflows to fit the vendor\'s rigid AI model creates massive operational friction and destroys morale.',
      },
    },
    infographics: {
      A: [
        { title: 'LLM Hallucination Rate', stat: '15-27%', description: 'error rate in generic LLMs for domain-specific tasks', source: 'Stanford HAI', icon: '🎭', trend: 'down' },
        { title: 'Regulatory Risk', stat: '$4.2M', description: 'average cost of AI-related compliance failures', source: 'PwC 2024', icon: '⚖️', trend: 'down' },
        { title: 'Customer Trust Impact', stat: '-34%', description: 'drop in NPS after AI errors in sensitive data', source: 'Forrester', icon: '📉', trend: 'down' },
      ],
      B: [
        { title: 'DSLM Accuracy', stat: '98%+', description: 'accuracy in regulated workflows with fine-tuned models', source: 'Everest Group', icon: '🎯', trend: 'up' },
        { title: 'RAG Effectiveness', stat: '85%', description: 'reduction in hallucinations with proper RAG setup', source: 'Gartner', icon: '🔒', trend: 'up' },
        { title: 'Client Retention', stat: '+23%', description: 'increase in contract renewals with reliable AI', source: 'Bain & Co', icon: '🤝', trend: 'up' },
      ],
    },
  },
  {
    id: 3,
    title: 'The Agentic Shift',
    month: 'Month 7',
    scenario: `You've built capable AI tools, but productivity gains are capped at 10-15%. Gartner's research indicates that true step-change value comes from autonomous AI agents capable of multi-step reasoning without human intervention.`,
    choices: {
      A: [
        'Deploy an autonomous Multiagent System to negotiate and resolve tier-1 and tier-2 B2B disputes completely without human intervention.',
        'Unleash fully autonomous AI agents to handle routine business processes end-to-end without human touchpoints.',
        'Transition to agentic AI: let intelligent systems independently manage and resolve standard operational workflows.',
        'Empower AI agents with full autonomy to process, decide, and execute on lower-complexity business transactions.',
        'Make the leap to autonomous operations: deploy multi-agent systems that work 24/7 without human bottlenecks.',
      ],
      B: [
        'Continue scaling human-supervised Copilots, keeping humans firmly in the loop for every task.',
        'Stay the course with AI assistants that require human approval at each step—safety and control remain paramount.',
        'Expand the current copilot model where employees guide and verify every AI action before execution.',
        'Maintain human oversight: scale AI tools that augment workers but never act independently.',
        'Stick with the proven approach: AI suggests, humans decide and execute on every workflow.',
      ],
      C: [
        '"The Fragmented Fleet" – Decentralize it. Give every department head a $500k budget to independently buy and deploy their own AI agents to solve their specific departmental bottlenecks quickly.',
        '"The Fragmented Fleet" – Decentralize it. Give every department head a $500k budget to independently buy and deploy their own AI agents to solve their specific departmental bottlenecks quickly.',
        '"The Fragmented Fleet" – Decentralize it. Give every department head a $500k budget to independently buy and deploy their own AI agents to solve their specific departmental bottlenecks quickly.',
        '"The Fragmented Fleet" – Decentralize it. Give every department head a $500k budget to independently buy and deploy their own AI agents to solve their specific departmental bottlenecks quickly.',
        '"The Fragmented Fleet" – Decentralize it. Give every department head a $500k budget to independently buy and deploy their own AI agents to solve their specific departmental bottlenecks quickly.',
      ],
    },
    scoring: {
      A: { IV: -5, OR: -5, HR: 5, TV: 5 },
      B: { IV: 30, OR: 20, HR: -5, TV: 20 },
      C: { IV: 25, OR: 35, HR: 15, TV: 0 },
    },
    insights: {
      A: {
        first: 'Operations feel incredibly safe. Output quality is highly consistent.',
        second: 'You hit a hard ceiling. Copilots yield only incremental 5–10% productivity gains. You mathematically fail to generate the 40% turnaround required.',
      },
      B: {
        first: 'Agents instantly clear massive backlogs. Volume processing scales exponentially without adding headcount. Staff feels uneasy about being replaced.',
        second: 'You shift from tracking "productivity" to hard P&L impact. This is the operational leverage required to hit your aggressive financial goals.',
      },
      C: {
        first: 'Department heads are thrilled. Innovation spikes locally, and people love the autonomy.',
        second: 'You create an enterprise nightmare. None of the agents can talk to each other, data silos deepen, and duplicate vendor costs erase any P&L gains.',
      },
    },
    infographics: {
      A: [
        { title: 'Agentic AI Impact', stat: '10x', description: 'productivity multiplier with autonomous agents', source: 'Gartner', icon: '🚀', trend: 'up' },
        { title: 'Cost Reduction', stat: '60%', description: 'operational cost savings from agent automation', source: 'Deloitte', icon: '💰', trend: 'up' },
        { title: 'Processing Speed', stat: '24/7', description: 'continuous operation without human bottlenecks', source: 'Accenture', icon: '⚡', trend: 'up' },
      ],
      B: [
        { title: 'Copilot Productivity Cap', stat: '10-15%', description: 'maximum productivity gains from human-in-the-loop AI', source: 'Gartner 2024', icon: '📊', trend: 'neutral' },
        { title: 'Scaling Limitation', stat: 'Linear', description: 'growth pattern - headcount still drives capacity', source: 'McKinsey', icon: '📏', trend: 'neutral' },
        { title: 'Innovation Ceiling', stat: '5x', description: 'slower innovation vs autonomous systems', source: 'MIT Tech Review', icon: '🚧', trend: 'down' },
      ],
    },
  },
  {
    id: 4,
    title: 'The Trust & Governance Shield',
    month: 'Month 10',
    scenario: `With autonomous agents running loose, Gartner warns of "death by AI" litigation. A close competitor just suffered a massive data leak due to a prompt injection attack. The board is nervous.`,
    choices: {
      A: [
        'Invest aggressively in an AI Security Platform with real-time guardrails to dynamically monitor and quarantine rogue agent actions.',
        'Deploy cutting-edge AI governance tools that provide continuous monitoring and instant threat neutralization.',
        'Implement a "secure by design" approach: embed real-time safeguards that detect and contain risks without stopping innovation.',
        'Build security into the system: invest in dynamic guardrails that protect while preserving deployment velocity.',
        'Adopt an intelligent security layer that monitors AI behavior in real-time and automatically prevents harmful actions.',
      ],
      B: [
        'Hit the brakes. Mandate that all AI usage be paused until a multi-year, foolproof governance framework is established.',
        'Full stop on AI deployment—freeze all initiatives until comprehensive policies and safeguards are bulletproof.',
        'Halt everything: no AI moves forward until legal, compliance, and security teams sign off on an airtight framework.',
        'Pump the brakes completely—better to lose momentum than risk catastrophic governance failure.',
        'Shut down AI operations temporarily to build an ironclad governance structure before any further deployment.',
      ],
      C: [
        '"The AI Board" – Form a 6-person "AI Ethics & Review Committee" consisting of Legal, HR, and IT. Mandate that every new AI prompt, tool, or workflow must be manually presented to and approved by this committee before use.',
        '"The AI Board" – Form a 6-person "AI Ethics & Review Committee" consisting of Legal, HR, and IT. Mandate that every new AI prompt, tool, or workflow must be manually presented to and approved by this committee before use.',
        '"The AI Board" – Form a 6-person "AI Ethics & Review Committee" consisting of Legal, HR, and IT. Mandate that every new AI prompt, tool, or workflow must be manually presented to and approved by this committee before use.',
        '"The AI Board" – Form a 6-person "AI Ethics & Review Committee" consisting of Legal, HR, and IT. Mandate that every new AI prompt, tool, or workflow must be manually presented to and approved by this committee before use.',
        '"The AI Board" – Form a 6-person "AI Ethics & Review Committee" consisting of Legal, HR, and IT. Mandate that every new AI prompt, tool, or workflow must be manually presented to and approved by this committee before use.',
      ],
    },
    scoring: {
      A: { IV: 10, OR: -25, HR: 15, TV: 10 },
      B: { IV: -40, OR: -20, HR: -15, TV: -20 },
      C: { IV: -30, OR: -15, HR: -25, TV: -10 },
    },
    insights: {
      A: {
        first: 'Security acts as a continuous monitor rather than a stop sign. Rogue actions are caught in milliseconds.',
        second: 'Employees feel safe innovating because the guardrails protect them. You sustain the high-speed deployment pace without triggering a regulatory disaster.',
      },
      B: {
        first: 'Zero compliance breaches. The board enjoys total peace of mind regarding data leaks.',
        second: 'Complete stagnation. Competitors capture your market share. Your top talent leaves out of frustration, effectively killing the turnaround story.',
      },
      C: {
        first: 'The legal team is extremely happy. Every AI use case is perfectly documented and signed off.',
        second: 'The review queue stretches to 4 months. Innovators get frustrated by red tape and either quit or resort to "Shadow AI" on personal devices to get work done.',
      },
    },
    infographics: {
      A: [
        { title: 'Real-time Detection', stat: '<50ms', description: 'threat response time with modern AI guardrails', source: 'NIST', icon: '🛡️', trend: 'up' },
        { title: 'Innovation + Security', stat: '94%', description: 'of secure-by-design AI projects succeed', source: 'Forrester', icon: '✅', trend: 'up' },
        { title: 'Employee Confidence', stat: '+67%', description: 'increase in AI adoption with visible guardrails', source: 'PwC', icon: '🔐', trend: 'up' },
      ],
      B: [
        { title: 'Innovation Freeze Cost', stat: '$50M+', description: 'average annual opportunity cost from AI pauses', source: 'BCG', icon: '❄️', trend: 'down' },
        { title: 'Talent Attrition', stat: '45%', description: 'increase in tech talent leaving during AI freezes', source: 'LinkedIn', icon: '🚪', trend: 'down' },
        { title: 'Market Share Loss', stat: '12-18%', description: 'typical loss to AI-forward competitors', source: 'Gartner', icon: '📉', trend: 'down' },
      ],
    },
  },
  {
    id: 5,
    title: 'The Operating Model',
    month: 'Month 12',
    scenario: `You have successfully scaled AI across the enterprise and hit your initial efficiency targets. What is your ultimate strategic maneuver for the final operating model?`,
    choices: {
      A: [
        'The Automation Trap—Use the AI solely to automate legacy business processes, cut headcount, and immediately return cash to the bottom line.',
        'Maximize short-term returns: deploy AI primarily to reduce workforce costs and boost quarterly margins.',
        'Focus on efficiency extraction—automate existing workflows, reduce staff, and deliver immediate shareholder value.',
        'Take the cost-cutting path: leverage AI to streamline operations, minimize headcount, and accelerate profit margins.',
        'Pursue operational efficiency: use AI to automate repetitive tasks, downsize teams, and drive immediate financial results.',
      ],
      B: [
        'The Value Creator—Fundamentally redesign the business model around human-AI orchestration to launch entirely new, high-margin analytics services.',
        'Transform the business: use AI to create new revenue streams and elevate your workforce to higher-value strategic roles.',
        'Reimagine the operating model—combine human creativity with AI power to unlock entirely new service offerings.',
        'Build for the future: redesign operations around human-AI collaboration to capture new market opportunities.',
        'Pursue value creation: leverage AI not just for efficiency, but to launch innovative services that generate premium margins.',
      ],
      C: [
        '"Innovation Theater" – Declare victory on the initial pilots, issue a massive press release about your AI success, but keep AI contained in an "Innovation Lab." Hesitate to roll out/integrate it into the core, legacy and every other processes.',
        '"Innovation Theater" – Declare victory on the initial pilots, issue a massive press release about your AI success, but keep AI contained in an "Innovation Lab." Hesitate to roll out/integrate it into the core, legacy and every other processes.',
        '"Innovation Theater" – Declare victory on the initial pilots, issue a massive press release about your AI success, but keep AI contained in an "Innovation Lab." Hesitate to roll out/integrate it into the core, legacy and every other processes.',
        '"Innovation Theater" – Declare victory on the initial pilots, issue a massive press release about your AI success, but keep AI contained in an "Innovation Lab." Hesitate to roll out/integrate it into the core, legacy and every other processes.',
        '"Innovation Theater" – Declare victory on the initial pilots, issue a massive press release about your AI success, but keep AI contained in an "Innovation Lab." Hesitate to roll out/integrate it into the core, legacy and every other processes.',
      ],
    },
    scoring: {
      A: { IV: 10, OR: 10, HR: -30, TV: 5 },
      B: { IV: 15, OR: 5, HR: 25, TV: 25 },
      C: { IV: 0, OR: -5, HR: -15, TV: -20 },
    },
    insights: {
      A: {
        first: 'Immediate cost savings appear on the P&L. Margins look incredibly healthy for the quarter.',
        second: 'You hollow out the company\'s institutional knowledge. Culture collapses, and the short-term cash grab fails to sustain long-term enterprise value.',
      },
      B: {
        first: 'Operations are fundamentally rewired, requiring intense executive focus to manage the friction of change.',
        second: 'The workforce is energized by doing higher-value work. You unlock net-new revenue streams, effortlessly blowing past the 40% turnaround target.',
      },
      C: {
        first: 'Great PR. The company wins an industry award for "Forward Thinking." Core operations remain undisrupted.',
        second: 'It is a facade. By treating AI as a side-project rather than the new core operating model, you failed the turnaround. The legacy business continues to bleed margin to faster competitors.',
      },
    },
    infographics: {
      A: [
        { title: 'Short-term Gains', stat: '+15%', description: 'immediate margin improvement from cost cuts', source: 'Deloitte', icon: '💵', trend: 'neutral' },
        { title: 'Knowledge Drain', stat: '73%', description: 'of institutional knowledge lost in aggressive layoffs', source: 'HBR', icon: '🧠', trend: 'down' },
        { title: 'Long-term Value', stat: '-40%', description: 'typical enterprise value decline within 3 years', source: 'McKinsey', icon: '📉', trend: 'down' },
      ],
      B: [
        { title: 'New Revenue Streams', stat: '35%', description: 'of revenue from AI-enabled services by year 3', source: 'BCG', icon: '💎', trend: 'up' },
        { title: 'Workforce Engagement', stat: '+52%', description: 'increase in employee satisfaction with value-add work', source: 'Gallup', icon: '🌟', trend: 'up' },
        { title: 'Enterprise Value', stat: '+80%', description: 'average valuation increase for AI-native models', source: 'Goldman Sachs', icon: '🚀', trend: 'up' },
      ],
    },
  },
];

// SET B - Alternative questions (Team building/PBM Audit focus)
export const LEVELS_SET_B: Level[] = [
  {
    id: 1,
    title: 'The Readiness Dilemma',
    month: 'Month 1',
    scenario: `You need to build your core AI team immediately to start the turnaround.`,
    choices: {
      A: [
        '"The Unicorn Hunt" – Spend 80% of your budget hiring a "SWAT Team" of external, high-priced AI experts from Silicon Valley to build the solutions for you.',
        '"The Unicorn Hunt" – Spend 80% of your budget hiring a "SWAT Team" of external, high-priced AI experts from Silicon Valley to build the solutions for you.',
        '"The Unicorn Hunt" – Spend 80% of your budget hiring a "SWAT Team" of external, high-priced AI experts from Silicon Valley to build the solutions for you.',
        '"The Unicorn Hunt" – Spend 80% of your budget hiring a "SWAT Team" of external, high-priced AI experts from Silicon Valley to build the solutions for you.',
        '"The Unicorn Hunt" – Spend 80% of your budget hiring a "SWAT Team" of external, high-priced AI experts from Silicon Valley to build the solutions for you.',
      ],
      B: [
        '"The Internal Academy" – Spend 80% of your budget launching a "Context Engineering" certification to upskill your existing domain experts (underwriters, claims adjusters) to build their own tools.',
        '"The Internal Academy" – Spend 80% of your budget launching a "Context Engineering" certification to upskill your existing domain experts (underwriters, claims adjusters) to build their own tools.',
        '"The Internal Academy" – Spend 80% of your budget launching a "Context Engineering" certification to upskill your existing domain experts (underwriters, claims adjusters) to build their own tools.',
        '"The Internal Academy" – Spend 80% of your budget launching a "Context Engineering" certification to upskill your existing domain experts (underwriters, claims adjusters) to build their own tools.',
        '"The Internal Academy" – Spend 80% of your budget launching a "Context Engineering" certification to upskill your existing domain experts (underwriters, claims adjusters) to build their own tools.',
      ],
    },
    scoring: {
      A: { IV: 25, OR: 20, HR: -25, TV: -5 },
      B: { IV: -5, OR: -5, HR: 25, TV: 15 },
    },
    insights: {
      A: {
        first: 'You assemble a brilliant team in weeks.',
        second: 'The external "unicorns" don\'t understand your legacy business. Your internal staff feels alienated and refuses to adopt the tools the "outsiders" built. The turnaround stalls due to cultural rejection.',
        diagnosis: 'You chose speed over cultural fit.',
        hiddenConnection: 'Shelfware Risk',
        outcome: 'Stalled Rollout',
      },
      B: {
        first: 'Progress is slow; you spend Q1 teaching rather than building.',
        second: 'Your domain experts build tools that actually solve the right problems. Retention soars, and value generation compounds in Q3/Q4.',
        diagnosis: 'You chose sustainable capability over quick wins.',
        hiddenConnection: 'Context Engineering',
        outcome: 'Rapid Adoption',
      },
    },
    infographics: {
      A: [
        { title: 'External Hire Risk', stat: '67%', description: 'of external AI hires leave within 18 months', source: 'LinkedIn 2024', icon: '🚪', trend: 'down' },
        { title: 'Cultural Rejection', stat: '72%', description: 'of internally-rejected tools become shelfware', source: 'Gartner', icon: '📉', trend: 'down' },
        { title: 'Integration Time', stat: '6-12mo', description: 'for external hires to understand legacy systems', source: 'McKinsey', icon: '⏰', trend: 'neutral' },
      ],
      B: [
        { title: 'Domain Expert ROI', stat: '4.2x', description: 'higher success rate when domain experts build AI', source: 'BCG 2024', icon: '📈', trend: 'up' },
        { title: 'Retention Impact', stat: '+45%', description: 'employee retention with upskilling programs', source: 'Deloitte', icon: '🤝', trend: 'up' },
        { title: 'Problem-Fit', stat: '89%', description: 'accuracy in identifying real business problems', source: 'MIT Sloan', icon: '🎯', trend: 'up' },
      ],
    },
  },
  {
    id: 2,
    title: 'The Domain Crucible',
    month: 'Month 4',
    scenario: `You are launching the new PBM Audit module to detect fraud and waste in millions of pharmacy claims. The contracts contain highly complex, nested pricing rules (e.g., "Drug A is covered only if dispensed by Pharmacy Type B in Region C").`,
    choices: {
      A: [
        '"The Vector Search (Standard RAG)" – Ingest all contracts into a standard Vector Database. The AI will retrieve relevant text chunks based on keyword similarity to answer audit questions quickly. (Fast setup, low complexity).',
        '"The Vector Search (Standard RAG)" – Ingest all contracts into a standard Vector Database. The AI will retrieve relevant text chunks based on keyword similarity to answer audit questions quickly. (Fast setup, low complexity).',
        '"The Vector Search (Standard RAG)" – Ingest all contracts into a standard Vector Database. The AI will retrieve relevant text chunks based on keyword similarity to answer audit questions quickly. (Fast setup, low complexity).',
        '"The Vector Search (Standard RAG)" – Ingest all contracts into a standard Vector Database. The AI will retrieve relevant text chunks based on keyword similarity to answer audit questions quickly. (Fast setup, low complexity).',
        '"The Vector Search (Standard RAG)" – Ingest all contracts into a standard Vector Database. The AI will retrieve relevant text chunks based on keyword similarity to answer audit questions quickly. (Fast setup, low complexity).',
      ],
      B: [
        '"The Knowledge Graph (Graph RAG)" – Invest time to map the contracts into a structured Knowledge Graph. This explicitly links Drugs, Pharmacies, and Pricing Rules in a web of logic before the AI ever attempts to audit a claim. (Slower setup, high architectural rigor).',
        '"The Knowledge Graph (Graph RAG)" – Invest time to map the contracts into a structured Knowledge Graph. This explicitly links Drugs, Pharmacies, and Pricing Rules in a web of logic before the AI ever attempts to audit a claim. (Slower setup, high architectural rigor).',
        '"The Knowledge Graph (Graph RAG)" – Invest time to map the contracts into a structured Knowledge Graph. This explicitly links Drugs, Pharmacies, and Pricing Rules in a web of logic before the AI ever attempts to audit a claim. (Slower setup, high architectural rigor).',
        '"The Knowledge Graph (Graph RAG)" – Invest time to map the contracts into a structured Knowledge Graph. This explicitly links Drugs, Pharmacies, and Pricing Rules in a web of logic before the AI ever attempts to audit a claim. (Slower setup, high architectural rigor).',
        '"The Knowledge Graph (Graph RAG)" – Invest time to map the contracts into a structured Knowledge Graph. This explicitly links Drugs, Pharmacies, and Pricing Rules in a web of logic before the AI ever attempts to audit a claim. (Slower setup, high architectural rigor).',
      ],
    },
    scoring: {
      A: { IV: 25, OR: 35, HR: -15, TV: -10 },
      B: { IV: -10, OR: -25, HR: 20, TV: 40 },
    },
    insights: {
      A: {
        first: 'The system goes live in weeks. It successfully answers simple questions like "What is the price of insulin?"',
        second: 'The AI fails on "Second Order" logic. It retrieves the pricing clause but misses the exclusion clause buried in a different PDF. The audit is riddled with false positives. Auditors stop using the tool because they can\'t trust it. Turnaround Failed.',
        diagnosis: 'You chose speed over structure.',
        hiddenConnection: 'Linear Logic',
        outcome: 'Hallucinations / Compliance Failure',
      },
      B: {
        first: 'Development takes an extra 2 months. The board is impatient.',
        second: 'Because the Knowledge Graph mapped the relationships (not just the text), the AI catches complex fraud patterns that human auditors missed—like a pharmacy splitting claims to bypass limits. You recover 40% more value than projected. Turnaround Secured.',
        diagnosis: 'You chose Causal Structure over speed.',
        hiddenConnection: 'Causal Logic',
        outcome: 'Defensible Audit / 100% Accuracy',
      },
    },
    infographics: {
      A: [
        { title: 'RAG Accuracy Limit', stat: '73%', description: 'accuracy ceiling for complex nested rules', source: 'Stanford HAI', icon: '📊', trend: 'neutral' },
        { title: 'False Positive Rate', stat: '34%', description: 'error rate on multi-clause queries', source: 'Everest Group', icon: '⚠️', trend: 'down' },
        { title: 'Auditor Trust', stat: '-52%', description: 'drop in tool usage after reliability issues', source: 'Forrester', icon: '📉', trend: 'down' },
      ],
      B: [
        { title: 'Graph RAG Accuracy', stat: '98%+', description: 'on complex nested rule queries', source: 'Everest Group', icon: '🎯', trend: 'up' },
        { title: 'Fraud Detection', stat: '+40%', description: 'more value recovered vs linear search', source: 'PwC 2024', icon: '💰', trend: 'up' },
        { title: 'Causal Reasoning', stat: '10x', description: 'better at multi-hop logical queries', source: 'MIT', icon: '🧠', trend: 'up' },
      ],
    },
  },
  {
    id: 3,
    title: 'The Agentic Shift',
    month: 'Month 7',
    scenario: `Your underwriting team spends 60% of their day toggling between 12 distinct legacy applications (Citrix, Mainframe, Web) to gather risk data. These systems have no APIs.`,
    choices: {
      A: [
        '"The Integration Slog" – Spend 6 months building custom RPA bots and API wrappers to connect the AI to these legacy systems safely.',
        '"The Integration Slog" – Spend 6 months building custom RPA bots and API wrappers to connect the AI to these legacy systems safely.',
        '"The Integration Slog" – Spend 6 months building custom RPA bots and API wrappers to connect the AI to these legacy systems safely.',
        '"The Integration Slog" – Spend 6 months building custom RPA bots and API wrappers to connect the AI to these legacy systems safely.',
        '"The Integration Slog" – Spend 6 months building custom RPA bots and API wrappers to connect the AI to these legacy systems safely.',
      ],
      B: [
        '"Claude Computer Use" – Deploy Anthropic\'s "Computer Use" capability immediately, allowing the model to visually "see" the screens, move the cursor, and click through the legacy apps just like a human operator.',
        '"Claude Computer Use" – Deploy Anthropic\'s "Computer Use" capability immediately, allowing the model to visually "see" the screens, move the cursor, and click through the legacy apps just like a human operator.',
        '"Claude Computer Use" – Deploy Anthropic\'s "Computer Use" capability immediately, allowing the model to visually "see" the screens, move the cursor, and click through the legacy apps just like a human operator.',
        '"Claude Computer Use" – Deploy Anthropic\'s "Computer Use" capability immediately, allowing the model to visually "see" the screens, move the cursor, and click through the legacy apps just like a human operator.',
        '"Claude Computer Use" – Deploy Anthropic\'s "Computer Use" capability immediately, allowing the model to visually "see" the screens, move the cursor, and click through the legacy apps just like a human operator.',
      ],
    },
    scoring: {
      A: { IV: -20, OR: -10, HR: -5, TV: -5 },
      B: { IV: 35, OR: 30, HR: -15, TV: 25 },
    },
    insights: {
      A: {
        first: 'It\'s the "proper" IT approach. Safe and predictable.',
        second: 'It\'s too slow. By the time you build the APIs, the market has moved. You burn half your turnaround time on plumbing rather than value generation.',
        diagnosis: 'You chose safety over speed.',
        hiddenConnection: 'Human Bottleneck',
        outcome: 'Stagnant Growth',
      },
      B: {
        first: 'Incredible velocity. You bypass IT integration bottlenecks entirely.',
        second: 'The AI occasionally "hallucinates" a mouse click, deleting a file or approving a risky policy. You have speed, but you are riding a unicycle on a tightrope.',
        diagnosis: 'You chose velocity over control.',
        hiddenConnection: 'Operational Leverage',
        outcome: 'Exponential Scale',
      },
    },
    infographics: {
      A: [
        { title: 'Integration Timeline', stat: '6-12mo', description: 'typical API/RPA build time for legacy systems', source: 'Gartner', icon: '⏰', trend: 'neutral' },
        { title: 'Opportunity Cost', stat: '$25M+', description: 'value lost during integration delays', source: 'McKinsey', icon: '💸', trend: 'down' },
        { title: 'Market Position', stat: '-18%', description: 'competitive ground lost to faster movers', source: 'BCG', icon: '📉', trend: 'down' },
      ],
      B: [
        { title: 'Deployment Speed', stat: '10x', description: 'faster than traditional integration', source: 'Anthropic', icon: '🚀', trend: 'up' },
        { title: 'Cycle Time', stat: '-60%', description: 'reduction in underwriting process time', source: 'Deloitte', icon: '⚡', trend: 'up' },
        { title: 'Risk Factor', stat: 'High', description: 'requires robust governance layer', source: 'Forrester', icon: '⚠️', trend: 'neutral' },
      ],
    },
  },
  {
    id: 4,
    title: 'The Trust & Governance Shield',
    month: 'Month 10',
    scenario: `Your "Computer Use" agents are now live and performing thousands of actions per hour. Since you already have a Sandbox, the new risk is Execution Control—preventing the agent from clicking the wrong button in production.`,
    choices: {
      A: [
        '"The Human Air-Gap" – The AI can do all the research, but every final "Write" action (e.g., Issuing Policy, Sending Wire) must be queued for a human to manually click "Approve."',
        '"The Human Air-Gap" – The AI can do all the research, but every final "Write" action (e.g., Issuing Policy, Sending Wire) must be queued for a human to manually click "Approve."',
        '"The Human Air-Gap" – The AI can do all the research, but every final "Write" action (e.g., Issuing Policy, Sending Wire) must be queued for a human to manually click "Approve."',
        '"The Human Air-Gap" – The AI can do all the research, but every final "Write" action (e.g., Issuing Policy, Sending Wire) must be queued for a human to manually click "Approve."',
        '"The Human Air-Gap" – The AI can do all the research, but every final "Write" action (e.g., Issuing Policy, Sending Wire) must be queued for a human to manually click "Approve."',
      ],
      B: [
        '"The Supervisor Model" – Deploy a secondary, lightweight "Constitutional AI" model that monitors the primary agent\'s reasoning trace in real-time and autonomously blocks any action that violates policy, without human intervention.',
        '"The Supervisor Model" – Deploy a secondary, lightweight "Constitutional AI" model that monitors the primary agent\'s reasoning trace in real-time and autonomously blocks any action that violates policy, without human intervention.',
        '"The Supervisor Model" – Deploy a secondary, lightweight "Constitutional AI" model that monitors the primary agent\'s reasoning trace in real-time and autonomously blocks any action that violates policy, without human intervention.',
        '"The Supervisor Model" – Deploy a secondary, lightweight "Constitutional AI" model that monitors the primary agent\'s reasoning trace in real-time and autonomously blocks any action that violates policy, without human intervention.',
        '"The Supervisor Model" – Deploy a secondary, lightweight "Constitutional AI" model that monitors the primary agent\'s reasoning trace in real-time and autonomously blocks any action that violates policy, without human intervention.',
      ],
    },
    scoring: {
      A: { IV: -25, OR: -20, HR: 10, TV: -15 },
      B: { IV: 20, OR: 10, HR: 5, TV: 20 },
    },
    insights: {
      A: {
        first: 'You sleep well at night. Zero risk of an AI rogue trade.',
        second: 'You re-introduced the bottleneck you just removed. Humans cannot keep up with the AI\'s volume. The backlog explodes, and the "Turnaround" efficiency gains are wiped out by the human queue.',
        diagnosis: 'You chose absolute control over scalability.',
        hiddenConnection: 'Shadow AI',
        outcome: 'Innovation Paralysis',
      },
      B: {
        first: 'It feels risky letting AI police AI.',
        second: 'It works. The Supervisor catches 99.9% of bad actions at machine speed. You achieve "Safe Autonomy," allowing the business to scale exponentially while maintaining governance.',
        diagnosis: 'You chose intelligent automation over manual control.',
        hiddenConnection: 'Self-Healing AI',
        outcome: 'Safe Autonomy',
      },
    },
    infographics: {
      A: [
        { title: 'Human Throughput', stat: '50/hr', description: 'max approvals per human reviewer', source: 'Deloitte', icon: '🐌', trend: 'down' },
        { title: 'Backlog Growth', stat: '400%', description: 'queue explosion when AI outpaces humans', source: 'McKinsey', icon: '📈', trend: 'down' },
        { title: 'Efficiency Loss', stat: '-75%', description: 'of AI gains lost to approval bottleneck', source: 'BCG', icon: '📉', trend: 'down' },
      ],
      B: [
        { title: 'Catch Rate', stat: '99.9%', description: 'of policy violations blocked autonomously', source: 'Anthropic', icon: '🛡️', trend: 'up' },
        { title: 'Response Time', stat: '<10ms', description: 'to detect and block bad actions', source: 'NIST', icon: '⚡', trend: 'up' },
        { title: 'Scale Factor', stat: '1000x', description: 'throughput vs human approval gates', source: 'Gartner', icon: '🚀', trend: 'up' },
      ],
    },
  },
  {
    id: 5,
    title: 'The Operating Model',
    month: 'Month 12',
    scenario: `You have a massive repository of clean, structured proprietary data from your AI efforts. How do you monetize it?`,
    choices: {
      A: [
        '"Service Efficiency" – Keep selling the same services you always have, but use the data to deliver them cheaper and faster to improve margins.',
        '"Service Efficiency" – Keep selling the same services you always have, but use the data to deliver them cheaper and faster to improve margins.',
        '"Service Efficiency" – Keep selling the same services you always have, but use the data to deliver them cheaper and faster to improve margins.',
        '"Service Efficiency" – Keep selling the same services you always have, but use the data to deliver them cheaper and faster to improve margins.',
        '"Service Efficiency" – Keep selling the same services you always have, but use the data to deliver them cheaper and faster to improve margins.',
      ],
      B: [
        '"Data Productization" – Package your data and insights into a brand new "Intelligence-as-a-Service" subscription product for your clients.',
        '"Data Productization" – Package your data and insights into a brand new "Intelligence-as-a-Service" subscription product for your clients.',
        '"Data Productization" – Package your data and insights into a brand new "Intelligence-as-a-Service" subscription product for your clients.',
        '"Data Productization" – Package your data and insights into a brand new "Intelligence-as-a-Service" subscription product for your clients.',
        '"Data Productization" – Package your data and insights into a brand new "Intelligence-as-a-Service" subscription product for your clients.',
      ],
    },
    scoring: {
      A: { IV: 5, OR: -5, HR: 5, TV: 10 },
      B: { IV: 25, OR: 15, HR: 20, TV: 35 },
    },
    insights: {
      A: {
        first: 'Clients are happy with faster service.',
        second: 'It\'s a "race to the bottom." Competitors match your price cuts, and your margins compress again. You failed to evolve the business model.',
        diagnosis: 'You chose incremental improvement over transformation.',
        hiddenConnection: 'Cultural Fatigue',
        outcome: 'Short-Term Pop / Long-Term Crash',
      },
      B: {
        first: 'It\'s a hard pivot. Sales teams struggle to sell the new product initially.',
        second: 'You create a recurring revenue stream with software-like margins (80%+) instead of service margins (20%). The company is re-rated as a Tech firm.',
        diagnosis: 'You chose transformation over optimization.',
        hiddenConnection: 'New Revenue Streams',
        outcome: 'Market Re-Rating',
      },
    },
    infographics: {
      A: [
        { title: 'Margin Compression', stat: '-15%', description: 'typical margin erosion in price wars', source: 'BCG', icon: '📉', trend: 'down' },
        { title: 'Competitive Response', stat: '6mo', description: 'time for competitors to match efficiency gains', source: 'McKinsey', icon: '⏰', trend: 'neutral' },
        { title: 'Growth Ceiling', stat: '5%', description: 'max organic growth in commoditized markets', source: 'Deloitte', icon: '🚧', trend: 'down' },
      ],
      B: [
        { title: 'SaaS Margins', stat: '80%+', description: 'gross margins for data products', source: 'Goldman Sachs', icon: '💎', trend: 'up' },
        { title: 'Revenue Multiple', stat: '8-12x', description: 'valuation multiple for recurring revenue', source: 'Morgan Stanley', icon: '📈', trend: 'up' },
        { title: 'Market Re-Rating', stat: '+100%', description: 'typical valuation jump for platform pivots', source: 'BCG', icon: '🚀', trend: 'up' },
      ],
    },
  },
];

// Keep LEVELS as an alias for backward compatibility (defaults to Set A)
export const LEVELS = LEVELS_SET_A;

export const TOTAL_LEVELS = LEVELS_SET_A.length;

// Helper function to get a random variant index (0-4) for display variety
export function getRandomVariantIndex(): number {
  return Math.floor(Math.random() * 5);
}

// Helper function to get choice text for a specific variant
export function getChoiceText(level: Level, choice: ChoiceOption, variantIndex: number): string {
  const variants = level.choices[choice] || level.choices.A;
  // Fallback to first variant if index is out of bounds
  return variants[variantIndex] || variants[0];
}

// Generate variant indices for all 5 levels (call once when game starts)
export function generateVariantIndices(): { A: number; B: number; C: number }[] {
  return LEVELS.map(() => ({
    A: getRandomVariantIndex(),
    B: getRandomVariantIndex(),
    C: getRandomVariantIndex(),
  }));
}

// Generate random display order for each level (shuffles which option appears first)
// Returns array of tuples where each tuple is the display order ['A', 'B'] or ['B', 'A']
export function generateDisplayOrder(): ChoiceOption[][] {
  return LEVELS.map(() => {
    const choices: ChoiceOption[] = ['A', 'B', 'C'];
    for (let i = choices.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [choices[i], choices[j]] = [choices[j], choices[i]];
    }
    return choices;
  });
}

// Generate a single random display order for one level
export function generateSingleDisplayOrder(level?: Level): ChoiceOption[] {
  const options: ChoiceOption[] = level?.choices.C ? ['A', 'B', 'C'] : ['A', 'B'];
  for (let i = options.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return options;
}

export function calculateScores(choices: ChoiceOption[]): Scores {
  const scores = { ...INITIAL_SCORES };
  
  choices.forEach((choice, index) => {
    const level = LEVELS[index];
    if (level) {
      const scoreChange = level.scoring[choice] || level.scoring.A;
      scores.IV += scoreChange.IV;
      scores.OR += scoreChange.OR;
      scores.HR += scoreChange.HR;
      scores.TV += scoreChange.TV;
    }
  });
  
  return scores;
}

export function isScorePassing(key: ScoreKey, value: number): boolean {
  switch (key) {
    case 'TV':
      return value >= 35;
    case 'OR':
      return value < 40;
    case 'IV':
    case 'HR':
      return value > 0;
    default:
      return false;
  }
}

export function isNearTarget(key: ScoreKey, value: number): boolean {
  switch (key) {
    case 'TV':
      return value >= 25 && value < 35;
    case 'OR':
      return value >= 40 && value <= 50;
    case 'IV':
    case 'HR':
      return value >= -5 && value <= 0;
    default:
      return false;
  }
}

export type ScoreStatus = 'met' | 'target' | 'missed';

export function getScoreStatus(key: ScoreKey, value: number): ScoreStatus {
  if (isScorePassing(key, value)) return 'met';
  if (isNearTarget(key, value)) return 'target';
  return 'missed';
}

export function getScoreTarget(key: ScoreKey): number {
  switch (key) {
    case 'TV':
      return 35;
    case 'OR':
      return 40;
    case 'IV':
    case 'HR':
      return 0;
    default:
      return 0;
  }
}

export const SCORE_RANGES: Record<ScoreKey, { min: number; max: number }> = {
  TV: { min: -20, max: 80 },
  OR: { min: -70, max: 70 },
  IV: { min: -20, max: 80 },
  HR: { min: -70, max: 80 },
};

export function getScoreRange(key: ScoreKey): { min: number; max: number } {
  return SCORE_RANGES[key];
}

export const MONTH_MARKERS = [1, 4, 7, 10, 12] as const;

// SET A Choice Infographics
export const CHOICE_INFOGRAPHICS_SET_A: Record<number, { A: ChoiceInfographic; B: ChoiceInfographic; C: ChoiceInfographic }> = {
  1: {
    A: {
      headline: 'Technology-First Approach',
      subheadline: 'Rapid AI deployment prioritizing speed over readiness',
      keyStats: [
        { value: '90%', label: 'Budget → Tech', trend: 'neutral' },
        { value: '87%', label: 'Shelfware Risk', trend: 'down' },
        { value: '70%', label: 'Failure Rate', trend: 'down' },
      ],
      insight: 'Fast deployment creates immediate capability gaps. Without training, tools become expensive shelf decorations.',
      leadershipQuality: 'Decisive Executor',
      qualityIcon: '⚡',
      theme: 'tech',
    },
    B: {
      headline: 'People-First Transformation',
      subheadline: 'Balanced investment in tools and human capability',
      keyStats: [
        { value: '50/50', label: 'Tools + Training', trend: 'up' },
        { value: '3.5x', label: 'Adoption Rate', trend: 'up' },
        { value: '40%', label: 'Faster Value', trend: 'up' },
      ],
      insight: 'Investing in AI literacy creates "fusion teams" who autonomously identify high-value use cases.',
      leadershipQuality: 'Strategic Builder',
      qualityIcon: '🏗️',
      theme: 'people',
    },
    C: {
      headline: 'Strategy Paralysis',
      subheadline: 'Consulting-heavy roadmap before execution',
      keyStats: [
        { value: '70%', label: 'Budget → Consulting', trend: 'down' },
        { value: '4mo', label: 'Execution Delay', trend: 'down' },
        { value: '-15', label: 'TV Impact', trend: 'down' },
      ],
      insight: 'Planning comfort replaces execution velocity, making the turnaround target mathematically unreachable.',
      leadershipQuality: 'Cautious Planner',
      qualityIcon: '📋',
      theme: 'risk',
    },
  },
  2: {
    A: {
      headline: 'Speed to Market',
      subheadline: 'Generic LLM for quick quarterly wins',
      keyStats: [
        { value: '15-27%', label: 'Error Rate', trend: 'down' },
        { value: '$4.2M', label: 'Compliance Risk', trend: 'down' },
        { value: '-34%', label: 'Trust Impact', trend: 'down' },
      ],
      insight: 'Generic models hallucinate in regulated domains. Short-term PR wins become long-term liabilities.',
      leadershipQuality: 'Risk Taker',
      qualityIcon: '🎲',
      theme: 'risk',
    },
    B: {
      headline: 'Domain Excellence',
      subheadline: 'Fine-tuned DSLM with RAG architecture',
      keyStats: [
        { value: '98%+', label: 'Accuracy', trend: 'up' },
        { value: '85%', label: 'Less Errors', trend: 'up' },
        { value: '+23%', label: 'Retention', trend: 'up' },
      ],
      insight: 'Domain-specific models achieve precision in regulated workflows, generating sticky, high-margin revenue.',
      leadershipQuality: 'Quality Champion',
      qualityIcon: '🎯',
      theme: 'balance',
    },
    C: {
      headline: 'Mega-vendor Suite',
      subheadline: 'Pre-packaged platform with rigid process fit',
      keyStats: [
        { value: '+10', label: 'OR Increase', trend: 'down' },
        { value: '-25', label: 'HR Impact', trend: 'down' },
        { value: '-5', label: 'TV Impact', trend: 'down' },
      ],
      insight: 'One-size-fits-all AI creates enterprise friction and morale collapse across business units.',
      leadershipQuality: 'Vendor Consolidator',
      qualityIcon: '🏢',
      theme: 'risk',
    },
  },
  3: {
    A: {
      headline: 'Autonomous Agents',
      subheadline: 'Multi-agent systems for exponential scale',
      keyStats: [
        { value: '10x', label: 'Productivity', trend: 'up' },
        { value: '60%', label: 'Cost Savings', trend: 'up' },
        { value: '24/7', label: 'Operations', trend: 'up' },
      ],
      insight: 'Autonomous agents clear backlogs exponentially. This is the operational leverage required for aggressive goals.',
      leadershipQuality: 'Innovation Driver',
      qualityIcon: '🚀',
      theme: 'growth',
    },
    B: {
      headline: 'Human-in-the-Loop',
      subheadline: 'Supervised copilots with consistent output',
      keyStats: [
        { value: '10-15%', label: 'Max Gains', trend: 'neutral' },
        { value: 'Linear', label: 'Scale Pattern', trend: 'neutral' },
        { value: '5x', label: 'Slower Growth', trend: 'down' },
      ],
      insight: 'Copilots yield incremental gains but hit a hard ceiling. You may mathematically fail the 40% turnaround target.',
      leadershipQuality: 'Steady Operator',
      qualityIcon: '🛡️',
      theme: 'risk',
    },
    C: {
      headline: 'Fragmented Fleet',
      subheadline: 'Department-level autonomous AI sprawl',
      keyStats: [
        { value: '+35', label: 'OR Spike', trend: 'down' },
        { value: '+25', label: 'IV Burst', trend: 'neutral' },
        { value: '0', label: 'TV Gain', trend: 'down' },
      ],
      insight: 'Local innovation rises, but disconnected agents and duplicated spend erase enterprise value.',
      leadershipQuality: 'Decentralized Sponsor',
      qualityIcon: '🧩',
      theme: 'risk',
    },
  },
  4: {
    A: {
      headline: 'Dynamic Guardrails',
      subheadline: 'Real-time AI security with continuous innovation',
      keyStats: [
        { value: '<50ms', label: 'Threat Response', trend: 'up' },
        { value: '94%', label: 'Success Rate', trend: 'up' },
        { value: '+67%', label: 'Adoption', trend: 'up' },
      ],
      insight: 'Security acts as a continuous monitor, not a stop sign. Employees feel safe innovating with guardrails.',
      leadershipQuality: 'Balanced Innovator',
      qualityIcon: '⚖️',
      theme: 'balance',
    },
    B: {
      headline: 'Full Stop Approach',
      subheadline: 'Pause all AI until governance is perfect',
      keyStats: [
        { value: '$50M+', label: 'Opportunity Cost', trend: 'down' },
        { value: '45%', label: 'Talent Attrition', trend: 'down' },
        { value: '12-18%', label: 'Market Loss', trend: 'down' },
      ],
      insight: 'Complete stagnation while competitors capture market share. Top talent leaves out of frustration.',
      leadershipQuality: 'Risk Averse',
      qualityIcon: '🛑',
      theme: 'risk',
    },
    C: {
      headline: 'AI Review Board',
      subheadline: 'Manual approvals for every AI workflow',
      keyStats: [
        { value: '4mo', label: 'Queue Delay', trend: 'down' },
        { value: '-30', label: 'IV Collapse', trend: 'down' },
        { value: '-10', label: 'TV Impact', trend: 'down' },
      ],
      insight: 'Bureaucracy creates bottlenecks, fuels shadow AI, and drives away top builders.',
      leadershipQuality: 'Bureaucratic Guardian',
      qualityIcon: '🏛️',
      theme: 'risk',
    },
  },
  5: {
    A: {
      headline: 'Automation Trap',
      subheadline: 'Cut costs, reduce headcount, return cash',
      keyStats: [
        { value: '+15%', label: 'Short Margins', trend: 'neutral' },
        { value: '73%', label: 'Knowledge Lost', trend: 'down' },
        { value: '-40%', label: 'Long-term Value', trend: 'down' },
      ],
      insight: 'Immediate cost savings hollow out institutional knowledge. Culture collapses; short-term cash grab fails.',
      leadershipQuality: 'Cost Cutter',
      qualityIcon: '✂️',
      theme: 'risk',
    },
    B: {
      headline: 'Value Creator',
      subheadline: 'Human-AI orchestration for new revenue',
      keyStats: [
        { value: '35%', label: 'New Revenue', trend: 'up' },
        { value: '+52%', label: 'Engagement', trend: 'up' },
        { value: '+80%', label: 'Valuation', trend: 'up' },
      ],
      insight: 'The workforce is energized by higher-value work. You unlock net-new revenue streams beyond the target.',
      leadershipQuality: 'Visionary Leader',
      qualityIcon: '👑',
      theme: 'growth',
    },
    C: {
      headline: 'Innovation Theater',
      subheadline: 'Pilot PR without core operating-model shift',
      keyStats: [
        { value: '0.0%', label: 'Ticker Flatline', trend: 'neutral' },
        { value: '-20', label: 'TV Impact', trend: 'down' },
        { value: '-15', label: 'HR Impact', trend: 'down' },
      ],
      insight: 'Great narrative, weak transformation. AI stays in the lab while core economics keep degrading.',
      leadershipQuality: 'Narrative Builder',
      qualityIcon: '🎭',
      theme: 'risk',
    },
  },
};

// SET B Choice Infographics
export const CHOICE_INFOGRAPHICS_SET_B: Record<number, { A: ChoiceInfographic; B: ChoiceInfographic }> = {
  1: {
    A: {
      headline: 'The Unicorn Hunt',
      subheadline: 'External AI experts to fast-track capabilities',
      keyStats: [
        { value: '80%', label: 'Budget → Hiring', trend: 'neutral' },
        { value: '67%', label: 'Turnover Risk', trend: 'down' },
        { value: '72%', label: 'Rejection Rate', trend: 'down' },
      ],
      insight: 'External unicorns don\'t understand legacy business. Cultural rejection stalls the turnaround.',
      leadershipQuality: 'Aggressive Recruiter',
      qualityIcon: '🦄',
      theme: 'tech',
    },
    B: {
      headline: 'The Internal Academy',
      subheadline: 'Upskill domain experts to build AI tools',
      keyStats: [
        { value: '80%', label: 'Budget → Training', trend: 'up' },
        { value: '4.2x', label: 'Success Rate', trend: 'up' },
        { value: '+45%', label: 'Retention', trend: 'up' },
      ],
      insight: 'Domain experts build tools that solve real problems. Retention soars, value compounds.',
      leadershipQuality: 'Talent Developer',
      qualityIcon: '🎓',
      theme: 'people',
    },
  },
  2: {
    A: {
      headline: 'Vector Search (RAG)',
      subheadline: 'Fast keyword-based retrieval',
      keyStats: [
        { value: '73%', label: 'Accuracy Cap', trend: 'neutral' },
        { value: '34%', label: 'False Positives', trend: 'down' },
        { value: '-52%', label: 'Tool Trust', trend: 'down' },
      ],
      insight: 'Linear search misses nested rules. Auditors abandon the tool due to unreliability.',
      leadershipQuality: 'Speed Optimizer',
      qualityIcon: '⚡',
      theme: 'tech',
    },
    B: {
      headline: 'Knowledge Graph (Graph RAG)',
      subheadline: 'Causal relationship mapping',
      keyStats: [
        { value: '98%+', label: 'Accuracy', trend: 'up' },
        { value: '+40%', label: 'Value Recovery', trend: 'up' },
        { value: '10x', label: 'Logic Depth', trend: 'up' },
      ],
      insight: 'Graph structure catches complex fraud patterns human auditors missed.',
      leadershipQuality: 'Systems Architect',
      qualityIcon: '🕸️',
      theme: 'balance',
    },
  },
  3: {
    A: {
      headline: 'The Integration Slog',
      subheadline: '6-month API/RPA build',
      keyStats: [
        { value: '6-12mo', label: 'Timeline', trend: 'neutral' },
        { value: '$25M+', label: 'Opportunity Cost', trend: 'down' },
        { value: '-18%', label: 'Market Position', trend: 'down' },
      ],
      insight: 'By the time APIs are built, the market has moved. Half the turnaround burned on plumbing.',
      leadershipQuality: 'Process Purist',
      qualityIcon: '🔧',
      theme: 'risk',
    },
    B: {
      headline: 'Claude Computer Use',
      subheadline: 'Visual AI agents for legacy systems',
      keyStats: [
        { value: '10x', label: 'Speed', trend: 'up' },
        { value: '-60%', label: 'Cycle Time', trend: 'up' },
        { value: 'High', label: 'Risk Level', trend: 'neutral' },
      ],
      insight: 'Incredible velocity bypassing integration. Requires robust governance to manage risk.',
      leadershipQuality: 'Bold Innovator',
      qualityIcon: '🖥️',
      theme: 'growth',
    },
  },
  4: {
    A: {
      headline: 'Human Air-Gap',
      subheadline: 'Manual approval for all actions',
      keyStats: [
        { value: '50/hr', label: 'Max Throughput', trend: 'down' },
        { value: '400%', label: 'Backlog Growth', trend: 'down' },
        { value: '-75%', label: 'Efficiency Lost', trend: 'down' },
      ],
      insight: 'Human approval bottleneck wipes out AI efficiency gains. Queue explodes.',
      leadershipQuality: 'Control Seeker',
      qualityIcon: '🚫',
      theme: 'risk',
    },
    B: {
      headline: 'Supervisor Model',
      subheadline: 'AI-on-AI governance at machine speed',
      keyStats: [
        { value: '99.9%', label: 'Catch Rate', trend: 'up' },
        { value: '<10ms', label: 'Response', trend: 'up' },
        { value: '1000x', label: 'Scale', trend: 'up' },
      ],
      insight: 'Supervisor AI catches bad actions at machine speed. Safe autonomy achieved.',
      leadershipQuality: 'Governance Pioneer',
      qualityIcon: '🛡️',
      theme: 'balance',
    },
  },
  5: {
    A: {
      headline: 'Service Efficiency',
      subheadline: 'Same services, lower cost',
      keyStats: [
        { value: '-15%', label: 'Margin Erosion', trend: 'down' },
        { value: '6mo', label: 'Competitor Match', trend: 'neutral' },
        { value: '5%', label: 'Growth Cap', trend: 'down' },
      ],
      insight: 'Race to the bottom. Competitors match price cuts, margins compress again.',
      leadershipQuality: 'Efficiency Expert',
      qualityIcon: '📉',
      theme: 'risk',
    },
    B: {
      headline: 'Data Productization',
      subheadline: 'Intelligence-as-a-Service subscription',
      keyStats: [
        { value: '80%+', label: 'SaaS Margins', trend: 'up' },
        { value: '8-12x', label: 'Revenue Multiple', trend: 'up' },
        { value: '+100%', label: 'Valuation Jump', trend: 'up' },
      ],
      insight: 'Recurring revenue with software margins. Company re-rated as a Tech firm.',
      leadershipQuality: 'Platform Visionary',
      qualityIcon: '🚀',
      theme: 'growth',
    },
  },
};

// Keep CHOICE_INFOGRAPHICS as alias for backward compatibility
export const CHOICE_INFOGRAPHICS = CHOICE_INFOGRAPHICS_SET_A;

export const INITIAL_STOCK: StockState = {
  price: 100.00,
  history: [100.00],
  change: 0,
  changePercent: 0,
};

// SET A Ticker Results
export const TICKER_RESULTS_SET_A: Record<number, { A: TickerResult; B: TickerResult; C?: TickerResult }> = {
  1: {
    A: {
      type: 'volatile',
      label: 'Volatile Bump',
      percent: 1.5,
      analystNote: 'Aggressive spending on AI, but ROI timeline unclear due to training gaps.',
    },
    B: {
      type: 'loss',
      label: 'Minor Dip',
      percent: -1.0,
      analystNote: 'Q1 capital heavy on training. Street anxious for faster deployment.',
    },
    C: {
      type: 'loss',
      label: 'Slow Bleed',
      percent: -2.0,
      analystNote: 'Heavy consulting spend with no software deployed. Competitors are pulling ahead.',
    },
  },
  2: {
    A: {
      type: 'loss',
      label: 'Correction',
      percent: -2.5,
      analystNote: 'Reports of AI inaccuracies in claims processing rattling investors.',
    },
    B: {
      type: 'gain',
      label: 'Steady Climb',
      percent: 3.0,
      analystNote: 'Proprietary model creating significant operational moat. Margins improving.',
    },
    C: {
      type: 'loss',
      label: 'Volatile',
      percent: -1.0,
      analystNote: 'Mega-vendor contract signed, but internal integration friction is leaking to the street.',
    },
  },
  3: {
    A: {
      type: 'gain',
      label: 'Massive Surge',
      percent: 7.0,
      analystNote: 'Unprecedented efficiency gains from multi-agent systems. Strong Buy.',
    },
    B: {
      type: 'loss',
      label: 'Stagnation',
      percent: -4.0,
      analystNote: 'Company falling behind competitors adopting autonomous agents. Downgrade.',
    },
    C: {
      type: 'loss',
      label: 'Correction',
      percent: -3.5,
      analystNote: 'Analysts downgrade on reports of fragmented infrastructure and duplicate spending.',
    },
  },
  4: {
    A: {
      type: 'gain',
      label: 'Confidence Rally',
      percent: 5.0,
      analystNote: 'Best-in-class AI governance driving sustainable growth. Risk discount removed.',
    },
    B: {
      type: 'loss',
      label: 'The Crash',
      percent: -12.0,
      analystNote: 'AI program indefinitely paused. Competitors seizing market share. Sell now.',
    },
    C: {
      type: 'loss',
      label: 'Drop',
      percent: -4.0,
      analystNote: 'Heavy bureaucracy cited as primary reason for top AI talent exiting the firm.',
    },
  },
  5: {
    A: {
      type: 'volatile',
      label: 'Short Squeeze Pop',
      percent: 4.0,
      analystNote: 'Q4 earnings beat on aggressive headcount reduction. Long-term outlook negative.',
    },
    B: {
      type: 'gain',
      label: 'The Boom',
      percent: 10.0,
      analystNote: 'Successful pivot to AI-first revenue models. The new industry benchmark.',
    },
    C: {
      type: 'volatile',
      label: 'Flatline',
      percent: 0.0,
      analystNote: 'Glossy press releases fail to mask stagnant core revenue. Turnaround classified as incomplete.',
    },
  },
};

// SET B Ticker Results (from PDF)
export const TICKER_RESULTS_SET_B: Record<number, { A: TickerResult; B: TickerResult; C?: TickerResult }> = {
  1: {
    A: {
      type: 'volatile',
      label: 'Volatile',
      percent: 2.0,
      analystNote: 'Star hires made headlines, but operational disconnect worries analysts.',
    },
    B: {
      type: 'loss',
      label: 'Dip',
      percent: -1.5,
      analystNote: 'Slow hiring pace concerns the Street, though retention metrics look strong.',
    },
  },
  2: {
    A: {
      type: 'loss',
      label: 'Drop',
      percent: -4.5,
      analystNote: 'Audit recovery numbers disappoint. Analysts cite "AI hallucinations" in compliance reports.',
    },
    B: {
      type: 'gain',
      label: 'Surge',
      percent: 9.0,
      analystNote: 'PBM Audit unit beats recovery targets by 40%. Proprietary "Graph AI" tech cited as key differentiator.',
    },
  },
  3: {
    A: {
      type: 'volatile',
      label: 'Flat',
      percent: -0.5,
      analystNote: 'Tech debt continues to drag on operational velocity. No new efficiencies priced in.',
    },
    B: {
      type: 'gain',
      label: 'Spike',
      percent: 5.0,
      analystNote: 'Analysts shocked by sudden drop in underwriting cycle time. Operational leverage unlocked.',
    },
  },
  4: {
    A: {
      type: 'loss',
      label: 'Drop',
      percent: -6.0,
      analystNote: 'Operational backlog reported. AI efficiency gains failing to materialize on P&L.',
    },
    B: {
      type: 'gain',
      label: 'Rally',
      percent: 8.0,
      analystNote: 'First successful deployment of "Self-Healing" enterprise AI reported. Competitive moat widening.',
    },
  },
  5: {
    A: {
      type: 'volatile',
      label: 'Flat',
      percent: 1.0,
      analystNote: 'Cost savings priced in. Analysts question long-term growth durability.',
    },
    B: {
      type: 'gain',
      label: 'The Moonshot',
      percent: 12.0,
      analystNote: 'Market re-rating company from "Service Provider" to "AI Platform". Target price doubled.',
    },
  },
};

// Keep TICKER_RESULTS as alias for backward compatibility
export const TICKER_RESULTS = TICKER_RESULTS_SET_A;

export function calculateStockState(choiceRecords: ChoiceRecord[]): StockState {
  let price = 100.00;
  const history = [100.00];

  for (const record of choiceRecords) {
    const multiplier = 1 + (record.tickerResult.percent / 100);
    price = price * multiplier;
    history.push(price);
  }

  const change = price - 100;
  const changePercent = ((price - 100) / 100) * 100;

  return {
    price: Math.round(price * 100) / 100,
    history,
    change: Math.round(change * 100) / 100,
    changePercent: Math.round(changePercent * 100) / 100,
  };
}

export function getTickerResult(levelId: number, choice: ChoiceOption, questionSet: QuestionSet = 'A'): TickerResult {
  const tickerResults = getTickerResults(questionSet);
  return tickerResults[levelId]?.[choice] || {
    type: 'volatile',
    label: 'Unknown',
    percent: 0,
    analystNote: 'No data available.',
  };
}

// ============================================
// QUESTION SET HELPER FUNCTIONS
// ============================================

// Randomly select which question set to use for a game session
export function selectRandomSet(): QuestionSet {
  return Math.random() < 0.5 ? 'A' : 'B';
}

// Get levels for the specified question set
export function getLevels(questionSet: QuestionSet): Level[] {
  return questionSet === 'A' ? LEVELS_SET_A : LEVELS_SET_B;
}

// Get ticker results for the specified question set
export function getTickerResults(questionSet: QuestionSet): Record<number, { A: TickerResult; B: TickerResult; C?: TickerResult }> {
  return questionSet === 'A' ? TICKER_RESULTS_SET_A : TICKER_RESULTS_SET_B;
}

// Get choice infographics for the specified question set
export function getChoiceInfographics(questionSet: QuestionSet): Record<number, { A: ChoiceInfographic; B: ChoiceInfographic; C?: ChoiceInfographic }> {
  return questionSet === 'A' ? CHOICE_INFOGRAPHICS_SET_A : CHOICE_INFOGRAPHICS_SET_B;
}

// Calculate scores using the specified question set
export function calculateScoresForSet(choices: ChoiceOption[], questionSet: QuestionSet): Scores {
  const scores = { ...INITIAL_SCORES };
  const levels = getLevels(questionSet);
  
  choices.forEach((choice, index) => {
    const level = levels[index];
    if (level) {
      const scoreChange = level.scoring[choice] || level.scoring.A;
      scores.IV += scoreChange.IV;
      scores.OR += scoreChange.OR;
      scores.HR += scoreChange.HR;
      scores.TV += scoreChange.TV;
    }
  });
  
  return scores;
}

// Generate variant indices for the specified question set
export function generateVariantIndicesForSet(questionSet: QuestionSet): { A: number; B: number; C: number }[] {
  const levels = getLevels(questionSet);
  return levels.map(() => ({
    A: getRandomVariantIndex(),
    B: getRandomVariantIndex(),
    C: getRandomVariantIndex(),
  }));
}

// Generate display order for the specified question set
export function generateDisplayOrderForSet(questionSet: QuestionSet): ChoiceOption[][] {
  const levels = getLevels(questionSet);
  return levels.map((level) => generateSingleDisplayOrder(level));
}
