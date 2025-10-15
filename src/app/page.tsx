"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// --- Simple UI primitives (Tailwind-based) ---
function Button({ children, onClick, href, variant = "primary", className = "" }: any) {
  const base =
    "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold shadow-sm transition active:scale-[.98]";
  const variants: Record<string, string> = {
    primary:
      "bg-purple-500 text-white hover:bg-purple-600 focus:ring-2 focus:ring-purple-400/40",
    ghost:
      "bg-transparent border border-white/20 text-white hover:bg-white/10",
    outline:
      "border border-white/30 text-white hover:bg-white/10",
  };
  const cls = `${base} ${variants[variant]} ${className}`;
  if (href) {
    return (
      <a href={href} className={cls} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <button className={cls} onClick={onClick}>
      {children}
    </button>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/70 shadow-sm backdrop-blur">
      {children}
    </span>
  );
}

// --- Icons (inline SVG to avoid extra deps) ---
const IconTwitch = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
    <path
      fill="currentColor"
      d="M4 3h16v10.5l-4 4H12l-2 2H8v-2H4V3zm2 2v10h3v2l2-2h4.586L18 12.586V5H6zm8 2h2v5h-2V7zm-5 0h2v5H9V7z"
    />
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
    <path
      fill="currentColor"
      d="M12 2l7 3v6c0 5-3.8 9.7-7 11-3.2-1.3-7-6-7-11V5l7-3z"
    />
  </svg>
);
const IconMic = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
    <path
      fill="currentColor"
      d="M12 14a3 3 0 003-3V6a3 3 0 10-6 0v5a3 3 0 003 3zm-7-3h2a5 5 0 0010 0h2a7 7 0 01-6 6.92V21h3v2H8v-2h3v-3.08A7 7 0 015 11z"
    />
  </svg>
);
const IconSpark = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
    <path
      fill="currentColor"
      d="M12 2l1.8 4.6L18 8l-4.2 1.4L12 14l-1.8-4.6L6 8l4.2-1.4L12 2zM5 16l1.2 3 3 1.2-3 1.2L5 24l-1.2-2.6L1 20.2l2.8-1.2L5 16zm14 0l1.2 3 3 1.2-3 1.2L19 24l-1.2-2.6-2.8-1.2 2.8-1.2L19 16z"
    />
  </svg>
);
const IconAnalytics = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
    <path
      fill="currentColor"
      d="M3 3h2v18H3V3zm4 10h2v8H7v-8zm4-6h2v14h-2V7zm4 4h2v10h-2V11zm4-8h2v18h-2V3z"
    />
  </svg>
);

// --- Hero background ---
function NeonBg() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-purple-500/30 blur-3xl" />
      <div className="absolute -right-32 -bottom-40 h-96 w-96 rounded-full bg-indigo-500/30 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,0,0,0)_0,rgba(0,0,0,0.5)_60%,rgba(0,0,0,0.9)_100%)]" />
    </div>
  );
}

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const widgetUrl = `https://callsubs.app/widget/yourchannel`;

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      <NeonBg />

      {/* HEADER */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/40 backdrop-blur text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="#" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="CallSubs Logo"
              className="h-8 w-8"
            />
            <span className="text-lg font-semibold tracking-tight">CallSubs</span>
          </a>
          <nav className="hidden items-center gap-6 md:flex">
            <a href="#features" className="text-sm text-white/70 hover:text-white transition">Features</a>
            <a href="#how" className="text-sm text-white/70 hover:text-white transition">How it works</a>
            <a href="#pricing" className="text-sm text-white/70 hover:text-white transition">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" href="#pricing">Pricing</Button>
            <Button onClick={() => signIn("twitch", { callbackUrl: "/dashboard" })} className="gap-2 bg-purple-500 hover:bg-purple-600">
              <IconTwitch />
              <span>Sign in with Twitch</span>
            </Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <Badge>
              <IconShield /> Premium sub experience
            </Badge>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Give your
              <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent"> subs </span>
              something worth it
            </h1>
            <p className="mt-4 max-w-xl text-base text-white/70 md:text-lg">
              Tier-gated voice interactions that reward your most loyal viewers. More subs. More loyalty. You stay in control.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button onClick={() => signIn("twitch", { callbackUrl: '/dashboard' })} className="gap-2">
                <IconTwitch /> Enable for my channel
              </Button>
              <Button variant="outline" href="#how">See how it works</Button>
            </div>
            <div className="mt-6 flex items-center gap-4 text-xs text-white/50">
              <div className="flex items-center gap-2"><IconShield /> Safe, sub-only access</div>
              <div className="flex items-center gap-2"><IconMic /> Audio-only. No trolls.</div>
            </div>
          </div>

          {/* Mocked dashboard */}
          <div className="relative">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur">
              <div className="flex items-center justify-between border-b border-white/10 p-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-sm font-semibold text-white">Live Queue</span>
                </div>
                <Button variant="ghost" className="px-3 py-1 text-xs">End call</Button>
              </div>
              <div className="divide-y divide-white/5">
                {[
                  { name: "@tier3_legend", tier: "Tier 3", waiting: "00:12" },
                  { name: "@prime_gifter", tier: "Prime", waiting: "01:31" },
                  { name: "@tier1_fan", tier: "Tier 1", waiting: "02:09" },
                ].map((u, i) => (
                  <div key={i} className="flex items-center justify-between p-3">
                    <div>
                      <div className="text-sm font-semibold text-white">{u.name}</div>
                      <div className="text-xs text-white/50">{u.tier} • waiting {u.waiting}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" className="px-3 py-1 text-xs">Kick</Button>
                      <Button className="px-3 py-1 text-xs bg-purple-500 hover:bg-purple-600">Accept</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Copy link */}
      <div className="mt-10 flex flex-wrap items-center gap-3 px-4 max-w-6xl mx-auto">
        <code className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white shadow-sm">
          {widgetUrl}
        </code>
        <Button
          variant="outline"
          onClick={() => {
            navigator.clipboard.writeText(widgetUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          {copied ? "Copied!" : "Copy link"}
        </Button>
      </div>
    </div>
  );
}