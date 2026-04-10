"use client";

import { useState, FormEvent } from "react";
import type { ScopeData } from "./ScopeSummary";
import {
  getCurrentSituation,
  getTargetState,
  getAutomationCurrentSituation,
  getAutomationTarget,
  quoteRange,
} from "@/lib/scope";
import SiteHeader from "./SiteHeader";

interface LeadForm {
  name: string;
  email: string;
  company: string;
  context: string;
}

interface Props {
  scopeData: ScopeData;
  onSubmit: (leadData: LeadForm) => void;
  onBack: () => void;
  onReset: () => void;
}

function IconClipboard() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  );
}

export default function LeadCapture({ scopeData, onSubmit, onBack, onReset }: Props) {
  const [form, setForm] = useState<LeadForm>({
    name: "",
    email: "",
    company: "",
    context: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calLink =
    process.env.NEXT_PUBLIC_CALENDAR_30MIN ??
    "https://calendly.com/mariana-mafera/30min";

  const qRange = quoteRange(scopeData.quoteLow, scopeData.quoteHigh);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.company) return;

    setLoading(true);
    setError(null);

    try {
      const answers =
        scopeData.flow === "regular" ? scopeData.answers : scopeData.answers;
      const scores =
        scopeData.flow === "regular" ? scopeData.scores : {};
      const q12Choice =
        scopeData.flow === "automation" ? scopeData.q12Choice : "";

      const payload = {
        flow: scopeData.flow,
        q1Choice: answers[1] ?? (scopeData.flow === "automation" ? "B" : "A"),
        q12Choice,
        answers,
        scores,
        complexity: scopeData.flow === "regular" ? scopeData.complexity : null,
        totalScore: scopeData.flow === "regular" ? scopeData.totalScore : null,
        quoteLow: scopeData.quoteLow,
        quoteHigh: scopeData.quoteHigh,
        daysLow: scopeData.daysLow,
        daysHigh: scopeData.daysHigh,
        ...form,
      };

      const res = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Submission failed");

      onSubmit(form);
    } catch {
      setError(
        "Something went wrong. Your scope is saved. Please email mariana@mafera.de directly."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex flex-col">
      <SiteHeader onReset={onReset} />

      <div className="flex-1 py-8 px-4">
        <div className="max-w-xl mx-auto animate-slide-up">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-600 mb-4">
              <IconClipboard />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-3">
              Ready to move forward?
            </h1>
            <p className="text-slate-500 text-base">
              Share your details to receive your current scope instantly. We'll
              be in touch within 48 hours to answer any questions you might have
              and align on the next steps.
            </p>
            <div className="mt-4 inline-block bg-orange-50 text-orange-600 text-sm font-semibold px-4 py-2 rounded-full border border-orange-100">
              Your quote: {qRange}
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8 mb-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Full name <span className="text-red-400">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Jane Smith"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Work email <span className="text-red-400">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="jane@company.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Company <span className="text-red-400">*</span>
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  required
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Acme Inc."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="context"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Anything else we should know?{" "}
                  <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  id="context"
                  name="context"
                  rows={3}
                  value={form.context}
                  onChange={handleChange}
                  placeholder="Deadlines, constraints, or anything specific about your situation..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-sm resize-none"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-100">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !form.name || !form.email || !form.company}
                className={[
                  "w-full py-4 rounded-xl font-semibold text-base transition-all duration-150",
                  loading || !form.name || !form.email || !form.company
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-200 hover:shadow-lg hover:-translate-y-0.5",
                ].join(" ")}
              >
                {loading ? "Sending…" : "Send my scope →"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-slate-400 text-sm">or</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            {/* Calendar CTA */}
            <a
              href={calLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50/40 transition-all duration-150 text-sm"
            >
              <IconCalendar />
              Book a 30-min kickoff call
            </a>

            <p className="text-center text-xs text-slate-400 mt-4">
              Your full scope and quote is saved. Reply any time.
            </p>
          </div>

          {/* Back */}
          <div className="text-center">
            <button
              onClick={onBack}
              className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors"
            >
              ← Back to scope
            </button>
          </div>
        </div>
      </div>

    </div>
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
