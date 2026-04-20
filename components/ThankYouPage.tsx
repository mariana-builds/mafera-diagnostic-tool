"use client";

import { useState } from "react";
import type { ScopeData } from "./ScopeSummary";
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
import SiteHeader from "./SiteHeader";

interface LeadData {
  name: string;
  email: string;
  company: string;
  context: string;
}

interface Props {
  scopeData: ScopeData;
  leadData: LeadData | null;
  onFeedback: () => void;
}

function IconCheck() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-8 h-8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 16 4 11" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IconCopy() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export default function ThankYouPage({ scopeData, leadData, onFeedback }: Props) {
  const [copied, setCopied] = useState(false);
  const calLink =
    process.env.NEXT_PUBLIC_CALENDAR_30MIN ??
    "https://calendar.notion.so/meet/mariana-ferreira/schedule";

  const qRange = quoteRange(scopeData.quoteLow, scopeData.quoteHigh);
  const days = `${scopeData.daysLow}–${scopeData.daysHigh} days`;

  const buildScopeText = (): string => {
    const lines: string[] = [];
    const isRegular = scopeData.flow === "regular";

    if (isRegular && scopeData.flow === "regular") {
      const { answers, complexity } = scopeData;
      lines.push("PROJECT SCOPE");
      lines.push("=".repeat(40));
      lines.push("");
      lines.push("WHERE YOU'RE STARTING");
      lines.push(getCurrentSituation(answers));
      lines.push("");
      lines.push("WHERE YOU'RE HEADING");
      lines.push(getTargetState(answers));
      lines.push("");
      lines.push("WHAT'S INCLUDED");
      lines.push(`• Sales tool setup + ${getPipelineCount(answers)}`);
      lines.push(`• ${getMigrationScope(answers)}`);
      lines.push(`• ${getAutomationsScope(answers)}`);
      lines.push(`• ${getIntegrationsScope(answers)}`);
      lines.push("• Custom dashboards + performance tracking");
      lines.push("• Team training + 2 weeks post-launch support");
      lines.push("");
      lines.push("WHAT'S NOT INCLUDED");
      lines.push("• Ongoing management or support after the project");
      lines.push("• Custom software development");
      lines.push("• Building email marketing campaigns (connection only)");
      lines.push("• Extra training sessions beyond the handover");
      lines.push("");
      lines.push("TIMELINE");
      getTimeline(complexity, answers).forEach((t) => lines.push(`• ${t}`));
      lines.push("");
      lines.push("QUOTE");
      lines.push(`${qRange} | ${days}`);
      lines.push("Payment terms: 40% upfront · 30% mid-project · 30% on delivery");
    } else if (scopeData.flow === "automation") {
      const q12 = scopeData.q12Choice;
      lines.push("AUTOMATION PROJECT SCOPE");
      lines.push("=".repeat(40));
      lines.push("");
      lines.push("WHERE YOU'RE STARTING");
      lines.push(getAutomationCurrentSituation(q12));
      lines.push("");
      lines.push("WHERE YOU'RE HEADING");
      lines.push(getAutomationTarget(q12));
      lines.push("");
      lines.push("WHAT'S INCLUDED");
      lines.push("• Review of existing automations");
      lines.push(`• Build ${getAutomationTarget(q12).toLowerCase()}`);
      lines.push("• Testing + team handover documentation");
      lines.push("");
      lines.push("WHAT'S NOT INCLUDED");
      lines.push("• Sales tool rebuild or data migration");
      lines.push("• New connections to external tools");
      lines.push("• Dashboard or reporting build");
      lines.push("");
      lines.push("TIMELINE");
      lines.push(getAutomationTimeline(q12));
      lines.push("");
      lines.push("QUOTE");
      lines.push(`${qRange} | ${days}`);
      lines.push("Payment terms: 40% upfront · 60% on delivery");
    }

    return lines.join("\n");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildScopeText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback — shouldn't be needed on modern browsers
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <div className="flex-1 py-8 px-4">
        <div className="max-w-xl mx-auto animate-slide-up">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-5">
              <IconCheck />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-3">
              Scope sent!
            </h1>
            <p className="text-slate-500 text-base">
              Check your email. It should be there now.
            </p>
          </div>

          {/* Quote card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">
              Your quote
            </p>
            <p className="text-3xl font-bold text-slate-900 mb-1">{qRange}</p>
            <p className="text-slate-500 text-sm">{days}</p>

            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center mt-0.5">
                  1
                </span>
                <p className="text-slate-700 text-sm">
                  Review your scope and quote in your email. Sent immediately.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center mt-0.5">
                  2
                </span>
                <p className="text-slate-700 text-sm">
                  Book a short kickoff call to confirm the details and next
                  steps.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 mb-6 no-print">
            <a
              href={calLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold border border-orange-600/20 hover:-translate-y-0.5 transition-all duration-150"
            >
              <IconCalendar />
              Book kickoff call
            </a>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-medium hover:border-slate-300 hover:bg-slate-50 transition-all duration-150 text-sm"
              >
                <IconCopy />
                {copied ? "Copied!" : "Copy scope"}
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-medium hover:border-slate-300 hover:bg-slate-50 transition-all duration-150 text-sm"
              >
                <IconDownload />
                Download PDF
              </button>
            </div>
          </div>

          {/* Didn't receive */}
          <p className="text-center text-sm text-slate-400">
            Email not received?{" "}
            <a
              href="mailto:mariana@mafera.de"
              className="text-orange-600 hover:underline"
            >
              Contact mariana@mafera.de
            </a>
          </p>

          {/* Feedback nudge */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center no-print">
            <p className="text-sm text-slate-400 mb-2">How was your experience?</p>
            <button
              onClick={onFeedback}
              className="text-sm font-medium text-slate-500 hover:text-orange-500 underline underline-offset-2 transition-colors"
            >
              Leave a quick rating →
            </button>
          </div>

          {/* Print-only scope */}
          <div className="print-only mt-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Full Scope
            </h2>
            <pre className="whitespace-pre-wrap text-sm text-slate-700 font-sans leading-relaxed">
              {buildScopeText()}
            </pre>
          </div>
        </div>
      </div>

    </div>
  );
}
