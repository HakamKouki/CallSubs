"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// ---------- UI ----------
function Button({ children, onClick, href, variant = "primary", className = "" }: any) {
  const base =
    "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition active:scale-[.98] focus:outline-none";
  const variants: Record<string, string> = {
    primary:
      "bg-purple-500 text-white hover:bg-purple-600 shadow-[0_0_15px_rgba(168,85,247,0.4)]",
    ghost:
      "bg-transparent border border-black/10 text-black hover:bg-black/5",
    outline:
      "border border-black/10 text-black hover:bg-black/5",
    dark:
      "bg-black text-white hover:bg-neutral-900",
  };
  const cls = `${base} ${variants[variant]} ${className}`;
  if (href) return <a href={href} className={cls}>{children}</a>;
  return <button onClick={onClick} className={cls}>{children}</button>;
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-3 py-1 text-[11px] font-medium text-black/70 shadow-sm backdrop-blur">
      {children}
    </span>
  );
}

// ---------- Icons ----------
const IconTwitch = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5">
    <path fill="currentColor" d="M4 3h16v10.5l-4 4H12l-2 2H8v-2H4V3zm2 2v10h3v2l2-2h4.586L18 12.586V5H6zm8 2h2v5h-2V7zm-5 0h2v5H9V7z"/>
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4">
    <path fill="currentColor" d="M12 2l7 3v6c0 5-3.8 9.7-7 11-3.2-1.3-7-6-7-11V5l7-3z"/>
  </svg>
);
const IconMic = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4">
    <path fill="currentColor" d="M12 14a3 3 0 003-3V6a3 3 0 10-6 0v5a3 3 0 003 3zm-7-3h2a5 5 0 0010 0h2a7 7 0 01-6 6.92V21h3v2H8v-2h3v-3.08A7 7 0 015 11z"/>
  </svg>
);
const IconAnalytics = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4">
    <path fill="currentColor" d="M3 3h2v18H3V3zm4 10h2v8H7v-8zm4-6h2v14h-2V7zm4 4h2v10h-2V11zm4-8h2v18h-2V3z"/>
  </svg>
);

// ---------- Background ----------
function GradientBg() {
  return (
    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-black via-neutral-900 to-neutral-100" />
  );
}

export default function HomePage() {
  const { status } = useSession();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const widgetUrl = `https://callsubs.app/widget/yourchannel`;

  useEffect(() => {
    if (status === "authenticated") router.push("/dashboard");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-neutral-100">
        <div className="text-center text-black">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <GradientBg />

      {/* ---------- Header ---------- */}
      <header className="sticky top-0 z-20 border-b border-black/10 bg-white/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="#" className="flex items-center gap-2">
            <img src="/logo.png" alt="CallSubs Logo" className="h-8 w-8" />
            <span className="text-lg font-semibold tracking-tight">CallSubs</span>
          </a>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-neutral-700 hover:text-black transition">Features</a>
            <a href="#how" className="text-sm text-neutral-700 hover:text-black transition">How it works</a>
            <a href="#pricing" className="text-sm text-neutral-700 hover:text-black transition">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" href="#pricing">Pricing</Button>
            <Button onClick={() => signIn("twitch", { callbackUrl: "/dashboard" })} className="gap-2">
              <IconTwitch />
              <span>Sign in with Twitch</span>
            </Button>
          </div>
        </div>
      </header>

      {/* ---------- Hero ---------- */}
      <section className="relative bg-gradient-to-b from-neutral-950 via-neutral-800 to-white text-white">
        <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-12 px-4 py-20">
          <div>
            <Badge><IconShield /> Premium Sub Experience</Badge>
            <h1 className="mt-4 text-5xl font-extrabold leading-tight tracking-tight text-white">
              Make your subs
              <br /> feel like VIPs.
            </h1>
            <p className="mt-4 text-neutral-200 max-w-lg">
              CallSubs turns ordinary subscriptions into exclusive live interactions that feel personal and premium.
            </p>
            <div className="mt-6 flex gap-3 flex-wrap">
              <Button onClick={() => signIn("twitch", { callbackUrl: '/dashboard' })} className="gap-2">
                <IconTwitch /> Get Early Access
              </Button>
              <Button variant="ghost" href="#how">See How It Works</Button>
            </div>
            <div className="mt-6 flex gap-4 text-xs text-neutral-200">
              <div className="flex gap-2 items-center"><IconShield /> Sub-only access</div>
              <div className="flex gap-2 items-center"><IconMic /> No trolls</div>
              <div className="flex gap-2 items-center"><IconAnalytics /> Boost MRR</div>
            </div>
          </div>
          <div className="bg-white rounded-3xl shadow-lg p-4 text-black">
            <h3 className="font-semibold mb-3">Live Queue Preview</h3>
            {["@tier3_legend", "@prime_gifter", "@tier1_fan"].map((name, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-t border-neutral-200 first:border-t-0">
                <div>
                  <div className="font-semibold">{name}</div>
                  <div className="text-xs text-neutral-500">Tier {i+1} • waiting 00:{i+12}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="px-3 py-1 text-xs">Kick</Button>
                  <Button className="px-3 py-1 text-xs">Accept</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Features ---------- */}
      <section id="features" className="bg-white text-black py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold tracking-tight">Why CallSubs?</h2>
          <p className="mt-2 text-neutral-600 max-w-xl">Emotes are nice. Real perks are better. Give your community a reason to subscribe or upgrade.</p>

          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {[
              { title: "Control", desc: "Tier gating, time limits, one-tap accept.", icon: <IconShield /> },
              { title: "Incentivize", desc: "Convert followers to subs with real perks.", icon: <IconMic /> },
              { title: "Monetize", desc: "Grow stable monthly recurring revenue.", icon: <IconAnalytics /> },
            ].map((f) => (
              <div key={f.title} className="p-6 rounded-2xl border border-neutral-200 bg-white shadow-sm hover:shadow-lg transition">
                <div className="flex items-center gap-2 mb-2 text-purple-500">{f.icon}<span className="font-semibold">{f.title}</span></div>
                <p className="text-sm text-neutral-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA Footer ---------- */}
      <footer className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-center py-16 mt-0">
        <h3 className="text-2xl font-bold">Start rewarding your most loyal fans.</h3>
        <p className="mt-2 opacity-90">Make your subs matter.</p>
        <div className="mt-5 flex justify-center gap-3">
          <Button onClick={() => signIn("twitch", { callbackUrl: '/dashboard' })} className="gap-2 bg-white text-black hover:bg-neutral-100">
            <IconTwitch /> Get Early Access
          </Button>
          <Button variant="ghost" href="#how" className="border-white text-white hover:bg-white/10">How it works</Button>
        </div>
        <div className="mt-6 text-xs opacity-80 flex justify-center gap-2 items-center">
          <img src="/logo.png" alt="logo" className="h-4 w-4" />
          © {new Date().getFullYear()} CallSubs. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
