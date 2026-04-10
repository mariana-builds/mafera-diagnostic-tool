"use client";

interface Props {
  current: number; // 1-based
  total: number;
  onReset?: () => void;
}

function IconReturn() {
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
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 .49-4" />
    </svg>
  );
}

export default function ProgressBar({ current, total, onReset }: Props) {
  const pct = Math.round((current / total) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pt-6 pb-2">
      <div className="flex items-center justify-end gap-2 mb-2">
        <span className="text-xs text-slate-400 tabular-nums">
          {current} / {total}
        </span>
        {onReset && (
          <button
            onClick={onReset}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Start over"
          >
            <IconReturn />
          </button>
        )}
      </div>
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
