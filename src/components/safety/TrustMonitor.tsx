import React from "react";

export default function TrustMonitor() {
  return (
    <div
      className="
        relative
        w-full
        max-w-[1600px]   /* 🔥 Increased width to fit 4 cards properly */
        mx-auto
        rounded-2xl
        border border-white/10
        bg-white/5
        backdrop-blur-xl
        overflow-visible
        px-12 py-12      /* 🔥 more padding on the sides */
        md:px-14 md:py-14
      "
    >
      <style>{`
        .tm-card {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow: 0 10px 30px rgba(2,6,23,0.45), 0 0 26px rgba(124,58,237,0.10);
          transition: transform .35s ease, box-shadow .35s ease, border-color .35s ease;
        }
        .tm-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 38px rgba(2,6,23,0.55), 0 0 32px rgba(124,58,237,0.18);
          border-color: rgba(255,255,255,0.16);
        }
        .tm-bar {
          position: relative;
          height: 8px;
          border-radius: 9999px;
          overflow: hidden;
          background: rgba(255,255,255,0.15);
        }
        .tm-bar > span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, rgba(34,197,94,1), rgba(125,211,252,0.9));
          box-shadow: 0 0 18px rgba(34,197,94,0.45);
        }
        .tm-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 2px 8px;
          border-radius: 9999px;
          font-size: 10px;
          font-weight: 700;
          line-height: 1;
          letter-spacing: .02em;
          border: 1px solid rgba(255,255,255,0.22);
          background: rgba(255,255,255,0.08);
        }
        .tm-badge--blue {
          color: #bae6fd;
          background: rgba(56,189,248,0.18);
          border-color: rgba(56,189,248,0.35);
        }
      `}</style>

      {/* Header */}
      <div className="relative z-10 mb-6 md:mb-7 text-center">
        <h4 className="text-base md:text-lg font-semibold tracking-wide text-white/90">
          A Smarter Safety Network.
        </h4>
      </div>

      {/* Cards container */}
      <div
        className="
          relative z-10
          grid
          grid-flow-col
          auto-cols-[minmax(280px,1fr)]
          lg:[grid-template-columns:repeat(4,minmax(280px,1fr))]
          gap-6
          overflow-x-auto
          sm:overflow-visible
          snap-x sm:snap-none
          px-2
        "
      >
        {/* Trusted */}
        <div className="tm-card rounded-2xl p-5 snap-start">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400" />
            <div>
              <div className="text-sm text-white/70">Trust Score</div>
              <div className="flex items-center gap-2 text-white font-semibold">
                <span className="text-emerald-300 text-lg">87</span>
                <span className="text-emerald-300">– Trusted</span>
              </div>
            </div>
          </div>
          <div className="tm-bar mt-3">
            <span style={{ width: "87%" }} />
          </div>
          <div className="mt-2 text-xs text-white/70">Verified via SMS</div>
        </div>

        {/* Neutral */}
        <div className="tm-card rounded-2xl p-5 snap-start">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-300 to-yellow-500" />
            <div>
              <div className="text-sm text-white/70">Trust Score</div>
              <div className="flex items-center gap-2 text-white font-semibold">
                <span className="text-amber-300 text-lg">62</span>
                <span className="text-amber-300">– Neutral</span>
              </div>
            </div>
          </div>
          <div className="tm-bar mt-3">
            <span
              style={{
                width: "62%",
                background:
                  "linear-gradient(90deg, #f59e0b, rgba(147,197,253,0.9))",
                boxShadow: "0 0 18px rgba(245,158,11,0.45)",
              }}
            />
          </div>
          <div className="mt-2 text-xs text-white/70">Returning Caller</div>
        </div>

        {/* Risk Flagged */}
        <div className="tm-card rounded-2xl p-5 snap-start">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-400 to-rose-500" />
            <div>
              <div className="text-sm text-white/70">Trust Score</div>
              <div className="flex items-center gap-2 text-white font-semibold">
                <span className="text-red-300 text-lg">29</span>
                <span className="text-red-300">– Risk Flagged</span>
              </div>
            </div>
          </div>
          <div className="tm-bar mt-3">
            <span
              style={{
                width: "29%",
                background:
                  "linear-gradient(90deg, #ef4444, rgba(244,114,182,0.9))",
                boxShadow: "0 0 18px rgba(239,68,68,0.45)",
              }}
            />
          </div>
          <div className="mt-2 text-xs text-white/70">
            Manual review suggested
          </div>
        </div>

        {/* NEW – First Time */}
        <div className="tm-card rounded-2xl p-5 snap-start">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-sky-400 to-indigo-400" />
            <div>
              <div className="text-sm text-white/70">Trust Status</div>
              <div className="flex items-center gap-2 text-white font-semibold">
                <span className="tm-badge tm-badge--blue">NEW</span>
                <span className="text-sky-300">– First Time</span>
              </div>
            </div>
          </div>
          <div className="tm-bar mt-3">
            <span
              style={{
                width: "10%",
                background:
                  "linear-gradient(90deg, #38bdf8, rgba(168,85,247,0.9))",
                boxShadow: "0 0 18px rgba(56,189,248,0.45)",
              }}
            />
          </div>
          <div className="mt-2 text-xs text-white/70">Verified via SMS</div>
        </div>
      </div>
    </div>
  );
}
