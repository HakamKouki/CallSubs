"use client";

import React, { useEffect, useRef } from "react";
import { LogIn, Share2, Users, PhoneCall } from "lucide-react";

export default function HowItWorksSection() {
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-in-view", "true");
          }
        });
      },
      { threshold: 0.2 }
    );

    stepsRef.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const steps = [
    {
      icon: <LogIn className="w-7 h-7 text-white" />,
      title: "Sign In",
      text: "Connect with Twitch, Kick or YouTube — no install needed.",
    },
    {
      icon: <Share2 className="w-7 h-7 text-white" />,
      title: "Share Your Link",
      text: "Post your CallSubs link in chat or your panels.",
    },
    {
      icon: <Users className="w-7 h-7 text-white" />,
      title: "Viewers Join Queue",
      text: "Fans pay or use sub perks to join your live call queue.",
    },
    {
      icon: <PhoneCall className="w-7 h-7 text-white" />,
      title: "Control the Call",
      text: "Accept, decline, or mute with one click — your stream, your rules.",
    },
  ];

  return (
    <section
      className="relative overflow-hidden py-20 sm:py-24 md:py-28"
      id="how-it-works"
    >
      <style>{`
        .hiw-fade {
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 800ms ease, transform 800ms ease;
        }
        .hiw-fade[data-in-view="true"] {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div
          className="w-[85vw] max-w-5xl h-[85vw] max-h-[560px] rounded-full blur-3xl opacity-25"
          style={{
            background:
              "radial-gradient(closest-side, rgba(168,85,247,0.18), rgba(168,85,247,0) 70%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
        {/* Title */}
        <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          How It Works
        </h2>
        <p className="mt-4 text-white/80 max-w-2xl mx-auto text-lg sm:text-xl">
          Go live in minutes. Real connections. Real revenue.
        </p>

        {/* Steps */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {steps.map((step, i) => (
            <div
              key={step.title}
              ref={(el: HTMLDivElement | null) => {
                stepsRef.current[i] = el;
              }}
              className="hiw-fade flex flex-col items-center text-center"
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xl flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.35)] mb-5 hover:scale-105 transition-transform duration-300">
                {step.icon}
              </div>
              <h3 className="text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm text-white/75 max-w-[200px]">
                {step.text}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14">
          <a
            href="#"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full font-semibold text-white
                       bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500
                       shadow-lg transition-all duration-300 hover:shadow-[0_0_28px_rgba(168,85,247,0.35)]"
          >
            Get Started
          </a>
        </div>
      </div>
    </section>
  );
}
