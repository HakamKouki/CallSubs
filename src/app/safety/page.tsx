"use client";

import React from "react";
import TrustMonitor from "@/components/safety/TrustMonitor";
import PremiumFooter from "@/components/PremiumFooter";

export default function SafetyPage() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* 🌌 Soft Purple Glow Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side, rgba(124,58,237,0.18), transparent 70%)",
        }}
      />

      {/* 🧭 Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
          Our Safety Approach
        </h1>
        <p className="text-white/80 max-w-2xl mx-auto text-lg">
          At CallSubs, safety isn’t an afterthought — it’s the foundation of everything we build.
          We protect creators and communities with layered defenses designed for live interactions.
        </p>
      </section>

      {/* 🛡️ Core Pillars */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          {
            title: "Real-Time Moderation",
            desc: "We use advanced moderation to keep calls clean and respectful.",
            icon: "🛡️",
          },
          {
            title: "AI-Powered Trust Signals",
            desc: "Our system detects and prevents abuse before it reaches your stream.",
            icon: "🤖",
          },
          {
            title: "Instant Control",
            desc: "Mute, kick, or block any caller in one click — you’re always in charge.",
            icon: "⚡",
          },
        ].map((pillar, idx) => (
          <div
            key={idx}
            className="group relative rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_0_28px_rgba(124,58,237,0.25)]"
          >
            <div className="text-4xl mb-4">{pillar.icon}</div>
            <h3 className="font-semibold text-xl mb-2">{pillar.title}</h3>
            <p className="text-white/75 text-sm">{pillar.desc}</p>
          </div>
        ))}
      </section>

      {/* 📊 Trust Monitor Component */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Real-Time Safety Monitoring
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Our Trust Monitor constantly analyzes live interactions, ensuring a safer experience
            for both streamers and their communities.
          </p>
        </div>
        <div className="flex justify-center">
          <TrustMonitor />
        </div>
      </section>

      {/* 🤝 Transparency Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Transparency First</h2>
        <p className="text-white/80 mb-6">
          We believe that trust starts with clarity. Our safety stack operates with full
          transparency — from caller verification to real-time incident response.
        </p>
        <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <div className="rounded-lg bg-white/5 border border-white/10 px-5 py-3">
            ✅ Subscriber-only voice calls
          </div>
          <div className="rounded-lg bg-white/5 border border-white/10 px-5 py-3">
            🧠 AI moderation & threat detection
          </div>
          <div className="rounded-lg bg-white/5 border border-white/10 px-5 py-3">
            🛑 One-click control & reporting
          </div>
        </div>
      </section>

      {/* 🌿 Footer */}
      <PremiumFooter />
    </div>
  );
}
