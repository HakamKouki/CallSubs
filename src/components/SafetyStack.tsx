"use client";

import React from "react";
import {
  PhoneCall,
  MicOff,
  Brain,
  Database,
  Lock,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from "lucide-react";

// --- Minimal internal UI primitives ---
function Button({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center px-4 py-2 rounded-lg font-semibold text-white transition ${className}`}
    >
      {children}
    </button>
  );
}

function Input({
  value,
  onChange,
  className = "",
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}) {
  return (
    <input
      value={value}
      onChange={onChange}
      className={`px-3 py-2 rounded-md outline-none ${className}`}
    />
  );
}

function Checkbox({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      className="h-4 w-4 accent-purple-500 cursor-pointer"
    />
  );
}

export default function SafetyStack() {
  return (
    <section
      id="safety"
      className="relative overflow-hidden bg-black py-20 sm:py-24 md:py-28"
    >
      {/* Soft purple background aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div
          className="w-[92vw] max-w-5xl h-[92vw] max-h-[560px] rounded-full blur-3xl opacity-60"
          style={{
            background:
              "radial-gradient(closest-side, rgba(124,58,237,0.18), rgba(124,58,237,0) 70%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-6 relative z-10">
        {/* Headline */}
        <header className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Your Stream, Protected by Design.
          </h2>
          <p className="mt-3 text-sm md:text-base text-white/75 max-w-3xl mx-auto">
            Every call is protected by four layers of defense, so you can focus
            on streaming.
          </p>
        </header>

        {/* Mission Control Card */}
        <div className="relative mx-auto w-full md:w-[80%]">
          <div
            className="absolute -inset-6 rounded-[28px] blur-3xl opacity-40 pointer-events-none"
            style={{
              background:
                "radial-gradient(closest-side, rgba(124,58,237,0.25), rgba(59,130,246,0.12) 60%, transparent 90%)",
            }}
          />
          <div className="relative rounded-2xl border border-white/10 bg-[#0b0f18]/70 backdrop-blur-xl shadow-[0_0_0_1px_rgba(124,58,237,0.14),0_10px_40px_rgba(2,6,23,0.45),0_0_50px_rgba(59,130,246,0.10)]">
            {/* Title bar */}
            <div className="flex items-center justify-between px-5 md:px-7 pt-5 md:pt-6 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-purple-500/15 border border-purple-400/25 grid place-items-center">
                  <ShieldCheck className="w-4 h-4 text-purple-300" />
                </div>
                <div>
                  <div className="text-white font-semibold">
                    Mission Control • Safety
                  </div>
                  <div className="text-xs text-white/60">
                    Real-time protections are active
                  </div>
                </div>
              </div>
              <div className="text-xs text-emerald-300 font-medium">
                Status: Secure
              </div>
            </div>

            <div className="px-5 md:px-7 pb-6 md:pb-7">
              <SafetyHotkeysMock />
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 md:mt-10 flex justify-center">
          <Button className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 shadow-[0_0_24px_rgba(168,85,247,0.35)] hover:opacity-95">
            Learn More About Our Safety Approach
          </Button>
        </div>

        {/* Mini-cards row */}
        <div className="mt-10 md:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          <MiniCard
            icon={Lock}
            title="Phone Verification"
            desc="Verify fans via SMS before joining."
          />
          <MiniCard
            icon={MicOff}
            title="Instant Mute Hotkeys"
            desc="One-tap mute or end instantly."
          />
          <MiniCard
            icon={Brain}
            title="AI Moderation (Beta)"
            desc="Flags slurs, threats, and risks in real time."
          />
          <MiniCard
            icon={Database}
            title="Shared Ban DB & Trust Score"
            desc="Community bans + caller reputation."
          />
        </div>
      </div>
    </section>
  );
}

// --- Subcomponents ---
function SafetyHotkeysMock() {
  const [keyChar, setKeyChar] = React.useState("M");
  const [panicMute, setPanicMute] = React.useState(true);
  const [autoMute, setAutoMute] = React.useState(true);
  const [showIndicator, setShowIndicator] = React.useState(true);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#101826]/70 backdrop-blur-xl p-5 md:p-6 mt-6 md:mt-7">
      <div className="flex justify-between mb-3">
        <div className="text-white font-medium">Hotkey Settings</div>
        <span className="text-xs px-2 py-1 rounded-md bg-emerald-400/15 text-emerald-300 border border-emerald-300/30">
          Active
        </span>
      </div>

      {/* Key input */}
      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm text-white/70">Key:</label>
        <Input
          value={keyChar}
          onChange={(e) =>
            setKeyChar(e.target.value.toUpperCase().slice(0, 1))
          }
          className="bg-white/10 border border-white/10 text-white"
        />
        <Button className="bg-white/10 border border-white/15 hover:bg-white/15">
          <Zap className="w-4 h-4 mr-1" />
          Test
        </Button>
      </div>

      {/* Checkboxes */}
      <div className="grid gap-2 text-white/90">
        <label className="flex items-center gap-2">
          <Checkbox checked={panicMute} onCheckedChange={setPanicMute} />
          <span className="text-sm">Enable panic mute</span>
        </label>
        <label className="flex items-center gap-2">
          <Checkbox checked={autoMute} onCheckedChange={setAutoMute} />
          <span className="text-sm">Auto-mute on report</span>
        </label>
        <label className="flex items-center gap-2">
          <Checkbox checked={showIndicator} onCheckedChange={setShowIndicator} />
          <span className="text-sm">Show mute indicator in call</span>
        </label>
      </div>

      <div className="mt-4 flex justify-end">
        <Button className="bg-black/70 hover:bg-black/80 border border-white/15">
          Save
        </Button>
      </div>
    </div>
  );
}

function MiniCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <div
      className="relative rounded-xl border border-white/10 bg-[#0b1220]/60 backdrop-blur-md p-4"
      style={{
        boxShadow:
          "0 0 0 1px rgba(124,58,237,0.08) inset, 0 12px 30px rgba(2,6,23,0.25)",
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-white/10 border border-white/15 grid place-items-center">
            <Icon className="w-4 h-4 text-white" />
          </div>
          <div className="text-white font-semibold text-sm">{title}</div>
        </div>
        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
      </div>
      <p className="mt-2 text-white/75 text-sm">{desc}</p>
    </div>
  );
}
