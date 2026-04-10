export interface QuestionOption {
  id: string; // 'A' | 'B' | 'C' | 'D'
  text: string;
  score?: number;
}

export interface Question {
  id: number;
  heading: string;
  text: string;
  multiSelect?: boolean;
  options: QuestionOption[];
}

// Regular flow: Q1–Q11
export const questions: Question[] = [
  {
    id: 1,
    heading: "Where are you starting?",
    text: "What do you want to achieve right now?",
    options: [
      {
        id: "A",
        text: "Set up or redesign our sales process and client or partner pipeline, including a sales tool (CRM).",
      },
      {
        id: "B",
        text: "Set up or extend automated workflows in our existing sales tool.",
      },
      { id: "C", text: "Sales tool training or sales coaching for the team." },
      { id: "D", text: "Not sure, just exploring." },
    ],
  },
  {
    id: 2,
    heading: "Trigger",
    text: "What's driving you to work on your sales process now?",
    multiSelect: true,
    options: [
      {
        id: "A",
        text: "We're building or rebuilding our entire sales engine for growth.",
        score: 3,
      },
      {
        id: "B",
        text: "We want to spend less time on manual tasks.",
        score: 2,
      },
      {
        id: "C",
        text: "We want to convert more.",
        score: 2,
      },
      {
        id: "D",
        text: "We want better ways of working.",
        score: 1,
      },
    ],
  },
  {
    id: 3,
    heading: "Success definition",
    text: "How clearly defined is success for this project?",
    options: [
      { id: "A", text: "We don't have concrete targets yet.", score: 2 },
      {
        id: "B",
        text: 'We have high-level goals (e.g., "more qualified leads", "shorter sales cycle").',
        score: 1,
      },
      {
        id: "C",
        text: 'We have very specific targets (e.g., "+€X in new revenue, +Y% deals won, Z days off the sales cycle").',
        score: 3,
      },
    ],
  },
  {
    id: 4,
    heading: "Sales tracks",
    text: "How many different sales or partnership tracks should this system handle in the next 12–18 months?",
    options: [
      {
        id: "A",
        text: "One (e.g., direct sales only).",
        score: 1,
      },
      {
        id: "B",
        text: "Two (e.g., direct sales + one partner type).",
        score: 2,
      },
      {
        id: "C",
        text: "Three or more (e.g., direct sales + multiple partner or channel types).",
        score: 3,
      },
    ],
  },
  {
    id: 5,
    heading: "Data migration",
    text: "Will you need to move data from existing tools into the new setup?",
    options: [
      { id: "A", text: "No.", score: 1 },
      {
        id: "B",
        text: "Yes, a simple move (one tool, fewer than 50,000 records, basic fields).",
        score: 2,
      },
      {
        id: "C",
        text: "Yes, a complex move (one or multiple tools, more than 50,000 records, custom fields).",
        score: 3,
      },
    ],
  },
  {
    id: 6,
    heading: "Current sales tool",
    text: "Which of these best describes your current situation?",
    options: [
      {
        id: "A",
        text: "We have a sales tool (CRM) but use it in a basic way.",
        score: 1,
      },
      { id: "B", text: "No sales tool yet, starting from scratch.", score: 2 },
      {
        id: "C",
        text: "We already have a sales tool with customisations we must keep.",
        score: 3,
      },
      { id: "D", text: "We are switching from one sales tool to another.", score: 3 },
    ],
  },
  {
    id: 7,
    heading: "Connected tools",
    text: "Which other tools need to connect to your sales setup from day one?",
    options: [
      { id: "A", text: "Nothing beyond email and calendar.", score: 1 },
      {
        id: "B",
        text: "A few standard tools (e.g., email marketing, website contact forms).",
        score: 2,
      },
      {
        id: "C",
        text: "Several tools plus data enrichment, product usage tracking, or custom connections.",
        score: 3,
      },
    ],
  },
  {
    id: 8,
    heading: "Automations",
    text: "Roughly how many processes and automations do you expect the system to handle in the first 3 months?",
    options: [
      {
        id: "A",
        text: "Basic system (~1–2 workflows with up to 5 automations).",
        score: 1,
      },
      {
        id: "B",
        text: "Complete system (~3–6 workflows and up to 15 automations).",
        score: 2,
      },
      {
        id: "C",
        text: "Complex system (~7+ workflows and 15+ automations).",
        score: 3,
      },
    ],
  },
  {
    id: 9,
    heading: "Active users",
    text: "How many people will actively use this system over the next 12 months?",
    options: [
      { id: "A", text: "5 or fewer, mostly one team.", score: 1 },
      { id: "B", text: "6–20 people across 2–3 teams.", score: 2 },
      {
        id: "C",
        text: "More than 20 people across multiple teams or locations.",
        score: 3,
      },
    ],
  },
  {
    id: 10,
    heading: "Reporting",
    text: "How defined are your reporting and tracking needs?",
    options: [
      {
        id: "A",
        text: "Standard reports: basic activity and pipeline views.",
        score: 1,
      },
      {
        id: "B",
        text: "We have specific metrics and dashboards in mind.",
        score: 2,
      },
      {
        id: "C",
        text: "We need detailed, multi-dimensional reporting (by partner type, region, deal stage, etc.).",
        score: 3,
      },
    ],
  },
  {
    id: 11,
    heading: "Timeline",
    text: "What is your ideal timeline for this?",
    options: [
      {
        id: "A",
        text: "We're fine with a phased rollout over 6–12 months.",
        score: 1,
      },
      {
        id: "B",
        text: "We want everything set up within 3–6 months.",
        score: 2,
      },
      { id: "C", text: "We need the main parts done within 3 months.", score: 3 },
    ],
  },
];

// Automation-only flow (Q1 = B)
export const automationQuestion: Question = {
  id: 12,
  heading: "Automation scope",
  text: "What's your current automation situation?",
  options: [
    {
      id: "A",
      text: "No automations at all. I need around 5–10 basic ones to start.",
    },
    {
      id: "B",
      text: "Some basic automations exist. I need refinements and 10–20 new, lighter workflows.",
    },
    {
      id: "C",
      text: "I have and/or need many automations with complex logic.",
    },
  ],
};

// Helper: get a question by ID (regular + automation)
export function getQuestion(id: number): Question | undefined {
  if (id === 12) return automationQuestion;
  return questions.find((q) => q.id === id);
}

// Regular question sequence
export const regularQuestionIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
