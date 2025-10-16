"use client";

import React, { useEffect, useRef } from "react";
import { Twitch, Youtube } from "lucide-react";

export default function PlatformBanner() {
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.setAttribute("data-in-view", "true");
        });
      },
      { threshold: 0.2 }
    );

    itemsRef.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const logos = [
    {
      key: "twitch",
      label: "Twitch",
      element: (
        <Twitch
          className={[
            "transition-all duration-300 logo-outline",
            "h-16 sm:h-20 md:h-24 lg:h-28 w-auto",
            "text-white/90 group-hover:text-[#9146FF]",
            "group-hover:drop-shadow-[0_0_18px_rgba(145,70,255,0.45)]"
          ].join(" ")}
        />
      ),
    },
    {
      key: "youtube",
      label: "YouTube Live",
      element: (
        <Youtube
          className={[
            "transition-all duration-300 logo-outline",
            "h-16 sm:h-20 md:h-24 lg:h-28 w-auto",
            "text-white/90 group-hover:text-[#FF0033]",
            "group-hover:drop-shadow-[0_0_18px_rgba(255,0,51,0.45)]"
          ].join(" ")}
        />
      ),
    },
    {
      key: "kick",
      label: "Kick",
      element: (
        <img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/688a6f696ca6741f805e95d3/f2bb5ade7_csm_EsportsKick_f24e499550-removebg-preview.png"
          alt="Kick logo"
          draggable={false}
          className={[
            "kick-logo select-none",
            "transition-all duration-300",
            "h-16 sm:h-20 md:h-24 lg:h-28 w-auto"
          ].join(" ")}
        />
      ),
      glow: "group-hover:drop-shadow-[0_0_22px_rgba(83,252,24,0.55)]",
    },
  ];

  return (
    <section className="relative w-full overflow-hidden mt-0 z-20 bg-[#0d0d0d]">
      <style>{`
        .cs-top-fade {
          background: linear-gradient(to bottom, rgba(13,13,13,1), rgba(13,13,13,0.85), rgba(13,13,13,0));
        }
        .cs-bottom-fade {
          background: linear-gradient(to top, rgba(13,13,13,1), rgba(13,13,13,0.85), rgba(13,13,13,0));
        }
        .cs-fade-item {
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 700ms ease, transform 700ms ease;
        }
        .cs-fade-item[data-in-view="true"] {
          opacity: 1;
          transform: translateY(0);
        }
        .logo-outline {
          filter: drop-shadow(0 0 0.75px rgba(255,255,255,0.55));
        }
        .kick-logo { 
          filter: brightness(0) invert(1) drop-shadow(0 0 0.75px rgba(255,255,255,0.55));
        }
        .group:hover .kick-logo {
          filter: invert(63%) sepia(88%) saturate(522%) hue-rotate(61deg) brightness(107%) contrast(106%)
                  drop-shadow(0 0 14px rgba(83,252,24,0.55));
        }
      `}</style>

      {/* Subtle center purple glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="w-[90vw] max-w-5xl h-[90vw] max-h-[480px] rounded-full blur-3xl opacity-20"
          style={{
            background:
              "radial-gradient(closest-side, rgba(124,58,237,0.25), rgba(124,58,237,0) 70%)",
          }}
        />
      </div>

      {/* Top and bottom fades */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-16 cs-top-fade z-[1]" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 cs-bottom-fade z-[1]" />

      <div className="relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 md:py-12">
          <h3 className="text-center text-white font-extrabold text-xl sm:text-2xl md:text-3xl">
            Works seamlessly with the platforms you love
          </h3>

          <div className="mt-8 sm:mt-10 w-full grid grid-cols-3 place-items-center gap-10 sm:gap-14">
            {logos.map((l, idx) => (
              <div
                key={l.key}
                ref={(el) => { itemsRef.current[idx] = el }}
                className="cs-fade-item"
                style={{ transitionDelay: `${150 * idx}ms` }}
              >
                <div className={`group relative flex flex-col items-center gap-2 ${l.glow || ""}`}>
                  <div className="transition-transform duration-300 transform group-hover:scale-110">
                    {l.element}
                  </div>
                  <span className="text-white/80 text-xs sm:text-sm font-medium">{l.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
