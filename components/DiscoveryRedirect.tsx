"use client";

import SiteHeader from "./SiteHeader";

interface Props {
  onBack: () => void;
}

function IconChat() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-8 h-8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
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

export default function DiscoveryRedirect({ onBack }: Props) {
  const calLink =
    process.env.NEXT_PUBLIC_CALENDAR_15MIN ??
    "https://calendly.com/mariana-mafera/15min";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex flex-col">
      <SiteHeader />

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full text-center animate-fade-in">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 text-orange-600 mb-6">
            <IconChat />
          </div>

          {/* Headline */}
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Let's find the right approach together.
          </h1>
          <p className="text-slate-500 text-base mb-10">
            Book a 15-min call to map your situation before diving into the
            full diagnostic.
          </p>

          {/* Why a call */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8 text-left">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
              Why a call first
            </p>
            <div className="space-y-3">
              {[
                "Make sure this is the right project for you",
                "Spot any hidden complexity early",
                "Avoid surprises down the line",
              ].map((reason, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-slate-700 text-sm">{reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <a
            href={calLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base shadow-md shadow-orange-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150 mb-4"
          >
            <IconCalendar />
            Book your 15-min call
          </a>

          <p className="text-slate-400 text-sm">
            Questions?{" "}
            <a
              href="mailto:mariana@mafera.de"
              className="text-orange-600 hover:underline"
            >
              mariana@mafera.de
            </a>
          </p>
        </div>
      </div>

    </div>
  );
}
