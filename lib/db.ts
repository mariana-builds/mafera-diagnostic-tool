import { neon } from "@neondatabase/serverless";

export interface LeadRecord {
  flowType: string;
  q1Choice: string;
  scores: number[];
  totalScore: number | null;
  complexity: string | null;
  quoteLow: number;
  quoteHigh: number;
  daysLow: number;
  daysHigh: number;
  currentSituation: string;
  targetState: string;
  name: string;
  email: string;
  company: string;
  context: string;
}

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

async function ensureTable(sql: ReturnType<typeof getSql>) {
  await sql`
    CREATE TABLE IF NOT EXISTS leads (
      id            SERIAL PRIMARY KEY,
      created_at    TIMESTAMPTZ DEFAULT NOW(),
      flow_type     TEXT NOT NULL,
      q1_choice     TEXT NOT NULL,
      scores        JSONB,
      total_score   INTEGER,
      complexity    TEXT,
      quote_low     INTEGER,
      quote_high    INTEGER,
      days_low      INTEGER,
      days_high     INTEGER,
      current_situation TEXT,
      target_state  TEXT,
      name          TEXT,
      email         TEXT,
      company       TEXT,
      context       TEXT
    )
  `;
}

export async function saveLead(lead: LeadRecord): Promise<number> {
  const sql = getSql();
  await ensureTable(sql);
  const rows = await sql`
    INSERT INTO leads (
      flow_type, q1_choice, scores, total_score, complexity,
      quote_low, quote_high, days_low, days_high,
      current_situation, target_state, name, email, company, context
    ) VALUES (
      ${lead.flowType},
      ${lead.q1Choice},
      ${JSON.stringify(lead.scores)},
      ${lead.totalScore},
      ${lead.complexity},
      ${lead.quoteLow},
      ${lead.quoteHigh},
      ${lead.daysLow},
      ${lead.daysHigh},
      ${lead.currentSituation},
      ${lead.targetState},
      ${lead.name},
      ${lead.email},
      ${lead.company},
      ${lead.context}
    )
    RETURNING id
  `;
  return rows[0].id as number;
}
