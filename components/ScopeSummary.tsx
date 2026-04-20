"use client";

import {
  getCurrentSituation,
  getTargetState,
  getPipelineCount,
  getAutomationsScope,
  getMigrationScope,
  getIntegrationsScope,
  getTimeline,
  getAutomationCurrentSituation,
  getAutomationTarget,
  getAutomationTimeline,
  quoteRange,
} from "@/lib/scope";
import type { Complexity } from "@/lib/scoring";
import SiteHeader from "./SiteHeader";

export type ScopeData =
  | {
      flow: "regular";
      answers: Record<number, string>;
      scores: Record<number, number>;
      totalScore: number;
      complexity: Complexity;
      quoteLow: number;
      quoteHigh: number;
      daysLow: number;
      daysHigh: number;
    }
  | {
      flow: "automation";
      answers: Record<number, string>;
      q12Choice: string;
      quoteLow: number;
      quoteHigh: number;
      daysLow: number;
      daysHigh: number;
    };

interface Props {
  scopeData: ScopeData;
  onProceed: () => void;
  onBack: () => void;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-slate-700 text-sm">
          <span className="mt-1 w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function ScopeSummary({ scopeData, onProceed, onBack }: Props) {
  const isRegular = scopeData.flow === "regular";
  const qRange = quoteRange(scopeData.quoteLow, scopeData.quoteHigh);
  const days = `${scopeData.daysLow}–${scopeData.daysHigh} days`;

  let currentSituation = "";
  let targetState = "";
  let inScope: string[] = [];
  let notInScope: string[] = [];
  let deliverables: string[] = [];
  let timeline: string[] = [];
  let commercialTerms = "";
  let badgeLabel = "";
  let badgeColor = "";

  if (isRegular && scopeData.flow === "regular") {
    const { answers, complexity } = scopeData;
    currentSituation = getCurrentSituation(answers);
    targetState = getTargetState(answers);
    const pipelineCount = getPipelineCount(answers);
    const automationsScope = getAutomationsScope(answers);
    const migrationScope = getMigrationScope(answers);
    const integrationsScope = getIntegrationsScope(answers);
    timeline = getTimeline(complexity, answers);

    inScope = [
      `Sales tool setup + ${pipelineCount}`,
      migrationScope,
      automationsScope,
      integrationsScope,
      "Custom dashboards + performance tracking",
      "Team training + 2 weeks post-launch support",
    ];

    notInScope = [
      "Ongoing management or support after the project",
      "Custom software development",
      "Building email marketing campaigns (connection only)",
      "Extra training sessions beyond the handover",
    ];

    deliverables = [
      `Fully configured sales tool + ${pipelineCount}`,
      `${automationsScope}, live and documented`,
      "Custom dashboards + performance tracking setup",
      "Process guides for each team",
      "2 weeks post-launch support",
    ];

    commercialTerms = "40% upfront · 30% mid-project · 30% on delivery";

    const complexityColors: Record<Complexity, [string, string]> = {
      Low: ["bg-emerald-50 text-emerald-700 border-emerald-200", "Low complexity"],
      Medium: ["bg-amber-50 text-amber-700 border-amber-200", "Medium complexity"],
      High: ["bg-rose-50 text-rose-700 border-rose-200", "High complexity"],
    };
    [badgeColor, badgeLabel] = complexityColors[complexity];
    badgeLabel = complexity + " complexity";
  } else if (!isRegular && scopeData.flow === "automation") {
    const q12 = scopeData.q12Choice;
    currentSituation = getAutomationCurrentSituation(q12);
    targetState = getAutomationTarget(q12);
    const timelineStr = getAutomationTimeline(q12);
    timeline = [`Timeline: ${timelineStr}`];

    inScope = [
      "Review of existing automations",
      `Build ${targetState.toLowerCase()}`,
      "Testing + team handover documentation",
    ];
    notInScope = [
      "Sales tool rebuild or data migration",
      "New connections to external tools",
      "Dashboard or reporting build",
    ];
    deliverables = [
      `${targetState} in your sales tool`,
      "Automation documentation + process guides",
      "Team handover session",
    ];
    commercialTerms = "40% upfront · 60% on delivery";
    badgeLabel = "Automations only";
    badgeColor = "bg-blue-50 text-blue-700 border-blue-200";
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <div className="flex-1 py-8 px-4">
        <div className="max-w-2xl mx-auto animate-slide-up">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Project Scope: Your New Sales Pipeline
            </h1>
            <p className="text-slate-500 text-base">
              {isRegular
                ? "Here's what's included based on your answers."
                : "Automations only. No full system rebuild."}
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-6 print-container">
            <Section title="Where you're starting">
              <p className="text-slate-700 text-sm leading-relaxed">
                {currentSituation}
              </p>
            </Section>

            <Section title="Where you're heading">
              <p className="text-slate-700 text-sm leading-relaxed">
                {targetState}
              </p>
            </Section>

            <Section title="What's included">
              <BulletList items={inScope} />
            </Section>

            <Section title="What's not included">
              <BulletList items={notInScope} />
            </Section>

            <Section title="What you'll receive">
              <BulletList items={deliverables} />
            </Section>

            <Section title="Timeline">
              <div className="space-y-2">
                {timeline.map((t, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-orange-400 mt-2" />
                    <span className="text-slate-700">{t}</span>
                  </div>
                ))}
              </div>
            </Section>

            {/* Quote block */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="bg-slate-50 rounded-xl p-5">
                <div className="space-y-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">
                      Ballpark quote
                    </p>
                    <p className="text-3xl font-bold text-slate-900">{qRange}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{days}</p>
                  </div>
                  <div className="text-sm text-slate-500">
                    <p className="font-medium text-slate-700 mb-0.5">
                      Payment terms
                    </p>
                    <p>{commercialTerms}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between no-print">
            <button
              onClick={onBack}
              className="text-slate-400 hover:text-slate-600 text-sm font-medium flex items-center gap-1.5 transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={onProceed}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3.5 rounded-xl border border-orange-600/20 hover:-translate-y-0.5 transition-all duration-150"
            >
              Get a full proposal →
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
