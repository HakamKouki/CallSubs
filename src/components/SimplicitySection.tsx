"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Shield, Zap, Headphones } from "lucide-react";

type FeatureProps = {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
};

export default function SimplicitySection() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particles = useRef<
    { x: number; y: number; r: number; a: number; s: number; o: number; t: number }[]
  >([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
    };
    resize();
    window.addEventListener("resize", resize);

    // Init particles
    particles.current = Array.from({ length: 60 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      a: Math.random() * Math.PI * 2,
      s: Math.random() * 0.5 + 0.2,
      o: Math.random() * 0.5 + 0.2,
      t: Math.random() * 1000,
    }));

    const draw = (ts: number) => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles.current) {
        p.a += 0.002;
        p.x += Math.cos(p.a) * p.s;
        p.y += Math.sin(p.a) * p.s;
        p.t += 0.02;
        p.o = 0.3 + Math.sin(p.t) * 0.2;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.globalAlpha = p.o;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "#a855f7";
        ctx.fill();
      }

      requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#0d0d0d] py-24 sm:py-28 md:py-32">
      {/* Animated particle background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 -z-10 h-full w-full"
      />

      <div className="relative max-w-6xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6"
        >
          Simplicity Meets Power
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto text-lg sm:text-xl text-white/80 mb-14"
        >
          Built to make your streaming experience effortless. No setup pain.
          No clutter. Just smooth interaction.
        </motion.p>

        {/* Feature list */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          <Feature Icon={Shield} title="Safe by Design">
            Advanced moderation and verification keep trolls out of your stream.
          </Feature>
          <Feature Icon={Zap} title="Instant Setup">
            Go live in minutes — no downloads, no complicated configs.
          </Feature>
          <Feature Icon={Headphones} title="Seamless Control">
            Manage your call queue with a clean, intuitive dashboard.
          </Feature>
        </div>
      </div>
    </section>
  );
}

function Feature({ Icon, title, children }: FeatureProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 
                 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)] transition-all duration-300"
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 border border-white/10">
        <Icon className="h-7 w-7 text-white" />
      </div>
      <h3 className="text-white text-lg font-semibold mb-2">{title}</h3>
      <p className="text-white/70 text-sm">{children}</p>
    </motion.div>
  );
}
