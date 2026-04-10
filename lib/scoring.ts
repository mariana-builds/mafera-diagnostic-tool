export type Complexity = "Low" | "Medium" | "High";

export interface RegularResult {
  totalScore: number;
  complexity: Complexity;
  quoteLow: number;
  quoteHigh: number;
  daysLow: number;
  daysHigh: number;
  hoursLow: number;
  hoursHigh: number;
}

export interface AutomationResult {
  quoteLow: number;
  quoteHigh: number;
  daysLow: number;
  daysHigh: number;
}

// Sum scores for Q2–Q11 (10 scored questions, range 10–30)
export function calculateRegularScore(
  scores: Record<number, number>
): number {
  let total = 0;
  for (let q = 2; q <= 11; q++) {
    total += scores[q] ?? 0;
  }
  return total;
}

export function getComplexityResult(totalScore: number): RegularResult {
  if (totalScore <= 18) {
    return {
      totalScore,
      complexity: "Low",
      quoteLow: 12750,
      quoteHigh: 21250,
      daysLow: 15,
      daysHigh: 25,
      hoursLow: 120,
      hoursHigh: 200,
    };
  }
  if (totalScore <= 25) {
    return {
      totalScore,
      complexity: "Medium",
      quoteLow: 25500,
      quoteHigh: 38250,
      daysLow: 30,
      daysHigh: 45,
      hoursLow: 240,
      hoursHigh: 360,
    };
  }
  return {
    totalScore,
    complexity: "High",
    quoteLow: 42500,
    quoteHigh: 59500,
    daysLow: 50,
    daysHigh: 70,
    hoursLow: 400,
    hoursHigh: 560,
  };
}

export function getAutomationResult(q12Choice: string): AutomationResult {
  switch (q12Choice) {
    case "B":
      return { quoteLow: 6000, quoteHigh: 9000, daysLow: 8, daysHigh: 12 };
    case "C":
      return { quoteLow: 9000, quoteHigh: 16000, daysLow: 12, daysHigh: 20 };
    default: // A
      return { quoteLow: 4000, quoteHigh: 6000, daysLow: 5, daysHigh: 8 };
  }
}

export function formatEur(amount: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}
