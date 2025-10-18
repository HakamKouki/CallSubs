import React from "react";

export default function TrustMonitor() {
  return (
    <div className="relative w-full max-w-7xl mx-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-visible px-8 py-8 md:px-10 md:py-10">
      <style>{`
        .tm-gradient-bg {
          background: radial-gradient(900px 420px at 50% -140px, rgba(109,40,217,0.25), rgba(109,40,217,0) 60%),
                      radial-gradient(720px 320px at 55% 110%, rgba(147,51,234,0.18), rgba(147,51,234,0) 65%),
                      linear-gradient(145deg, rgba(109,40,217,0.22), rgba(147,51,234,0.18));
        }
        .tm-grid::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: 0.12;
          background-image:
            linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px);
          background-size: 34px 34px, 34px 34px;
          background-position: -1px -1px, -1px -1px;
          pointer-events: none;
        }
        .tm-particle {
          position: absolute;
          border-radius: 9999px;
          filter: blur(12px);
          opacity: 0.35;
          animation: floaty 8s ease-in-out infinite;
        }
        .tm-particle.p1 { width: 110px; height: 110px; top: -30px; left: 12%; background: rgba(59,130,246,0.35); animation-delay: .2s; }
        .tm-particle.p2 { width: 90px; height: 90px; bottom: -20px; right: 10%; background: rgba(236,72,153,0.35); animation-delay: .6s; }
        .tm-particle.p3 { width: 70px; height: 70px; top: 40%; left: -20px; background: rgba(124,58,237,0.35); animation-delay: .9s; }
        @keyframes floaty {
          0%, 100% { transform: translateY(0) translateX(0); opacity: .35; }
          50% { transform: translateY(-8px) translateX(6px); opacity: .55; }
        }
        .tm-header {
          text-shadow: 0 0 16px rgba(124,58,237,0.45), 0 0 24px rgba(59,130,246,0.25);
        }
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
        .tm-avatar-ring {
          position: relative;
        }
        .tm-avatar-ring::before {
          content: "";
          position: absolute;
          inset: -3px;
          border-radius: 9999px;
          background: conic-gradient(from 0deg, #06B6D4, #9333EA, #EC4899, #06B6D4);
          filter: blur(4px);
          opacity: .65;
          animation: spin 8s linear infinite;
        }
        @keyframes spin { 0% { transform: rotate(0); } 100% { transform: rotate(360deg); } }
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
          animation: barPulse 2.6s ease-in-out infinite;
        }
        @keyframes barPulse {
          0%, 100% { filter: hue-rotate(0deg) brightness(1); }
          50% { filter: hue-rotate(15deg) brightness(1.2); }
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
        .tm-badge--blue { color: #bae6fd; background: rgba(56,189,248,0.18); border-color: rgba(56,189,248,0.35); }
      `}</style>

      {/* Background */}
      <div className="absolute inset-0 tm-gradient-bg" aria-hidden="true" />
      <div className="tm-particle p1" />
      <div className="tm-particle p2" />
      <div className="tm-particle p3" />

      {/* Header */}
      <div className="relative z-10 mb-6 md:mb-7">
        <h4 className="tm-header text-base md:text-lg font-semibold tracking-wide text-white/90">
          A Smarter Safety Network.
        </h4>
      </div>

      {/* Cards container — wider frame, cards unchanged */}
      <div
        className="
          relative z-10
          grid grid-flow-col auto-cols-[minmax(280px,1fr)]
          sm:grid-flow-row sm:auto-cols-auto
          sm:[grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]
          lg:[grid-template-columns:repeat(4,minmax(280px,1fr))]
          gap-6
          overflow-x-auto sm:overflow-visible
          snap-x sm:snap-none
          -mx-2 px-6 pb-4
        "
      >
        {/* Trusted */}
        <div className="tm-card rounded-2xl p-5 snap-start">
          <div className="flex items-center gap-3.5">
            <div className="tm-avatar-ring rounded-full p-[3px]">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400" />
            </div>
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
            <div className="tm-avatar-ring rounded-full p-[3px]">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-300 to-yellow-500" />
            </div>
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
            <div className="tm-avatar-ring rounded-full p-[3px]">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-400 to-rose-500" />
            </div>
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
            <div className="tm-avatar-ring rounded-full p-[3px]">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-sky-400 to-indigo-400" />
            </div>
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
