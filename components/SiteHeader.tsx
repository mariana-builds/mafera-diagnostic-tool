"use client";

interface Props {
  onReset?: () => void;
}

export default function SiteHeader({ onReset }: Props) {
  return (
    <div className="flex items-center px-6 py-4">
      {onReset ? (
        <button
          onClick={onReset}
          className="font-bold text-slate-900 text-base tracking-tight hover:text-slate-600 transition-colors"
        >
          mafera
        </button>
      ) : (
        <span className="font-bold text-slate-900 text-base tracking-tight">mafera</span>
      )}
    </div>
  );
}
