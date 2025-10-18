"use client";

import React, { useEffect, useRef } from "react";
import { Shield, Lock } from "lucide-react";
import PremiumFooter from "@/components/PremiumFooter";
import TrustMonitor from "@/components/safety/TrustMonitor";

/* --------------------------- Particle Glow BG --------------------------- */
export default function SafetyPage() {
  const particlesRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);
  const dotsRef = useRef<
    { x: number; y: number; r: number; a: number; s: number; o: number; t: number }[]
  >([]);

  useEffect(() => {
    const canvas = particlesRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    let w = 0,
      h = 0;
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    const init = (count = 46) => {
      dotsRef.current = Array.from({ length: count }, () => {
        const r = Math.random() * 1.4 + 0.6;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r,
          a: Math.random() * Math.PI * 2,
          s: (Math.random() * 0.18 + 0.06) * dpr,
          o: Math.random() * 0.85,
          t: Math.random() * 2000,
        };
      });
    };

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      w = Math.floor(rect.width * dpr);
      h = Math.floor(rect.height * dpr);
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      init();
    };

    const draw = (ts: number) => {
      ctx!.clearRect(0, 0, w, h);
      ctx!.globalCompositeOperation = "lighter";

      for (const p of dotsRef.current) {
        p.x += Math.cos(p.a) * p.s * 0.28;
        p.y += Math.sin(p.a) * p.s * 0.28;
        p.a += (Math.sin((ts + p.t) * 0.00024) - 0.5) * 0.016;

        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        const pulse = (Math.sin((ts + p.t) * 0.0021) + 1) / 2;
        const alpha = 0.06 + pulse * 0.26 * p.o;

        const grd = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 9);
        grd.addColorStop(0, `rgba(168,85,247, ${alpha})`);
        grd.addColorStop(1, "rgba(0,0,0,0)");
        ctx!.fillStyle = grd;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r * 9, 0, Math.PI * 2);
        ctx!.fill();

        ctx!.fillStyle = `rgba(220,200,255, ${Math.min(0.5, alpha + 0.06)})`;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden font-['Inter'] text-white bg-black">
      <style>{`
        .ring-wrap { position: relative; width: 240px; height: 240px; border-radius: 50%; display: grid; place-items: center; }
        .ring { position: absolute; border-radius: 9999px; border: 1px solid rgba(168,85,247,0.35); }
        .ring.r1 { width: 240px; height: 240px; box-shadow: 0 0 24px rgba(168,85,247,0.35) inset, 0 0 30px rgba(59,130,246,0.25); animation: ringPulse 5s ease-in-out infinite; }
        .ring.r2 { width: 200px; height: 200px; border-color: rgba(59,130,246,0.35); animation: ringPulse 5.6s ease-in-out infinite; }
        .ring.r3 { width: 160px; height: 160px; border-color: rgba(147,51,234,0.35); animation: ringPulse 6.2s ease-in-out infinite; }
        .ring.r4 { width: 120px; height: 120px; border-color: rgba(168,85,247,0.5); animation: ringPulse 6.8s ease-in-out infinite; }
        @keyframes ringPulse { 0%,100% { transform: scale(1); opacity: .9; } 50% { transform: scale(1.04); opacity: 1; } }
        .shield-core { width: 84px; height: 84px; border-radius: 9999px; display: grid; place-items: center; background: radial-gradient(closest-side, rgba(124,58,237,0.24), rgba(0,0,0,0) 70%); border: 1px solid rgba(255,255,255,0.12); box-shadow: 0 0 20px rgba(124,58,237,0.45), 0 0 14px rgba(46,144,255,0.18); }
        .wave-bar { width: 6px; border-radius: 3px; background: linear-gradient(180deg, rgba(168,85,247,0.65), rgba(59,130,246,0.65)); box-shadow: 0 0 10px rgba(168,85,247,0.35); animation: wave 1.4s ease-in-out infinite; }
        @keyframes wave { 0%, 100% { height: 10px; opacity: .6; } 50% { height: 44px; opacity: 1; } }
        .progress-ring { position: relative; width: 120px; height: 120px; border-radius: 9999px; border: 2px dashed rgba(168,85,247,0.35); animation: spin 10s linear infinite; box-shadow: 0 0 16px rgba(59,130,246,0.2) inset; }
        @keyframes spin { 0% { transform: rotate(0); } 100% { transform: rotate(360deg); } }
      `}</style>

      {/* Soft glow background */}
      <canvas
        ref={particlesRef}
        className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
        aria-hidden="true"
      />

      <main className="relative z-10 space-y-24 md:space-y-32">
        {/* 🛡️ Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-24 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Built for Real Conversations.<br />
              Protected by Real Technology.
            </h1>
            <p className="mt-4 text-white/80">
              Safety isn’t an add-on at CallSubs—it’s the foundation. Every call,
              every feature, and every interaction is designed to keep you
              protected while you stay in control.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="ring-wrap">
              <div className="ring r1"></div>
              <div className="ring r2"></div>
              <div className="ring r3"></div>
              <div className="ring r4"></div>
              <div className="shield-core">
                <Shield className="w-10 h-10 text-purple-400" />
              </div>
            </div>
          </div>
        </section>

        {/* ✅ Verification Mockup */}
        <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold">Verified Identities</h2>
            <p className="mt-4 text-white/80">
              Phone verification ties one identity to one number. We track linked
              accounts and propagate bans across identities to protect you from
              repeat offenders.
            </p>
          </div>
          <div className="relative rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <KV label="Viewer Phone" value="+1 •••• 89" />
            <KV label="OTP Code" value="123456" />
            <KV label="Verified" value="Success" valueClass="text-emerald-400" />
          </div>
        </section>

        {/* 🗣️ Live Transcription */}
        <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="relative rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="flex items-center gap-2 text-sm text-white/85">
              <Lock className="w-4 h-4 text-purple-300" />
              <span>Live Transcription</span>
            </div>
            <Waveform />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold">AI That Listens</h2>
            <p className="mt-4 text-white/80">
              Real-time transcription analyzes conversations as they happen—detecting
              harassment and risky behavior.
            </p>
          </div>
        </section>

        {/* 🧰 Streamer Tools / Trust Monitor */}
        <TrustMonitor />

        {/* 🔒 Private by Default */}
        <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="flex items-center gap-2 text-sm text-white/85 mb-3">
              <Lock className="w-4 h-4 text-purple-300" />
              <span className="font-semibold">Private by Default</span>
            </div>
            <ul className="text-sm text-white/80 space-y-2">
              <li>• Encrypted data with strict access controls</li>
              <li>• GDPR-aligned user protections</li>
              <li>• Masked phone digits by default</li>
              <li>• Transparent unban history</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold">
              Protected Connections. Private by Default.
            </h2>
          </div>
        </section>

        {/* 🚀 Always Evolving */}
        <section className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold">Always Evolving. Always Safer.</h2>
          <p className="mt-4 text-white/80 max-w-2xl mx-auto">
            We’re building the future of live safety with smart prevention and
            stronger signals.
          </p>
          <ul className="mt-6 text-white/80 space-y-2 text-sm">
            <li>• Behavioral Pattern Detection</li>
            <li>• Enhanced Trust Ratings</li>
            <li>• Shared Ban Lists between creators</li>
          </ul>
        </section>

        {/* ✨ CTA */}
        <section className="max-w-7xl mx-auto px-6 text-center pb-24">
          <h2 className="text-4xl font-extrabold">Your Stream. Your Rules. Our Protection.</h2>
          <p className="mt-3 text-white/80">Join the safest way to connect live.</p>
          <button className="mt-6 inline-flex items-center rounded-xl px-6 py-3 font-semibold bg-white text-black hover:bg-white/90 transition">
            Get Started
          </button>
        </section>
      </main>

      {/* Footer */}
      <PremiumFooter />
    </div>
  );
}

/* --------------------------- UI helpers --------------------------- */

function KV({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 rounded-xl bg-white/5 border border-white/10 px-4 py-3 mb-3">
      <span className="text-sm text-white/60">{label}</span>
      <span className={`text-sm text-right ${valueClass}`}>{value}</span>
    </div>
  );
}

function Waveform() {
  const bars = Array.from({ length: 36 }, (_, i) => (i % 5) * 8 + 18);
  return (
    <div className="mt-4 h-24 rounded-lg bg-gradient-to-r from-purple-500/20 to-indigo-500/20 p-2 flex items-end gap-1 border border-white/10">
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-1.5 rounded-full bg-purple-400/80"
          style={{ height: `${h}px` }}
        />
      ))}
    </div>
  );
}
