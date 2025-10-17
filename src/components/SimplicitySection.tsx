"use client";

import React from "react";
import { motion } from "framer-motion";
import { DollarSign, Zap, Monitor, Shield } from "lucide-react";

type BulletProps = {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
};

export default function SimplicitySection() {
  return (
    <section
      aria-label="Built for streamers"
      className="relative bg-black py-20 sm:py-24 md:py-28"
    >
      {/* Soft purple halo behind the widget */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div
          className="h-[520px] w-[92vw] max-w-6xl rounded-[36px] blur-3xl opacity-50"
          style={{
            background:
              "radial-gradient(closest-side, rgba(139,92,246,0.25), rgba(139,92,246,0.12) 45%, rgba(139,92,246,0) 70%)",
          }}
        />
      </div>

      {/* Widget container */}
      <div className="relative mx-auto w-full max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-xl"
        >
          <div className="grid grid-cols-1 gap-10 p-6 sm:p-8 md:p-10 lg:grid-cols-2">
            {/* LEFT — Live Status mockup */}
            <div>
              <div className="rounded-2xl border border-white/12 bg-black/50 p-5 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="text-white font-semibold">Live Status</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/70">Accepting Calls</span>
                    {/* Pretty toggle (mocked ON) */}
                    <div className="relative h-6 w-10 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 p-[2px]">
                      <div className="h-full w-full rounded-full bg-black/40" />
                      <div className="absolute top-1 left-[22px] h-4 w-4 rounded-full bg-white shadow" />
                    </div>
                  </div>
                </div>

                {/* Settings */}
                <div className="mt-5 space-y-4">
                  <div>
                    <div className="text-xs text-white/60 mb-1">Call Settings</div>
                    <div className="rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-white/85 flex items-center justify-between">
                      <span>Call Price:</span>
                      <span className="font-semibold">$50.00</span>
                    </div>
                  </div>
                  <div>
                    <div className="rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-white/85 flex items-center justify-between">
                      <span>Duration:</span>
                      <span className="font-semibold">5 minutes</span>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="mt-6">
                  <div className="text-xs text-white/60 mb-1">Metrics</div>
                  <div className="rounded-xl border border-white/12 bg-gradient-to-r from-violet-500/15 to-fuchsia-500/15 px-4 py-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/85">Total Earned</span>
                      <span className="text-xl font-bold text-white">$127.50</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT — Copy + bullets */}
            <div className="flex flex-col justify-center">
              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight"
              >
                Built for Streamers. No Headaches. No Limits.
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: 0.12 }}
                className="mt-4 text-white/80 text-base sm:text-lg leading-relaxed"
              >
                CallSubs was built to help you earn without distractions. Everything is simple,
                clean, and designed to work in seconds. You stay in control at all times and decide
                how and when to connect with your community.
              </motion.p>

              <div className="mt-7 grid grid-cols-1 gap-4">
                <Bullet
                  Icon={DollarSign}
                  title="Set Your Own Price"
                  desc="You’re in control. Choose what your time is worth."
                />
                <Bullet
                  Icon={Zap}
                  title="Stay in Flow"
                  desc="Accept or pause calls without interrupting your stream."
                />
                <Bullet
                  Icon={Monitor}
                  title="No Tech Stress"
                  desc="No installs, no OBS chaos. Just your browser."
                />
                <Bullet
                  Icon={Shield}
                  title="Safe by Default"
                  desc="Verification and fast controls keep trolls out."
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Bullet({ Icon, title, desc }: BulletProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.45 }}
      className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.035] p-3"
    >
      <div className="relative">
        <div className="grid h-10 w-10 place-items-center rounded-lg border border-white/15 bg-white/10">
          <Icon className="h-5 w-5 text-white/90" />
        </div>
      </div>
      <div>
        <div className="text-white font-medium">{title}</div>
        <div className="text-white/75 text-sm">{desc}</div>
      </div>
    </motion.div>
  );
}
