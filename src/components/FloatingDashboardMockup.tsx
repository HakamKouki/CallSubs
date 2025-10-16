"use client";

import React, { useEffect, useRef, useState } from "react";
import { Power, Phone, Users, DollarSign, Shield, Keyboard, Crown } from "lucide-react";

export default function FloatingDashboardMockup() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef(0);
  const target = useRef({ rx: 0, ry: 0 });

  const [earnings, setEarnings] = useState(0);
  const [selectedTier, setSelectedTier] = useState<string>("Tier 1");

  useEffect(() => {
    // Animated counter
    const targetValue = 3982.5;
    const startValue = 3420;
    const duration = 1200;
    let raf = 0;
    const start = performance.now();
    const easeInOut = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const v = startValue + (targetValue - startValue) * easeInOut(p);
      setEarnings(v);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const card = cardRef.current;
    if (!wrap || !card) return;

    const handleMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      target.current.ry = (x - 0.5) * 10;
      target.current.rx = (0.5 - y) * 8;
    };

    const handleLeave = () => {
      target.current.rx = 0;
      target.current.ry = 0;
    };

    wrap.addEventListener("mousemove", handleMove);
    wrap.addEventListener("mouseleave", handleLeave);

    const animate = () => {
      const rx = parseFloat(card.style.getPropertyValue("--rx") || "0");
      const ry = parseFloat(card.style.getPropertyValue("--ry") || "0");
      const nx = rx + (target.current.rx - rx) * 0.08;
      const ny = ry + (target.current.ry - ry) * 0.08;
      card.style.setProperty("--rx", nx.toFixed(3));
      card.style.setProperty("--ry", ny.toFixed(3));
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      wrap.removeEventListener("mousemove", handleMove);
      wrap.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  const formattedEarnings = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(earnings);

  const tiers = ["Tier 1", "Tier 2", "Tier 3", "Prime"];

  return (
    <div
      ref={wrapRef}
      className="relative w-full min-h-[520px] sm:min-h-[600px] md:min-h-[680px] lg:min-h-[740px]"
    >
      <style>{`
        @keyframes fdmFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes fdmPulse {
          0%, 100% { opacity: 0.65; }
          50% { opacity: 1; }
        }
        @keyframes fdmPulseCard {
          0%, 100% { box-shadow: 0 0 0 rgba(0,0,0,0), inset 0 0 0 1px rgba(59,130,246,0.15); }
          50% { box-shadow: 0 0 26px rgba(59,130,246,0.28); }
        }
        @keyframes fd-shimmer {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }
        .fdm-glow {
          box-shadow:
            0 14px 54px rgba(0,0,0,0.45),
            0 0 36px rgba(167,139,250,0.24),
            0 0 68px rgba(59,130,246,0.18);
        }
        .fdm-border { border: 1px solid rgba(255,255,255,0.12); }
        .fdm-ring { box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08), 0 0 0 1px rgba(255,255,255,0.06); }
        .tier-button {
          @apply flex-1 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200 text-white border border-white/15 bg-white/5;
        }
        .tier-button-active {
          @apply bg-gradient-to-r from-fuchsia-600 to-purple-500 shadow-[0_0_16px_rgba(168,85,247,0.4)] border-transparent;
        }
      `}</style>

      {/* Neon gradient glow behind panel */}
      <div
        aria-hidden="true"
        className="absolute -inset-4 rounded-[28px] bg-gradient-to-r from-fuchsia-600/25 via-purple-500/25 to-cyan-400/25 blur-3xl opacity-70"
      />

      <div
        ref={cardRef}
        style={{
          transformStyle: "preserve-3d",
          transform:
            "perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
        }}
        className="relative mx-auto w-full max-w-lg h-full min-h-[520px] rounded-[22px] bg-white/6 backdrop-blur-xl fdm-border fdm-glow animate-[fdmFloat_8s_ease-in-out_infinite]"
      >
        {/* Title bar */}
        <div className="h-10 flex items-center gap-2 px-3 border-b border-white/10 bg-black/25 rounded-t-[22px]">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/90" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300/90" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
          <span className="ml-2 text-xs text-white/80">CallSubs · Control Center</span>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 md:p-7 flex flex-col gap-4 sm:gap-5 md:gap-6 h-[calc(100%-2.5rem)]">

          {/* Live Status Toggle */}
          <div className="relative rounded-xl bg-white/6 fdm-border fdm-ring px-5 py-4 overflow-hidden">
            <div
              className="absolute -inset-1 opacity-30 pointer-events-none"
              style={{
                background:
                  "radial-gradient(140px 100px at 85% 50%, rgba(167,139,250,0.35), rgba(0,0,0,0))",
              }}
            />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-white/8 border border-white/12 grid place-items-center">
                  <Power className="h-5 w-5 text-purple-300" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Accepting Calls</div>
                  <div className="text-xs text-white/70">Live Status</div>
                </div>
              </div>
              <div className="relative h-9 w-18 min-w-[64px] rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 p-1 shadow-[0_0_20px_rgba(168,85,247,0.55)] ring-1 ring-white/20">
                <div className="absolute inset-0 rounded-full" />
                <div className="relative h-7 w-7 translate-x-7 rounded-full bg-white shadow-xl">
                  <span className="absolute inset-0 rounded-full bg-fuchsia-500/30 blur-[6px] animate-ping" />
                </div>
                <span className="absolute -top-3 right-0 text-[10px] text-purple-200/90 animate-[fdmPulse_2.2s_ease-in-out_infinite]">
                  ON
                </span>
              </div>
            </div>
          </div>

          {/* 🆕 Sub Tier Selector */}
          <div className="relative rounded-xl bg-white/6 fdm-border fdm-ring px-5 py-4 overflow-hidden">
            <div
              className="absolute -inset-1 opacity-30 pointer-events-none"
              style={{
                background:
                  "radial-gradient(140px 100px at 50% 50%, rgba(168,85,247,0.35), rgba(0,0,0,0))",
              }}
            />
            <div className="relative flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-fuchsia-400" />
                <div className="text-sm font-semibold text-white">Allowed Tiers</div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {tiers.map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={`tier-button ${
                      selectedTier === tier ? "tier-button-active" : ""
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Call Queue */}
          <div className="relative rounded-xl bg-white/6 fdm-border fdm-ring px-5 py-4 overflow-hidden animate-[fdmPulseCard_3.6s_ease-in-out_infinite]">
            <div
              className="absolute -inset-1 opacity-25 pointer-events-none"
              style={{
                background:
                  "radial-gradient(160px 110px at 20% 30%, rgba(96,165,250,0.35), rgba(0,0,0,0))",
              }}
            />
            <div className="relative flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-white/10 border border-white/12 grid place-items-center">
                <Users className="h-5 w-5 text-cyan-300" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Call Queue</div>
                <div className="text-white/85 text-sm">Viewer123 in queue — 2 waiting.</div>
              </div>
            </div>
          </div>

          {/* Earnings */}
          <div className="relative rounded-xl bg-white/6 fdm-border fdm-ring px-5 py-4 overflow-hidden">
            <div
              className="absolute -inset-1 opacity-25 pointer-events-none"
              style={{
                background:
                  "radial-gradient(180px 120px at 85% 25%, rgba(34,197,94,0.38), rgba(0,0,0,0))",
              }}
            />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-white/10 border border-white/12 grid place-items-center">
                  <DollarSign className="h-5 w-5 text-emerald-300" />
                </div>
                <span className="text-sm font-semibold text-white">Total Earned</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300">
                ${formattedEarnings}
              </span>
            </div>
          </div>

          {/* Safety Hotkey */}
          <div className="relative rounded-xl bg-white/6 fdm-border fdm-ring px-5 py-4 overflow-hidden">
            <div
              className="absolute -inset-1 opacity-25 pointer-events-none"
              style={{
                background:
                  "radial-gradient(160px 110px at 70% 70%, rgba(167,139,250,0.32), rgba(0,0,0,0))",
              }}
            />
            <div className="relative flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-white/10 border border-white/12 grid place-items-center">
                <Shield className="h-5 w-5 text-purple-300" />
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-white">Safety Hotkey:</span>
                <span className="text-white/85">Enabled</span>
                <span className="ml-2 inline-flex items-center gap-1 rounded-md px-2 py-0.5 border border-white/15 bg-white/10 text-white/85">
                  <Keyboard className="w-3.5 h-3.5" /> M
                </span>
              </div>
            </div>
          </div>

          {/* Shimmer accent */}
          <div className="relative h-1.5 overflow-hidden rounded-full bg-white/5 border border-white/10">
            <span
              className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{ animation: "fd-shimmer 3.8s linear infinite" }}
            />
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[22px]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.45) 70%)",
          }}
        />
      </div>
    </div>
  );
}
