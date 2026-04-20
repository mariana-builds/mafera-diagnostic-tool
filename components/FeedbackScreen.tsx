"use client";

import { useState } from "react";
import SiteHeader from "./SiteHeader";

interface Props {
  onReset: () => void;
}

const RATINGS = [0, 1, 2, 3, 4, 5] as const;

function IconHeart() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-7 h-7"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export default function FeedbackScreen({ onReset }: Props) {
  const [rating, setRating] = useState<number | null>(null);
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-5">
              <IconHeart />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-3">
              We appreciate your feedback!
            </h1>
            <p className="text-slate-500 text-base mb-10">
              We'll use it to do better.
            </p>
            <button
              onClick={onReset}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3.5 rounded-xl border border-orange-600/20 hover:-translate-y-0.5 transition-all duration-150"
            >
              Back to the beginning →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full animate-fade-in">

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Thanks for your response!
            </h1>
            <p className="text-slate-500">How was your experience?</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-5">

            {/* Rating row */}
            <div className="flex items-center justify-between gap-2 mb-2">
              {RATINGS.map((n) => (
                <button
                  key={n}
                  onClick={() => setRating(n)}
                  className={[
                    "flex-1 py-3 rounded-xl text-base font-semibold border-2 transition-all duration-150",
                    rating === n
                      ? "border-orange-500 bg-orange-500 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:text-orange-500",
                  ].join(" ")}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-slate-400 mb-1 px-0.5">
              <span>Very unsatisfying</span>
              <span>Very satisfying</span>
            </div>

            {/* Follow-up textarea — appears once a rating is picked */}
            {rating !== null && (
              <div className="mt-6 animate-slide-up">
                <label
                  htmlFor="feedback-reason"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Could you tell us why you chose {rating}?
                </label>
                <textarea
                  id="feedback-reason"
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Tell us more…"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-sm resize-none"
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={() => setSubmitted(true)}
            disabled={rating === null}
            className={[
              "w-full py-4 rounded-xl font-semibold text-base transition-all duration-150",
              rating !== null
                ? "bg-orange-500 hover:bg-orange-600 text-white border border-orange-600/20 hover:-translate-y-0.5"
                : "bg-slate-100 text-slate-400 cursor-not-allowed",
            ].join(" ")}
          >
            Submit feedback
          </button>
        </div>
      </div>
    </div>
  );
}
