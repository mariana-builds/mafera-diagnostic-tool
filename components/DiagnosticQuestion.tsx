"use client";

import { useState } from "react";
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
      onAnswer(question.id, selected[0], option?.score);
    }
    setSelected([]);
  };

  const hasSelection = selected.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex flex-col">
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

          {/* Options */}
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
                  ? "bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-200 hover:shadow-lg hover:-translate-y-0.5"
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
