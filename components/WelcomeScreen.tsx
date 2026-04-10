"use client";

import SiteHeader from "./SiteHeader";

interface Props {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
      <SiteHeader />

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full text-center animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight tracking-tight mb-5">
            Scope your{" "}
            <em className="not-italic text-orange-500">new sales setup</em>
            {" "}in 5 minutes.
          </h1>

          <p className="text-lg text-slate-500 leading-relaxed mb-10 max-w-xl mx-auto">
            Answer a few quick questions to get a detailed scope, timeline, and
            ballpark quote.
          </p>

          <button
            onClick={onStart}
            className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold text-lg px-10 py-4 rounded-xl shadow-lg shadow-orange-200 transition-all duration-150 hover:shadow-xl hover:shadow-orange-200 hover:-translate-y-0.5"
          >
            Start the diagnostic →
          </button>

          <p className="mt-5 text-slate-400 text-sm">
            No account or pre-payment needed.
          </p>
        </div>
      </div>
    </div>
  );
}
