"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function ContactBrandBanner() {
  const ref = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.setAttribute("data-in-view", "true");
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden bg-black py-10 sm:py-14">
      {/* Purple Glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="w-[90vw] max-w-5xl h-[90vw] max-h-[520px] rounded-full blur-3xl opacity-30"
          style={{
            background:
              "radial-gradient(closest-side, rgba(168,85,247,0.25), rgba(168,85,247,0) 70%)",
          }}
        />
      </div>

      <style>{`
        @keyframes cs-shimmer {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }
        [data-in-view="true"] {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div
          ref={ref}
          className="transition-all duration-700 opacity-0 translate-y-3"
          data-in-view="false"
        >
          <div
            className="w-full rounded-full bg-[#0b0f14] border border-white/10 px-4 sm:px-6 md:px-8 py-4 md:py-5 flex items-center gap-4 md:gap-6 backdrop-blur-md"
            style={{
              boxShadow:
                "0 1px 0 rgba(255,255,255,0.06) inset, 0 10px 30px rgba(0,0,0,0.25)",
            }}
          >
            {/* Left: Logo */}
            <div className="relative shrink-0">
              <div
                className="absolute inset-0 scale-110 rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(58,28,113,0.55), rgba(124,58,237,0.35) 60%, rgba(0,0,0,0) 70%)",
                  filter:
                    "blur(10px) drop-shadow(0 0 18px rgba(124,58,237,0.45))",
                }}
                aria-hidden="true"
              />
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden ring-1 ring-white/10 bg-black flex items-center justify-center relative z-[1]">
                <img
                  src="/logo.svg"
                  alt="CallSubs Logo"
                  className="w-9 h-9 md:w-10 md:h-10 object-contain"
                />
              </div>
            </div>

            {/* Center: Text */}
            <div className="flex-1 min-w-0">
              <div className="text-white font-semibold text-base md:text-lg truncate">
                Hey 👋 We’re CallSubs!
              </div>
              <div className="text-white/80 text-sm md:text-base">
                Built for streamers, made for real conversations.
              </div>
              <div className="text-white/80 text-sm md:text-base">
                Got a question? We’re here to help.
              </div>
            </div>

            {/* Right: CTA Button */}
            <div className="shrink-0">
              <button
                onClick={() => router.push("/contact")}
                className="relative inline-flex items-center justify-center rounded-full px-4 md:px-5 py-2 md:py-2.5 text-sm font-semibold text-white transition-transform duration-200 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-cyan-500 hover:scale-[1.03]"
              >
                <span className="relative z-10">Contact Us</span>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -skew-x-12 opacity-0 hover:opacity-100 transition-opacity"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)",
                    animation: "cs-shimmer 2.4s linear infinite",
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
