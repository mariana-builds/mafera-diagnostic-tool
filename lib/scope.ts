import type { Complexity } from "./scoring";

type Answers = Record<number, string>;

// ─── Regular flow dynamic text ───────────────────────────────────────────────

export function getCurrentSituation(answers: Answers): string {
  const parts: string[] = [];

  // Q6 – CRM
  const crmMap: Record<string, string> = {
    A: "Basic CRM usage",
    B: "No CRM / starting fresh",
    C: "Existing CRM with customisations to keep",
    D: "Transitioning between CRMs",
  };
  if (answers[6]) parts.push(crmMap[answers[6]]);

  // Q5 – migration
  const migMap: Record<string, string> = {
    A: "No data migration needed",
    B: "Simple data migration",
    C: "Complex data migration",
  };
  if (answers[5]) parts.push(migMap[answers[5]]);

  // Q4 – target types
  const pipeMap: Record<string, string> = {
    A: "One sales or partnership track",
    B: "Two sales or partnership tracks",
    C: "Three or more sales or partnership tracks",
  };
  if (answers[4]) parts.push(pipeMap[answers[4]]);

  // Q9 – users
  const usersMap: Record<string, string> = {
    A: "≤5 users, one team",
    B: "6–20 users across 2–3 teams",
    C: ">20 users across multiple teams",
  };
  if (answers[9]) parts.push(usersMap[answers[9]]);

  return parts.join(", ");
}

export function getTargetState(answers: Answers): string {
  const pipelinesLabel: Record<string, string> = {
    A: "1 sales or partnership track",
    B: "2 sales or partnership tracks",
    C: "3+ sales or partnership tracks",
  };
  const automationsLabel: Record<string, string> = {
    A: "5–10 automations",
    B: "10–20 automations",
    C: "20+ automated workflows",
  };
  const integrationsLabel: Record<string, string> = {
    A: "email and calendar only",
    B: "standard connected tools",
    C: "advanced connected tools",
  };
  const reportingLabel: Record<string, string> = {
    A: "standard reports",
    B: "custom dashboards and metrics",
    C: "multi-dimensional reporting",
  };
  const usersLabel: Record<string, string> = {
    A: "≤5 users, 1 team",
    B: "6–20 users, 2–3 teams",
    C: ">20 users, multiple teams",
  };

  const parts = [
    `Structured sales process supporting ${pipelinesLabel[answers[4]] ?? "N/A"}`,
    automationsLabel[answers[8]] ?? "N/A",
    integrationsLabel[answers[7]] ?? "N/A",
    reportingLabel[answers[10]] ?? "N/A",
    `for ${usersLabel[answers[9]] ?? "N/A"}`,
  ];
  return parts.join(", ");
}

export function getPipelineCount(answers: Answers): string {
  return (
    {
      A: "1 sales or partnership track",
      B: "2 sales or partnership tracks",
      C: "3+ sales or partnership tracks",
    }[answers[4]] ?? "1 sales track"
  );
}

export function getAutomationsScope(answers: Answers): string {
  return (
    {
      A: "5–10 light automations",
      B: "10–20 automations and workflows",
      C: "20+ complex automated workflows",
    }[answers[8]] ?? "5–10 light automations"
  );
}

export function getMigrationScope(answers: Answers): string {
  return (
    {
      A: "No data migration",
      B: "Simple data migration (1 tool, <50k records)",
      C: "Complex data migration (multiple tools, >50k records)",
    }[answers[5]] ?? "No data migration"
  );
}

export function getIntegrationsScope(answers: Answers): string {
  return (
    {
      A: "Email and calendar connection only",
      B: "Standard tool connections (e.g. email marketing, website forms)",
      C: "Advanced connections (data enrichment, product usage, custom APIs)",
    }[answers[7]] ?? "Email and calendar only"
  );
}

// ─── Per-answer working-day estimates ────────────────────────────────────────
// Rule: when a range was given, always use the higher number.

const TASK_DAYS = {
  crm:          { A: 0.5, B: 2,  C: 2.5, D: 3  } as Record<string, number>,
  migration:    { A: 0,   B: 3,  C: 7          } as Record<string, number>,
  pipelines:    { A: 1,   B: 1.5,C: 3          } as Record<string, number>,
  automations:  { A: 2,   B: 4,  C: 9          } as Record<string, number>,
  integrations: { A: 0.5, B: 7,  C: 15         } as Record<string, number>,
  reporting:    { A: 1,   B: 7,  C: 15         } as Record<string, number>,
  training:     { A: 1,   B: 3,  C: 5          } as Record<string, number>,
};

// Fixed overhead (days): discovery kickoff, QA, go-live prep, PM buffer
const FIXED = { discovery: 2, testing: 2, golive: 3, overhead: 2 };

// Descriptive labels used inside each phase line
const LABEL = {
  crm: {
    A: "CRM reconfiguration",
    B: "CRM setup from scratch",
    C: "CRM setup + preserving customisations",
    D: "CRM migration (decommission old + full new setup)",
  } as Record<string, string>,
  migration: {
    B: "simple data migration",
    C: "complex data migration",
  } as Record<string, string>,
  pipelines: {
    A: "1 sales profile",
    B: "2 sales profiles",
    C: "3+ sales profiles",
  } as Record<string, string>,
  automations: {
    A: "5–10 automations",
    B: "10–20 automations",
    C: "20+ automated workflows",
  } as Record<string, string>,
  integrations: {
    A: "email & calendar connection",
    B: "standard tool integrations",
    C: "advanced integrations (data enrichment, custom APIs)",
  } as Record<string, string>,
  reporting: {
    A: "standard reports",
    B: "custom dashboards & metrics",
    C: "multi-dimensional reporting",
  } as Record<string, string>,
  training: {
    A: "team training (1 team)",
    B: "team training (2–3 teams)",
    C: "team training (multiple teams & locations)",
  } as Record<string, string>,
};

function weekRange(startDay: number, endDay: number): string {
  const s = Math.ceil(startDay / 5);
  const e = Math.ceil(endDay / 5);
  return s === e ? `Week ${s}` : `Week ${s}–${e}`;
}

export function getTimeline(complexity: Complexity, answers?: Answers): string[] {
  // ── No answers: fall back to generic complexity-band text ──────────────────
  if (!answers) {
    if (complexity === "Low") {
      return [
        "Week 1: Discovery + CRM setup",
        "Week 2–3: Sales profiles + automations",
        "Week 4: Integrations + testing",
        "Week 5: Training + go-live",
      ];
    }
    if (complexity === "Medium") {
      return [
        "Week 1–2: Discovery + CRM setup + data migration",
        "Week 3–5: Sales profiles + automations + integrations",
        "Week 6–7: Reporting + testing",
        "Week 8–9: Training + go-live",
      ];
    }
    return [
      "Week 1–3: Discovery + CRM migration + data migration",
      "Week 4–8: Sales profiles + automations + integrations",
      "Week 9–11: Reporting + testing",
      "Week 12–14: Training + go-live",
    ];
  }

  // ── Answer-aware path ──────────────────────────────────────────────────────
  const d = {
    crm:         TASK_DAYS.crm[answers[6]]         ?? TASK_DAYS.crm.B,
    migration:   TASK_DAYS.migration[answers[5]]   ?? 0,
    pipelines:   TASK_DAYS.pipelines[answers[4]]   ?? TASK_DAYS.pipelines.A,
    automations: TASK_DAYS.automations[answers[8]] ?? TASK_DAYS.automations.A,
    integrations:TASK_DAYS.integrations[answers[7]]?? TASK_DAYS.integrations.A,
    reporting:   TASK_DAYS.reporting[answers[10]]  ?? TASK_DAYS.reporting.A,
    training:    TASK_DAYS.training[answers[9]]    ?? TASK_DAYS.training.A,
  };

  // Phase end boundaries (cumulative working days)
  const p1End = FIXED.discovery + d.crm + d.migration;
  const p2End = p1End + d.pipelines + d.automations + d.integrations;
  const p3End = p2End + d.reporting + FIXED.testing;
  const p4End = p3End + d.training + FIXED.golive + FIXED.overhead;

  // Phase 1 — Discovery + CRM + migration (if any)
  const migSuffix =
    answers[5] && answers[5] !== "A"
      ? ` + ${LABEL.migration[answers[5]]}`
      : "";
  const phase1 = `${weekRange(1, p1End)}: Discovery + ${LABEL.crm[answers[6]] ?? "CRM setup"}${migSuffix}`;

  // Phase 2 — Build
  const phase2 = `${weekRange(p1End + 1, p2End)}: ${LABEL.pipelines[answers[4]] ?? "Sales profiles"} · ${LABEL.automations[answers[8]] ?? "Automations"} · ${LABEL.integrations[answers[7]] ?? "Integrations"}`;

  // Phase 3 — Reporting + testing
  const phase3 = `${weekRange(p2End + 1, p3End)}: ${LABEL.reporting[answers[10]] ?? "Reporting"} + testing & QA`;

  // Phase 4 — Training + go-live
  const phase4 = `${weekRange(p3End + 1, p4End)}: ${LABEL.training[answers[9]] ?? "Team training"} + go-live`;

  return [phase1, phase2, phase3, phase4];
}

// ─── Automation-only flow dynamic text ───────────────────────────────────────

export function getAutomationCurrentSituation(q12Choice: string): string {
  return (
    {
      A: "No automations in place yet",
      B: "Some basic automations already running",
      C: "Complex or extensive automations in place, or a large build needed",
    }[q12Choice] ?? "No automations"
  );
}

export function getAutomationTarget(q12Choice: string): string {
  return (
    {
      A: "5–10 basic automations running",
      B: "10–20 refined and new automations",
      C: "20+ complex automated workflows",
    }[q12Choice] ?? "5–10 automations"
  );
}

export function getAutomationTimeline(q12Choice: string): string {
  return (
    {
      A: "5–8 days",
      B: "8–12 days",
      C: "12–20 days",
    }[q12Choice] ?? "5–8 days"
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

/** Human-readable quote range string */
export function quoteRange(low: number, high: number): string {
  const fmt = (n: number) =>
    new Intl.NumberFormat("de-DE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n);
  return `€${fmt(low)} – €${fmt(high)}`;
}
