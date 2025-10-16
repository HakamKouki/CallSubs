import React, { useEffect, useRef, useState } from "react";

// 1. Define the prop type for your component
interface IntroSplashProps {
  onCtaClick: () => void;
}

// 2. Define a type for your particles
interface Particle {
  x: number;
  y: number;
  r: number;
  a: number;
  s: number;
  o: number;
  t: number;
}

export default function IntroSplash({ onCtaClick }: IntroSplashProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const [connected, setConnected] = useState(false);

  // ✨ Particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // ✅ guard against null

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    const initParticles = () => {
      particlesRef.current = Array.from({ length: 90 }, () => {
        const r = Math.random() * 1.8 + 0.7;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r,
          a: Math.random() * Math.PI * 2,
          s: (Math.random() * 0.3 + 0.05) * dpr,
          o: Math.random(),
          t: Math.random() * 1000
        };
      });
    };

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      width = Math.floor(rect.width * dpr);
      height = Math.floor(rect.height * dpr);
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      initParticles();
    };

    const draw = (ts: number) => { // ✅ ts is now typed
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      for (const p of particlesRef.current) {
        p.x += Math.cos(p.a) * p.s * 0.4;
        p.y += Math.sin(p.a) * p.s * 0.4;
        p.a += (Math.sin((ts + p.t) * 0.0003) - 0.5) * 0.02;

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        const pulse = (Math.sin((ts + p.t) * 0.003) + 1) / 2;
        const alpha = 0.12 + pulse * 0.38 * p.o;

        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 8);
        grd.addColorStop(0, `rgba(176, 102, 255, ${alpha})`);
        grd.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(220, 180, 255, ${Math.min(0.75, alpha + 0.1)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);
    // 🔁 Incoming / Connected cycle
    useEffect(() => {
        let mounted = true;
        const runCycle = () => {
        if (!mounted) return;
        setConnected(false);
        const toConnected = setTimeout(() => mounted && setConnected(true), 3750);
        const nextCycle = setTimeout(() => mounted && runCycle(), 7500);
        return () => {
            clearTimeout(toConnected);
            clearTimeout(nextCycle);
        };
        };
        const cleanup = runCycle();
        return () => {
        mounted = false;
        cleanup && cleanup();
        };
    }, []);

    const handleSeeHowItWorks = () => {
        const el = document.getElementById('how-it-works');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <section className="cs-hero relative min-h-[100svh] overflow-hidden text-white">
        <style>{`
            .cs-hero .animated-gradient {
            position: absolute;
            inset: 0;
            background: linear-gradient(120deg, #000000, #120a1f, #2b0a3d, #4A0082, #7C3AED, #000000);
            background-size: 350% 350%;
            animation: cs-hero-gradient 18s ease-in-out infinite;
            filter: saturate(1.05);
            }
            @keyframes cs-hero-gradient {
            0% { background-position: 0% 50%; }
            33% { background-position: 50% 50%; }
            66% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
            }
            @keyframes cs-pulse-red { 0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.35);opacity:0.7;} }
            @keyframes cs-pulse-green { 0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.15);opacity:0.85;} }
            @keyframes cs-float-up { 0%{transform:translateY(8px);}50%{transform:translateY(-18px);}100%{transform:translateY(8px);} }
            @keyframes cs-float-slow { 0%{transform:translateY(0);}50%{transform:translateY(-12px);}100%{transform:translateY(0);} }
            @keyframes cs-progress { 0%{width:0%;}100%{width:100%;} }
            @keyframes cs-shimmer { 0%{transform:translateX(-100%);}100%{transform:translateX(100%);} }
        `}</style>

        {/* 🌌 Background */}
        <div className="animated-gradient"></div>
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-70" aria-hidden="true" />

        {/* ✨ Floating Queue Bubble */}
        <div
            aria-hidden="true"
            className="pointer-events-none absolute top-32 left-10 hidden md:block z-[1] opacity-35 animate-[cs-float-slow_22s_ease-in-out_infinite]">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm">
            Queue • 2 waiting
            </div>
        </div>

        {/* 🧠 Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 flex items-center min-h-screen py-14 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
            {/* 📝 Left side */}
            <div className="text-center lg:text-left">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                Your Stream. Their Backstage Pass.
                </h1>
                <p className="mt-5 text-base sm:text-lg md:text-xl text-white/85 max-w-2xl mx-auto lg:mx-0">
                CallSubs lets your subs join live calls — fully controlled and tier-gated. Grow loyalty, boost MRR, and stay in charge.
                </p>

                <div className="mt-9 flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start">
                <button
                    onClick={onCtaClick}
                    className="inline-flex items-center justify-center px-7 py-3.5 rounded-lg font-semibold shadow-lg transition-all duration-200
                            bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500
                            hover:shadow-[0_0_25px_rgba(168,85,247,0.45)]">
                    Join the Waitlist
                </button>
                <button
                    onClick={handleSeeHowItWorks}
                    className="inline-flex items-center justify-center px-7 py-3.5 rounded-lg font-semibold border border-white/25 text-white/90 hover:text-white hover:border-white/50 transition-all duration-200 bg-white/0">
                    How it Works
                </button>
                </div>

                {/* 🛡️ Trust badges */}
                <div className="mt-4 text-sm text-white/70 flex flex-col sm:flex-row gap-2 justify-center lg:justify-start">
                <span>✅ No credit card required</span>
                <span>🕓 14-day free trial</span>
                <span>✨ Built for Twitch & Kick</span>
                </div>
            </div>

            {/* 🎨 Right: UI card */}
            <div className="flex justify-center lg:justify-end">
                <div className="w-full max-w-md">
                <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-5 shadow-2xl">
                    <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span
                        className={`inline-flex h-2.5 w-2.5 rounded-full ${connected ? 'bg-purple-400 animate-[cs-pulse-green_1.8s_ease-in-out_infinite]' : 'bg-red-500 animate-[cs-pulse-red_1.6s_ease-in-out_infinite]'}`} />
                        <span className="text-sm font-medium">
                        {connected ? 'Paid call started ✓' : 'Incoming viewer call'}
                        </span>
                    </div>
                    {!connected &&
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 border border-white/20">
                        $5
                        </span>
                    }
                    </div>

                    <div className="mt-4 relative min-h-[138px]">
                    {/* Incoming state */}
                    <div className={`absolute inset-0 transition-all duration-500 ${connected ? 'opacity-0 translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
                        <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-white/20 border border-white/20 flex items-center justify-center font-bold text-white">
                            V
                        </div>
                        <div>
                            <div className="font-semibold text-white/90">Viewer123</div>
                            <div className="text-xs text-white/75">wants to join your stream</div>
                        </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                        <button className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white/90 hover:bg-white/15 transition">
                            Decline
                        </button>
                        <button className="w-full px-4 py-2.5 rounded-lg text-white font-semibold shadow-lg transition bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500">
                            Accept
                        </button>
                        </div>
                    </div>

                    {/* Connected state */}
                    <div className={`absolute inset-0 transition-all duration-500 ${connected ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                        <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 font-bold">
                            ✓
                        </div>
                        <div>
                            <div className="font-semibold text-purple-300">✓ Connected with Viewer123</div>
                            <div className="text-xs text-white/70 mt-1">Timer started — paid call in progress</div>
                        </div>
                        </div>
                        <div className="absolute left-0 right-0 bottom-0 h-1.5 bg-purple-400/15 rounded-b-[14px] overflow-hidden">
                        <div className="relative h-full bg-gradient-to-r from-purple-400 to-indigo-300 animate-[cs-progress_3.75s_linear_infinite]">
                            <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute top-0 left-[-35%] h-full w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[cs-shimmer_1.8s_linear_infinite]" />
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>

                {/* Subtle queue card */}
                <div className="mt-3 opacity-80">
                    <div className="backdrop-blur-xl bg-white/8 border border-white/15 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-white/80">V</div>
                        <div className="text-sm text-white/90">
                        <span className="font-medium">Viewer789</span> is in queue
                        </div>
                        <span className="ml-auto text-[11px] px-2 py-0.5 rounded bg-white/10 border border-white/20">Position • 2</span>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            {/* End Right */}
            </div>
        </div>
        </section>
    );
}