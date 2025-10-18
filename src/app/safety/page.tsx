"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  Shield,
  CheckCircle2,
  Phone,
  KeyRound,
  Lock,
  Sparkles,
  Keyboard,
} from "lucide-react";
import TrustMonitor from "@/components/safety/TrustMonitor";

/** Floating sticky nav (same vibe as homepage) */
function FloatingNav() {
  useEffect(() => {
    const el = document.getElementById("safety-nav");
    if (!el) return;
    const onScroll = () => {
      if (window.scrollY > 8) el.classList.add("shadow-[0_10px_40px_rgba(0,0,0,.35)]");
      else el.classList.remove("shadow-[0_10px_40px_rgba(0,0,0,.35)]");
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sticky top-3 z-40 mx-auto max-w-6xl px-4">
      <div
        id="safety-nav"
        className="mx-auto flex items-center justify-between rounded-full border border-white/10 bg-white/[.06] px-3 py-2 backdrop-blur-xl"
        style={{
          boxShadow:
            "inset 0 0 0 1px rgba(255,255,255,.06), 0 10px 30px rgba(0,0,0,.25)",
        }}
      >
        <Link href="/" className="flex items-center gap-2 px-2 py-1">
          <img src="/logo.png" alt="CallSubs" className="h-6 w-6 rounded-full" />
          <span className="text-sm font-semibold text-white">CallSubs</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/#features" className="text-sm text-white/80 hover:text-white">
            Features
          </Link>
          <Link href="/#how-it-works" className="text-sm text-white/80 hover:text-white">
            How it works
          </Link>
          <Link href="/#pricing" className="text-sm text-white/80 hover:text-white">
            Pricing
          </Link>
          <Link href="/safety" className="text-sm text-white">
            Safety
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/api/auth/signin"
            className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/15"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Pill helper */
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.06] px-3 py-2 text-sm text-white/85">
      {children}
    </div>
  );
}

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white">
      <FloatingNav />

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-4 pt-16 md:pt-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[-12vw] top-[-6vw] h-[40vw] w-[40vw] rounded-full blur-3xl opacity-40"
          style={{
            background:
              "radial-gradient(closest-side, rgba(124,58,237,.25), rgba(124,58,237,0) 70%)",
          }}
        />
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Built for Real Conversations. Protected by Real Technology.
            </h1>
            <p className="mt-4 text-white/80">
              Safety isn’t an add-on at CallSubs, it’s the foundation. Every
              call, every feature, every user interaction is designed to keep
              you protected while staying in control.
            </p>
            <div className="mt-6">
              <Link
                href="/#waitlist"
                className="inline-flex items-center rounded-xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 px-4 py-2 text-sm font-semibold shadow-lg shadow-fuchsia-500/15"
              >
                Request Early Access
              </Link>
            </div>
          </div>

          {/* Concentric illustration */}
          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-3xl bg-[radial-gradient(closest-side,rgba(168,85,247,.18),rgba(168,85,247,0)_70%)] blur-2xl" />
            <div className="mx-auto mt-4 grid place-items-center">
              <div className="relative h-64 w-64">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="absolute inset-0 rounded-full border border-fuchsia-400/30"
                    style={{ transform: `scale(${0.4 + i * 0.15})` }}
                  />
                ))}
                <div className="absolute inset-0 grid place-items-center">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-white/10 ring-1 ring-white/15">
                    <Shield className="h-6 w-6 text-white/90" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verification */}
      <section className="relative mx-auto max-w-6xl px-4 py-16 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-extrabold">
            Verified Identities, Real Accountability.
          </h2>
          <p className="mt-3 text-white/80">
            Phone verification ties one identity to one number. We track linked
            accounts and propagate bans across identities to protect you from
            repeat offenders.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Pill>
            <Phone className="h-4 w-4" />
            <span className="text-white/70">Viewer Phone</span>
            <span className="ml-auto font-semibold">+1 •••• ••89</span>
          </Pill>
          <Pill>
            <KeyRound className="h-4 w-4" />
            <span className="text-white/70">OTP Code</span>
            <span className="ml-auto font-semibold">123456</span>
          </Pill>
          <Pill>
            <CheckCircle2 className="h-4 w-4 text-emerald-300" />
            <span className="text-white/70">Verified</span>
            <span className="ml-auto font-semibold text-emerald-300">Success</span>
          </Pill>
        </div>
      </section>

      {/* Live Transcription */}
      <section className="relative mx-auto max-w-6xl px-4 py-16">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
          <div className="relative rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-lg">
            <div className="absolute inset-0 -z-10 rounded-2xl bg-[radial-gradient(closest-side,rgba(168,85,247,.18),rgba(168,85,247,0)_70%)] blur-2xl opacity-60" />
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Lock className="h-4 w-4" />
              Live Transcription
              <Sparkles className="ml-auto h-4 w-4 text-fuchsia-300" />
            </div>
            <div className="mt-6 grid grid-cols-24 items-end gap-1">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className="w-full rounded-full bg-gradient-to-t from-fuchsia-400/40 to-indigo-400/40"
                  style={{ height: `${20 + ((i * 7) % 40)}px` }}
                />
              ))}
            </div>
            <p className="mt-4 text-xs text-white/70">
              AI flags slurs, harassment, and risk in real-time.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold">
              AI That Listens So You Don’t Have To.
            </h2>
            <p className="mt-3 text-white/80">
              Real-time transcription analyzes conversations as they happen,
              detecting harassment and risky behavior. Calls are automatically
              flagged, helping you moderate without breaking flow.
            </p>
          </div>
        </div>
      </section>

      {/* Total Control */}
      <section className="relative mx-auto max-w-6xl px-4 pb-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold">
              Total Control at Your Fingertips.
            </h2>
            <ul className="mt-4 space-y-2 text-white/80 text-sm">
              <li>• Instant Mute Hotkey (Ctrl+M)</li>
              <li>• Panic Mute (emergency full mute)</li>
              <li>• One-click Ban Button</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-lg">
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Keyboard className="h-4 w-4" />
              Hotkey Configuration
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="rounded-md border border-white/15 bg-white/10 px-2 py-1 text-sm">
                Ctrl
              </span>
              <span className="rounded-md border border-white/15 bg-white/10 px-2 py-1 text-sm">
                M
              </span>
              <span className="ml-2 text-sm text-white/70">
                Press to instantly mute viewer audio.
              </span>
            </div>
            <div className="mt-4 flex gap-3">
              <button className="rounded-lg bg-fuchsia-600 px-3 py-1.5 text-sm font-semibold">
                Panic Mute
              </button>
              <button className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-sm">
                One-click Ban
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Smarter Safety Network — fixed layout */}
      <section className="relative mx-auto max-w-6xl px-4 pb-20 text-center">
        <h2 className="text-3xl font-extrabold">A Smarter Safety Network.</h2>
        <p className="mt-3 text-white/80 max-w-2xl mx-auto">
          Bans propagate globally across linked identities. Trust scores and caller badges help you pre-screen at a glance.
        </p>
        <div className="mt-10">
          <TrustMonitor />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/60">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="CallSubs" className="h-7 w-7 rounded-full" />
              <span className="text-lg font-semibold">CallSubs</span>
            </div>
            <p className="mt-3 text-sm text-white/70">
              The safest way to connect with your fans live.
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold">Quick Links</div>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              <li>
                <Link href="/#features" className="hover:text-white">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:text-white">
                  Safety
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold">Resources</div>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              <li>
                <Link href="/faq" className="hover:text-white">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold">Stay Updated</div>
            <form className="mt-3 flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none placeholder:text-white/50"
              />
              <button
                type="submit"
                className="rounded-lg bg-gradient-to-r from-fuchsia-600 to-indigo-600 px-3 py-2 text-sm font-semibold"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
          © {new Date().getFullYear()} CallSubs. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
