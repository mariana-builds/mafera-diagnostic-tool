"use client";

export default function SiteHeader() {
  return (
    <div className="flex items-center gap-1.5 px-6 py-4">
      <span className="text-sm text-slate-400">powered by</span>
      <a
        href="https://mafera.de"
        target="_blank"
        rel="noopener noreferrer"
        className="font-bold text-slate-900 text-base tracking-tight hover:text-slate-600 transition-colors"
      >
        mafera
      </a>
    </div>
  );
}
