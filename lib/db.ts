import { Pool } from "pg";

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 5,
    });
  }
  return pool;
}

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

async function ensureTable(client: import("pg").PoolClient) {
  await client.query(`
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
  `);
}

export async function saveLead(lead: LeadRecord): Promise<number> {
  const client = await getPool().connect();
  try {
    await ensureTable(client);
    const { rows } = await client.query(
      `INSERT INTO leads (
         flow_type, q1_choice, scores, total_score, complexity,
         quote_low, quote_high, days_low, days_high,
         current_situation, target_state, name, email, company, context
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       RETURNING id`,
      [
        lead.flowType,
        lead.q1Choice,
        JSON.stringify(lead.scores),
        lead.totalScore,
        lead.complexity,
        lead.quoteLow,
        lead.quoteHigh,
        lead.daysLow,
        lead.daysHigh,
        lead.currentSituation,
        lead.targetState,
        lead.name,
        lead.email,
        lead.company,
        lead.context,
      ]
    );
    return rows[0].id as number;
  } finally {
    client.release();
  }
}
