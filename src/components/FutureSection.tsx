"use client";

import React, { useEffect, useRef } from 'react';
import { MessageCircle, Shield, Zap } from 'lucide-react';
import FloatingDashboardMockup from './FloatingDashboardMockup';

export default function FutureSection() {
  // ✅ Explicitly type the cardsRef to fix TS errors
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-in-view', 'true');
          }
        });
      },
      { threshold: 0.15 }
    );
    cardsRef.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const scrollToHowItWorks = () => {
    const howItWorksSection = document.getElementById('how-it-works');
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section className="relative overflow-hidden" aria-label="Community-first engagement">
      <style>{`
        .cs-fade-card {
          opacity: 0;
          transform: translateY(0.75rem);
          transition: opacity 700ms ease, transform 700ms ease;
        }
        .cs-fade-card[data-in-view="true"] {
          opacity: 1;
          transform: translateY(0);
        }
        @keyframes cs-soft-pulse {
          0%, 100% { opacity: 0.85; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.03); }
        }
        @keyframes cs-shimmer {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }
        @keyframes cs-float-soft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>

      {/* Subtle purple radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center z-[1]">
        <div
          className="w-[90vw] max-w-5xl h-[90vw] max-h-[520px] rounded-full blur-3xl opacity-25"
          style={{
            background:
            'radial-gradient(closest-side, rgba(168,85,247,0.18), rgba(168,85,247,0) 70%)'
          }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-14 md:pt-16 pb-24 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left column */}
          <div>
            {/* Header */}
            <div className="max-w-2xl">
              <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight text-white">
                The Future of Fan Engagement
              </h2>
              <p className="text-white/80 mt-5 text-base sm:text-lg md:text-xl">
                Streamers aren’t just creators. They’re community leaders. CallSubs helps you connect with your audience in more meaningful ways.
              </p>
            </div>

            {/* Unifying subtitle */}
            <div className="mt-7 text-white/70 text-xs uppercase tracking-wide">
              Why Creators Choose CallSubs.
            </div>

            {/* Feature Cards */}
            <div className="mt-5 grid grid-cols-1 gap-5">
              {/* Card 1 */}
              <div
                ref={(el) => { cardsRef.current[0] = el }}
                className="cs-fade-card group relative p-[1px] rounded-2xl bg-gradient-to-r from-fuchsia-500/0 to-purple-400/0 hover:from-fuchsia-500/30 hover:to-purple-400/30 transition-all duration-300">
                <div className="rounded-2xl h-full bg-white/5 border border-white/10 backdrop-blur-xl p-6 transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-purple-500/10">
                  <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center animate-[cs-soft-pulse_3.2s_ease-in-out_infinite] shadow-[0_0_18px_rgba(168,85,247,0.35)]">
                    <MessageCircle className="w-6 h-6 text-white/90" />
                  </div>
                  <h3 className="mt-4 text-white font-semibold text-lg">Stay in Control</h3>
                  <p className="mt-2 text-white/75">
                    You decide who joins, when calls happen, and how every interaction unfolds.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div
                ref={(el) => { cardsRef.current[1] = el }}
                className="cs-fade-card group relative p-[1px] rounded-2xl bg-gradient-to-r from-fuchsia-500/0 to-purple-400/0 hover:from-fuchsia-500/30 hover:to-purple-400/30 transition-all duration-300">
                <div className="rounded-2xl h-full bg-white/5 border border-white/10 backdrop-blur-xl p-6 transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-purple-500/10">
                  <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center animate-[cs-soft-pulse_3.2s_ease-in-out_infinite] shadow-[0_0_18px_rgba(168,85,247,0.35)]">
                    <Shield className="w-6 h-6 text-white/90" />
                  </div>
                  <h3 className="mt-4 text-white font-semibold text-lg">Safety Built-In</h3>
                  <p className="mt-2 text-white/75">
                    Every call is protected by layered defense. Phone verification, AI moderation, and instant mute hotkeys.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div
                ref={(el) => { cardsRef.current[2] = el }}
                className="cs-fade-card group relative p-[1px] rounded-2xl bg-gradient-to-r from-fuchsia-500/0 to-purple-400/0 hover:from-fuchsia-500/30 hover:to-purple-400/30 transition-all duration-300">
                <div className="rounded-2xl h-full bg-white/5 border border-white/10 backdrop-blur-xl p-6 transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-purple-500/10">
                  <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center animate-[cs-soft-pulse_3.2s_ease-in-out_infinite] shadow-[0_0_18px_rgba(168,85,247,0.35)]">
                    <Zap className="w-6 h-6 text-white/90" />
                  </div>
                  <h3 className="mt-4 text-white font-semibold text-lg">Seamless Setup</h3>
                  <p className="mt-2 text-white/75">
                    Go live with CallSubs in minutes. No installs, no headaches, just pure connection.
                  </p>
                </div>
              </div>
            </div>

            {/* One-liner under cards */}
            <p className="mt-4 text-white/70 text-sm">
              Perfect for Just Chatting, IRL, or Q&amp;A streams.
            </p>

            {/* Quick highlights */}
            <div className="mt-6 grid grid-cols-3 gap-3 text-xs text-white/80">
              <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-center">🔒 Safe by default</div>
              <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-center">⚡ 2-min setup</div>
              <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-center">🎮 Twitch • Kick • YouTube</div>
            </div>

            {/* CTA */}
            <div className="mt-8">
              <button
                onClick={scrollToHowItWorks}
                className="group relative inline-flex items-center justify-center px-7 py-3 rounded-full font-semibold text-white
                           bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500
                           shadow-md transition-all duration-200 hover:shadow-[0_0_24px_rgba(168,85,247,0.35),0_0_28px_rgba(147,51,234,0.25)] overflow-hidden">
                <span className="relative z-10">See How It Works</span>
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background:
                    'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)',
                    animation: 'cs-shimmer 2.4s linear infinite'
                  }} />
              </button>
            </div>
          </div>

          {/* Right column: floating dashboard mockup */}
          <div className="relative">
            <div
              className="absolute -inset-6 rounded-3xl blur-3xl opacity-25"
              style={{ background: 'radial-gradient(closest-side, rgba(168,85,247,0.22), rgba(168,85,247,0) 70%)' }}
              aria-hidden="true" />
            <FloatingDashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
