"use client";

import React, { useEffect, useRef } from "react";
import { LogIn, Share2, Users, PhoneCall } from "lucide-react";

export default function HowItWorksSection() {
  // Properly typed mutable array of refs
  const stepsRef = useRef<Array<HTMLDivElement | null>>([]);

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

    stepsRef.current.forEach((el) => {
      if (el) io.observe(el);
    });

    return () => io.disconnect();
  }, []);

  const steps = [
    {
      icon: <LogIn className="h-8 w-8 text-white" />,
      title: "1. Sign In",
      desc: "Connect your Twitch, Kick or YouTube account securely.",
    },
    {
      icon: <Share2 className="h-8 w-8 text-white" />,
      title: "2. Share Your Link",
      desc: "Drop your CallSubs link in chat, panels or overlays.",
    },
    {
      icon: <Users className="h-8 w-8 text-white" />,
      title: "3. Queue Up",
      desc: "Subscribers join the call queue in real time.",
    },
    {
      icon: <PhoneCall className="h-8 w-8 text-white" />,
      title: "4. Go Live",
      desc: "Accept calls with one click. Control everything instantly.",
    },
  ] as const;

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden pt-10 pb-20 sm:pt-12 sm:pb-24 md:pt-14 md:pb-28 bg-transparent"
    >
      {/* Floating badge title */}
      <div className="mb-14 text-center relative">
        <div className="inline-block rounded-full border border-fuchsia-400/40 bg-white/5 px-6 py-3 
                        shadow-[0_0_25px_rgba(168,85,247,0.35)] backdrop-blur-lg 
                        animate-[pulse_4s_ease-in-out_infinite]">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            How It Works
          </h2>
        </div>
        <p className="mt-5 text-white/80 max-w-2xl mx-auto text-lg sm:text-xl">
          Go live in minutes. Real connections. Real revenue.
        </p>
      </div>

      {/* Steps */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 lg:px-8">
        {steps.map((step, idx) => (
          <div
            key={step.title}
            ref={(el: HTMLDivElement | null) => {
              // explicit void body to satisfy TS
              stepsRef.current[idx] = el;
            }}
            className="cs-step opacity-0 translate-y-5 text-center"
            style={{ transitionDelay: `${idx * 150}ms` }}
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl
                            bg-white/5 border border-white/10 shadow-[0_0_20px_rgba(168,85,247,0.25)]
                            backdrop-blur-lg">
              {step.icon}
            </div>
            <h3 className="text-white text-lg font-semibold mb-2">{step.title}</h3>
            <p className="text-white/70 text-sm">{step.desc}</p>
          </div>
        ))}
      </div>

      <style>{`
        .cs-step {
          transition: opacity 800ms ease, transform 800ms ease;
        }
        .cs-step[data-in-view="true"] {
          opacity: 1;
          transform: translateY(0);
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 25px rgba(168,85,247,0.35); }
          50% { box-shadow: 0 0 35px rgba(168,85,247,0.55); }
        }
      `}</style>
    </section>
  );
}
