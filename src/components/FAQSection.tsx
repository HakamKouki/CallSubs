"use client";

import React from "react";
import FaqExplorer from "@/components/FaqExplorer";
import { FAQ_DATA } from "@/components/faqData";

export default function FAQSection() {
  return (
    <section className="relative overflow-hidden bg-black py-20 sm:py-24 md:py-28">
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="w-[92vw] max-w-5xl h-[92vw] max-h-[560px] rounded-full blur-3xl opacity-60"
          style={{
            background:
              "radial-gradient(closest-side, rgba(124,58,237,0.18), rgba(124,58,237,0) 70%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <header className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-white/70 text-sm md:text-base">
            Everything you need to know about CallSubs in one place.
          </p>
        </header>

        <FaqExplorer data={FAQ_DATA} />
      </div>
    </section>
  );
}
