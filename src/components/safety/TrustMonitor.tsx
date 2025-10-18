import React from "react";

export default function TrustMonitor() {
  return (
    <div className="relative w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-visible px-5 py-6 md:px-7 md:py-8">
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
        .tm-connector {
          position: absolute;
          left: 6%;
          right: 6%;
          top: 96px;
          height: 2px;
          background: linear-gradient(90deg, rgba(59,130,246,0), rgba(59,130,246,0.5), rgba(236,72,153,0.5), rgba(59,130,246,0));
          filter: drop-shadow(0 0 8px rgba(59,130,246,0.35));
          opacity: .5;
          animation: shimmer 2.8s ease-in-out infinite;
        }
        @keyframes shimmer {
          0%, 100% { opacity: .35; transform: scaleX(0.98); }
          50% { opacity: .8; transform: scaleX(1); }
        }
        .tm-node {
          position: absolute;
          top: 95px;
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          box-shadow: 0 0 12px currentColor;
          animation: ping 2.8s ease-in-out infinite;
        }
        .tm-node.n1 { left: 16%; color: #22c55e; }
        .tm-node.n2 { left: 41%; color: #f59e0b; animation-delay: .2s; }
        .tm-node.n3 { left: 65%; color: #ef4444; animation-delay: .4s; }
        .tm-node.n4 { left: 86%; color: #38bdf8; animation-delay: .6s; }
        @keyframes ping {
          0%, 100% { transform: scale(1); opacity: .8; }
          50% { transform: scale(1.25); opacity: 1; }
        }
      `}</style>

      {/* Enhancements: shared layout grid, badges, aligned bars, subtle pulses */}
      <style>{`
        .tm-card {
          box-shadow: 0 12px 40px rgba(2,6,23,0.55), 0 0 32px rgba(124,58,237,0.18);
        }
        .tm-card-inner {
          display: grid;
          grid-template-rows: auto auto auto auto;
          row-gap: 10px;
          min-height: 160px;
        }
        .tm-title {
          font-size: 0.875rem;
          color: rgba(255,255,255,0.7);
        }
        .tm-value {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          min-height: 28px;
          color: #fff;
          font-weight: 600;
        }
        .tm-subtext {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.7);
          margin-top: 2px;
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
        .tm-badge--green { color: #bbf7d0; background: rgba(34,197,94,0.18); border-color: rgba(34,197,94,0.35); }
        .tm-badge--yellow { color: #fde68a; background: rgba(245,158,11,0.18); border-color: rgba(245,158,11,0.35); }
        .tm-badge--red { color: #fecaca; background: rgba(239,68,68,0.18); border-color: rgba(239,68,68,0.35); }
        .tm-badge--blue { color: #bae6fd; background: rgba(56,189,248,0.18); border-color: rgba(56,189,248,0.35); }
        .tm-trusted-pulse {
          animation: tmPulseSoft 3s ease-in-out infinite;
          text-shadow: 0 0 8px rgba(34,197,94,0.55);
        }
        @keyframes tmPulseSoft {
          0%,100% { filter: drop-shadow(0 0 0 rgba(34,197,94,0)); }
          50% { filter: drop-shadow(0 0 8px rgba(34,197,94,0.45)); }
        }
      `}</style>

      {/* Background gradients */}
      <div className="absolute inset-0 tm-gradient-bg" aria-hidden="true" />

      {/* soft particles */}
      <div className="tm-particle p1" />
      <div className="tm-particle p2" />
      <div className="tm-particle p3" />

      {/* Header */}
      <div className="relative z-10 mb-6 md:mb-7">
        <h4 className="tm-header text-base md:text-lg font-semibold tracking-wide text-white/90">
          A Smarter Safety Network.
        </h4>
      </div>

      {/* Cards container */}
      <div
         className="
            relative z-10
            grid grid-flow-col auto-cols-[minmax(340px,1fr)]
            sm:grid-flow-row sm:auto-cols-auto
            sm:[grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]
            lg:[grid-template-columns:repeat(4,minmax(340px,1fr))]
            gap-6
            overflow-x-auto sm:overflow-visible
            snap-x sm:snap-none
            -mx-2 px-6 pb-4
            pr-10
          "
        >

        {/* Trusted */}
        <div className="tm-card rounded-2xl p-5 snap-start">
          <div className="tm-card-inner">
            <div className="flex items-center gap-3.5">
              <div className="tm-avatar-ring rounded-full p-[3px]">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400" />
              </div>
              <div>
                <div className="tm-title">Trust Score</div>
                <div className="tm-value">
                  <span className="text-emerald-300 text-lg">87</span>
                  <span className="text-emerald-300 tm-trusted-pulse">– Trusted</span>
                  {/* Removed redundant green badge */}
                </div>
              </div>
            </div>
            <div className="tm-bar">
              <span style={{ width: "87%" }} />
            </div>
            <div className="tm-subtext">Verified via SMS</div>
          </div>
        </div>

        {/* Neutral */}
        <div className="tm-card rounded-2xl p-5 snap-start">
          <div className="tm-card-inner">
            <div className="flex items-center gap-3.5">
              <div className="tm-avatar-ring rounded-full p-[3px]">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-300 to-yellow-500" />
              </div>
              <div>
                <div className="tm-title">Trust Score</div>
                <div className="tm-value">
                  <span className="text-amber-300 text-lg">62</span>
                  <span className="text-amber-300">– Neutral</span>
                  {/* Removed redundant yellow badge */}
                </div>
              </div>
            </div>
            <div className="tm-bar">
              <span style={{ width: "62%", background: "linear-gradient(90deg, #f59e0b, rgba(147,197,253,0.9))", boxShadow: "0 0 18px rgba(245,158,11,0.45)" }} />
            </div>
            <div className="tm-subtext">Returning Caller</div>
          </div>
        </div>

        {/* Risk Flagged */}
        <div className="tm-card rounded-2xl p-5 snap-start">
          <div className="tm-card-inner">
            <div className="flex items-center gap-3.5">
              <div className="tm-avatar-ring rounded-full p-[3px]">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-400 to-rose-500" />
              </div>
              <div>
                <div className="tm-title">Trust Score</div>
                <div className="tm-value">
                  <span className="text-red-300 text-lg">29</span>
                  <span className="text-red-300">– Risk Flagged</span>
                  {/* Removed redundant red badge */}
                </div>
              </div>
            </div>
            <div className="tm-bar">
              <span style={{ width: "29%", background: "linear-gradient(90deg, #ef4444, rgba(244,114,182,0.9))", boxShadow: "0 0 18px rgba(239,68,68,0.45)" }} />
            </div>
            <div className="tm-subtext">Manual review suggested</div>
          </div>
        </div>

        {/* NEW – First Time (keep single NEW pill badge) */}
        <div className="tm-card rounded-2xl p-5 snap-start">
          <div className="tm-card-inner">
            <div className="flex items-center gap-3.5">
              <div className="tm-avatar-ring rounded-full p-[3px]">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-sky-400 to-indigo-400" />
              </div>
              <div>
                <div className="tm-title">Trust Status</div>
                <div className="tm-value">
                  <span className="tm-badge tm-badge--blue">NEW</span>
                  <span className="text-sky-300">– First Time</span>
                </div>
              </div>
            </div>
            <div className="tm-bar">
              <span style={{ width: "10%", background: "linear-gradient(90deg, #38bdf8, rgba(168,85,247,0.9))", boxShadow: "0 0 18px rgba(56,189,248,0.45)" }} />
            </div>
            <div className="tm-subtext">Verified via SMS</div>
          </div>
        </div>
      </div>
    </div>
  );
}
