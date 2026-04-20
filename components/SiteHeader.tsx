"use client";

export default function SiteHeader() {
  return (
    <div className="flex items-center gap-2 px-6 py-4">
      <span className="text-sm text-slate-400">powered by</span>
      <a
        href="https://mafera.de"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center hover:opacity-80 transition-opacity"
        aria-label="mafera"
      >
        <svg
          width="88"
          height="22"
          viewBox="0 0 88 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <text
            x="0"
            y="17"
            fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
            fontSize="18"
            fontWeight="700"
            letterSpacing="-0.3"
          >
            <tspan fill="#0f172a">mafera</tspan><tspan fill="#FF6B35">.</tspan>
          </text>
        </svg>
      </a>
    </div>
  );
}
