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

export function getTimeline(complexity: Complexity): string[] {
  if (complexity === "Low") {
    return [
      "Week 1: Discovery + initial sales tool setup",
      "Week 2–3: One sales track + 5–10 automations",
      "Week 4: Tool connections + testing",
      "Week 5: Go-live + handover",
    ];
  }
  if (complexity === "Medium") {
    return [
      "Week 1–2: Discovery + data migration + sales tool setup",
      "Week 3–5: 2 sales tracks + 10–20 automations",
      "Week 6–7: Tool connections + custom dashboards",
      "Week 8: Testing + rollout",
      "Week 9: Go-live + 2 weeks post-launch support",
    ];
  }
  // High
  return [
    "Week 1–3: Complex migration + sales tool rebuild",
    "Week 4–7: 3+ sales tracks + 20+ automations",
    "Week 8–10: Multi-tool connections + reporting",
    "Week 11–12: Multi-team rollout + testing",
    "Week 13–14: Go-live + extended support",
  ];
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
