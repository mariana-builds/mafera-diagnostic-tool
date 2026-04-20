"use client";

import { useState, useEffect, useCallback } from "react";
import type { Question } from "@/lib/questions";
import ProgressBar from "./ProgressBar";
import SiteHeader from "./SiteHeader";

interface Props {
  question: Question;
  currentStep: number;
  totalSteps: number;
  onAnswer: (qId: number, choice: string, score?: number) => void;
  onBack?: () => void;
  onReset: () => void;
}

export default function DiagnosticQuestion({
  question,
  currentStep,
  totalSteps,
  onAnswer,
  onBack,
  onReset,
}: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  const handleSelect = (optionId: string) => {
    if (question.multiSelect) {
      setSelected((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelected([optionId]);
    }
  };

  const handleNext = () => {
    if (selected.length === 0) return;
    if (question.multiSelect) {
      const selectedOptions = question.options.filter((o) =>
        selected.includes(o.id)
      );
      const maxScore = Math.max(...selectedOptions.map((o) => o.score ?? 0));
      onAnswer(question.id, selected.join(","), maxScore);
    } else {
      const option = question.options.find((o) => o.id === selected[0]);
      // For select/dropdown questions store the human-readable label, not the ID
      const answerValue =
        question.type === "select" ? (option?.text ?? selected[0]) : selected[0];
      onAnswer(question.id, answerValue, option?.score);
    }
    setSelected([]);
  };

  const hasSelection = selected.length > 0;

  // Wrap handleNext in useCallback so the keyboard effect can safely depend on it
  const stableHandleNext = useCallback(handleNext, [selected, question, onAnswer]);

  // ↑ / ↓ cycle through options; Enter submits; Backspace goes back
  useEffect(() => {
    // Only apply to button-style questions — selects handle keyboard natively
    if (question.type === "select") return;

    const onKeyDown = (e: KeyboardEvent) => {
      // Don't interfere when the user is typing in an input/textarea
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      const opts = question.options;

      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        if (question.multiSelect) return; // multi-select: skip auto-move
        const currentIdx =
          selected.length > 0
            ? opts.findIndex((o) => o.id === selected[0])
            : -1;
        const nextIdx =
          e.key === "ArrowDown"
            ? (currentIdx + 1) % opts.length
            : (currentIdx - 1 + opts.length) % opts.length;
        setSelected([opts[nextIdx].id]);
      }

      if (e.key === "Enter" && hasSelection) {
        e.preventDefault();
        stableHandleNext();
      }

      if (e.key === "Backspace" && onBack) {
        e.preventDefault();
        onBack();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [question, selected, hasSelection, onBack, stableHandleNext]);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <ProgressBar current={currentStep} total={totalSteps} onReset={onReset} />

      <div className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-2xl animate-slide-up">
          {/* Question */}
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug mb-2">
            {question.text}
          </h2>
          {question.multiSelect && (
            <p className="text-sm text-slate-400 mb-6">Select all that apply.</p>
          )}
          {!question.multiSelect && <div className="mb-8" />}

          {/* Options — dropdown for select questions, buttons for all others */}
          {question.type === "select" ? (
            <div className="mb-8">
              <select
                value={selected[0] ?? ""}
                onChange={(e) =>
                  setSelected(e.target.value ? [e.target.value] : [])
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-base appearance-none cursor-pointer"
              >
                <option value="" disabled>
                  Select a CRM…
                </option>
                {question.options.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.text}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="space-y-3 mb-8">
              {question.options.map((option) => {
                const isSelected = selected.includes(option.id);
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelect(option.id)}
                    className={[
                      "w-full text-left p-5 rounded-xl border-2 transition-all duration-150 group",
                      "flex items-start gap-4",
                      isSelected
                        ? "border-orange-500 bg-orange-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-orange-300 hover:bg-orange-50/40 hover:shadow-sm",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "flex-shrink-0 w-7 h-7 flex items-center justify-center text-sm font-semibold mt-0.5 transition-colors",
                        question.multiSelect ? "rounded-md border-2" : "rounded-full border-2",
                        isSelected
                          ? "border-orange-500 bg-orange-500 text-white"
                          : "border-slate-300 text-slate-400 group-hover:border-orange-400 group-hover:text-orange-600",
                      ].join(" ")}
                    >
                      {option.id}
                    </span>
                    <span
                      className={[
                        "text-base leading-relaxed transition-colors",
                        isSelected ? "text-orange-900 font-medium" : "text-slate-700",
                      ].join(" ")}
                    >
                      {option.text}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Keyboard hint — only shown on non-touch devices */}
          {question.type !== "select" && (
            <p className="text-xs text-slate-400 mb-5 hidden sm:block">
              ↑ ↓ to navigate &nbsp;·&nbsp; Enter to confirm
            </p>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            {onBack ? (
              <button
                onClick={onBack}
                className="text-slate-400 hover:text-slate-600 text-sm font-medium flex items-center gap-1.5 transition-colors"
              >
                ← Back
              </button>
            ) : (
              <div />
            )}
            <button
              onClick={handleNext}
              disabled={!hasSelection}
              className={[
                "px-8 py-3 rounded-xl font-semibold text-base transition-all duration-150",
                hasSelection
                  ? "bg-orange-500 hover:bg-orange-600 text-white border border-orange-600/20 hover:-translate-y-0.5"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed",
              ].join(" ")}
            >
              {currentStep === totalSteps ? "See my scope →" : "Next →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
