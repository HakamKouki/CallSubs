"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Lock } from "lucide-react";
import PremiumFooter from "@/components/PremiumFooter";

// ------- Floating / sticky header (dark, premium) -------
function FloatingHeader() {
  return (
    <div className="sticky top-3 z-50 flex justify-center px-4">
      <nav
        className={[
          "w-full max-w-5xl",
          "rounded-[20px] border",
          "bg-black/50 backdrop-blur-xl",
          "border-white/10",
          "shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_8px_30px_rgba(0,0,0,0.35)]",
        ].join(" ")}
      >
        <div className="flex items-center justify-between px-4 py-2 md:px-6 md:py-3">
          <Link href="/" className="flex items-center gap-2">
            {/* Logo image if present: /public/logo.png */}
            <img src="/logo.png" alt="CallSubs" className="h-7 w-7 rounded-md" />
            <span className="text-sm md:text-base font-semibold">CallSubs</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm text-white/80">
            <Link href="/#features" className="hover:text-white transition">
              Features
            </Link>
            <Link href="/#how-it-works" className="hover:text-white transition">
              How it works
            </Link>
            <Link href="/#pricing" className="hover:text-white transition">
              Pricing
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/api/auth/signin"
              className="text-sm font-medium rounded-full px-3.5 py-2 bg-white/10 border border-white/15 hover:bg-white/15 transition"
            >
              Sign in
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

// ------- Small helpers -------
const Section = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <section className={`w-full max-w-7xl mx-auto px-6 ${className}`}>{children}</section>
);

export default function SafetyPage() {
  return (
    <div className="min-h-screen w-full bg-black text-white">
      {/* header */}
      <FloatingHeader />

      {/* subtle starry dots + centerpiece glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(1200px 600px at 50% -10%, rgba(124,58,237,0.18), transparent 60%), radial-gradient(900px 400px at 80% 20%, rgba(99,102,241,0.15), transparent 60%)",
        }}
      />

      {/* Hero */}
      <Section className="py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
            Built for Real Conversations. <br />
            Protected by Real Technology.
          </h1>
          <p className="mt-5 text-white/80 text-lg">
            Safety isn’t an add-on at CallSubs—it’s the foundation. Every call,
            every feature, and every interaction is designed to keep you protected
            while you stay in control.
          </p>
          <div className="mt-8">
            <Link
              href="/#waitlist"
              className="inline-flex items-center rounded-xl px-5 py-3 font-semibold bg-white text-black hover:bg-white/90 transition"
            >
              Request Early Access
            </Link>
          </div>
        </div>

        {/* Shield ripple illustration */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 -z-10 flex items-center justify-center">
            <div className="w-72 h-72 rounded-full blur-3xl bg-purple-500/15" />
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative grid place-items-center"
          >
            <RippleRings />
            <div className="absolute inset-0 grid place-items-center">
              <Shield className="w-14 h-14 text-purple-300" />
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Verification mockup */}
      <Section className="py-10 md:py-14 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="max-w-xl">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Verified Identities, Real Accountability.
          </h2>
          <p className="mt-4 text-white/80">
            Phone verification ties one identity to one number. We track linked
            accounts and propagate bans across identities to protect you from
            repeat offenders.
          </p>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-3xl blur-3xl bg-purple-500/15" />
          <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
            <KV label="Viewer Phone" value="+1 •••• 89" />
            <KV label="OTP Code" value="123456" />
            <KV label="Verified" value="Success" valueClass="text-emerald-400" />
          </div>
        </div>
      </Section>

      {/* Live transcription + copy block */}
      <Section className="py-12 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
          <div className="flex items-center gap-2 text-sm text-white/85">
            <Lock className="w-4 h-4 text-purple-300" />
            <span>Live Transcription</span>
          </div>
          <Waveform />
          <p className="mt-2 text-xs text-white/60">
            AI flags slurs, harassment, and risk in real time.
          </p>
        </div>

        <div className="max-w-xl">
          <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            AI That Listens So You Don’t Have To.
          </h3>
          <p className="mt-4 text-white/80">
            Real-time transcription analyzes conversations as they happen—detecting
            harassment and risky behavior. Calls are automatically flagged,
            helping you moderate without breaking flow.
          </p>
        </div>
      </Section>

      {/* Private by Default + right glow orb */}
      <Section className="py-12 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start relative">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <div className="flex items-center gap-2 text-sm text-white/85">
            <Lock className="w-4 h-4 text-purple-300" />
            <span className="font-semibold">Private by Default</span>
          </div>
          <ul className="mt-4 text-sm text-white/80 space-y-2">
            <li>• Encrypted data with strict access controls</li>
            <li>• GDPR-aligned user protections</li>
            <li>• Masked phone digits by default</li>
            <li>• Transparent unban history</li>
          </ul>
        </div>

        <div className="max-w-xl relative">
          <div className="absolute -top-8 -right-10 w-56 h-56 rounded-full blur-3xl bg-purple-500/15" />
          <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Protected Connections. Private by Default.
          </h3>
          <p className="mt-4 text-white/80">
            Your safety and privacy are core to the CallSubs platform. From masked
            identifiers to transparent moderation history, we balance protection
            with clarity.
          </p>
        </div>
      </Section>

      {/* Always Evolving */}
      <Section className="py-16 md:py-24 text-center">
        <h3 className="text-3xl font-extrabold tracking-tight">
          Always Evolving. Always Safer.
        </h3>
        <p className="mt-4 text-white/80 max-w-2xl mx-auto">
          We’re building the future of live safety with smart prevention and
          stronger signals.
        </p>
        <ul className="mt-6 text-white/80 space-y-2 text-sm">
          <li>• Behavioral Pattern Detection</li>
          <li>• Enhanced Trust Ratings</li>
          <li>• Shared Ban Lists between creators</li>
        </ul>
      </Section>

      {/* CTA */}
      <Section className="py-20 md:py-28 text-center relative">
        <div className="absolute left-1/2 -translate-x-1/2 -top-8 w-[28rem] h-[28rem] rounded-full blur-3xl bg-purple-500/12" />
        <h3 className="text-4xl font-extrabold tracking-tight">
          Your Stream. Your Rules. Our Protection.
        </h3>
        <p className="mt-3 text-white/80">Join the safest way to connect live.</p>
        <div className="mt-8">
          <Link
            href="/#waitlist"
            className="inline-flex items-center rounded-xl px-6 py-3 font-semibold bg-white text-black hover:bg-white/90 transition"
          >
            Get Started
          </Link>
        </div>
      </Section>

      {/* footer */}
      <PremiumFooter />
    </div>
  );
}

/* ----------------------- Illustrations ----------------------- */

function RippleRings() {
  const Ring = ({ delay = 0 }: { delay?: number }) => (
    <motion.div
      className="w-48 h-48 rounded-full border border-purple-400/30"
      style={{ boxShadow: "0 0 24px rgba(168,85,247,0.25)" }}
      initial={{ scale: 0.7, opacity: 0.4 }}
      animate={{ scale: 1.05, opacity: 0.85 }}
      transition={{ repeat: Infinity, repeatType: "reverse", duration: 3.2, delay }}
    />
  );
  return (
    <div className="relative grid place-items-center">
      <Ring delay={0} />
      <Ring delay={0.6} />
      <Ring delay={1.2} />
    </div>
  );
}

function KV({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 rounded-xl bg-white/5 border border-white/10 px-4 py-3 mb-3">
      <span className="text-sm text-white/60">{label}</span>
      <span className={`text-sm text-right ${valueClass}`}>{value}</span>
    </div>
  );
}

function Waveform() {
  // deterministic heights for SSR friendliness
  const bars = Array.from({ length: 36 }, (_, i) => (i % 5) * 8 + 18);
  return (
    <div className="mt-4 h-24 rounded-lg bg-gradient-to-r from-purple-500/20 to-indigo-500/20 p-2 flex items-end gap-1 border border-white/10">
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-1.5 rounded-full bg-purple-400/80"
          style={{ height: `${h}px` }}
        />
      ))}
    </div>
  );
}
