"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// ---------------- UI Primitives ----------------
function Button({
  children,
  onClick,
  href,
  variant = "primary",
  className = "",
}: any) {
  const base =
    "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition active:scale-[.98] shadow-[0_0_0_0_rgba(0,0,0,0)] hover:shadow-[0_0_25px_0_rgba(168,85,247,0.35)]";
  const variants: Record<string, string> = {
    primary:
      "bg-purple-500 text-white hover:bg-purple-600 focus:ring-2 focus:ring-purple-400/40",
    ghost:
      "bg-transparent border border-white/20 text-white hover:bg-white/10",
    outline: "border border-white/30 text-white hover:bg-white/10",
    subtle: "bg-white/5 text-white hover:bg-white/10 border border-white/10",
  };
  const cls = `${base} ${variants[variant]} ${className}`;
  if (href) return <a href={href} className={cls} onClick={onClick}>{children}</a>;
  return <button className={cls} onClick={onClick}>{children}</button>;
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium text-white/80 shadow-sm backdrop-blur">
      {children}
    </span>
  );
}

// ---------------- Icons ----------------
const IconTwitch = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
    <path fill="currentColor" d="M4 3h16v10.5l-4 4H12l-2 2H8v-2H4V3zm2 2v10h3v2l2-2h4.586L18 12.586V5H6zm8 2h2v5h-2V7zm-5 0h2v5H9V7z"/>
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
    <path fill="currentColor" d="M12 2l7 3v6c0 5-3.8 9.7-7 11-3.2-1.3-7-6-7-11V5l7-3z"/>
  </svg>
);
const IconMic = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
    <path fill="currentColor" d="M12 14a3 3 0 003-3V6a3 3 0 10-6 0v5a3 3 0 003 3zm-7-3h2a5 5 0 0010 0h2a7 7 0 01-6 6.92V21h3v2H8v-2h3v-3.08A7 7 0 015 11z"/>
  </svg>
);
const IconSpark = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
    <path fill="currentColor" d="M12 2l1.8 4.6L18 8l-4.2 1.4L12 14l-1.8-4.6L6 8l4.2-1.4L12 2zM5 16l1.2 3 3 1.2-3 1.2L5 24l-1.2-2.6L1 20.2l2.8-1.2L5 16zm14 0l1.2 3 3 1.2-3 1.2L19 24l-1.2-2.6-2.8-1.2 2.8-1.2L19 16z"/>
  </svg>
);
const IconAnalytics = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
    <path fill="currentColor" d="M3 3h2v18H3V3zm4 10h2v8H7v-8zm4-6h2v14h-2V7zm4 4h2v10h-2V11zm4-8h2v18h-2V3z"/>
  </svg>
);

// ---------------- Background / Effects ----------------
function NeonBg() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Parallax blobs */}
      <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-purple-500/30 blur-3xl will-change-transform animate-pulse" />
      <div className="absolute -right-24 -bottom-32 h-96 w-96 rounded-full bg-indigo-500/25 blur-3xl will-change-transform" />
      <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(99,102,241,0.15),transparent_45%),radial-gradient(circle_at_100%_100%,rgba(236,72,153,0.12),transparent_40%),linear-gradient(to_bottom,rgba(0,0,0,0.55),rgba(0,0,0,0.9))]" />
    </div>
  );
}

export default function HomePage() {
  const { status } = useSession();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const widgetUrl = `https://callsubs.app/widget/yourchannel`;

  // Auth redirect
  useEffect(() => {
    if (status === "authenticated") router.push("/dashboard");
  }, [status, router]);

  // Header scroll state
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto" />
          <p className="mt-4 text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      <NeonBg />

      {/* ---------------- Header ---------------- */}
      <header
        className={[
          "sticky top-0 z-20 backdrop-blur transition",
          scrolled ? "bg-black/50 border-b border-white/10 shadow-[0_5px_30px_-10px_rgba(168,85,247,0.25)]" : "bg-black/30 border-b border-white/10",
        ].join(" ")}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="#" className="flex items-center gap-2">
            <img src="/logo.png" alt="CallSubs Logo" className="h-8 w-8 drop-shadow-[0_0_12px_rgba(168,85,247,0.45)]" />
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

      {/* ---------------- Hero ---------------- */}
      <section className="relative">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <Badge><IconShield /> Premium sub experience</Badge>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Make your subs
              <br className="hidden md:block" />
              feel like <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">VIPs</span>.
            </h1>
            <p className="mt-4 max-w-xl text-base text-white/70 md:text-lg">
              CallSubs turns ordinary subscriptions into <span className="text-white">exclusive live moments</span> —
              tier-gated, safe, and effortless. Reward loyalty. Grow MRR. Stay in control.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button onClick={() => signIn("twitch", { callbackUrl: "/dashboard" })} className="gap-2">
                <IconTwitch /> Get Early Access
              </Button>
              <Button variant="outline" href="#how">Watch Demo</Button>
            </div>
            <div className="mt-6 flex items-center gap-4 text-xs text-white/60">
              <div className="flex items-center gap-2"><IconShield /> Sub-only access</div>
              <div className="flex items-center gap-2"><IconMic /> Audio-only, no trolls</div>
              <div className="flex items-center gap-2"><IconAnalytics /> Built to grow MRR</div>
            </div>
          </div>

          {/* Glass UI mockup */}
          <div className="relative">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur">
              <div className="flex items-center justify-between border-b border-white/10 p-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                  <span className="text-sm font-semibold text-white">Live Queue</span>
                </div>
                <Button variant="subtle" className="px-3 py-1 text-xs">End call</Button>
              </div>
              <div className="divide-y divide-white/5">
                {[
                  { name: "@tier3_legend", tier: "Tier 3", waiting: "00:12" },
                  { name: "@prime_gifter", tier: "Prime", waiting: "01:31" },
                  { name: "@tier1_fan", tier: "Tier 1", waiting: "02:09" },
                ].map((u, i) => (
                  <div key={i} className="flex items-center justify-between p-3 hover:bg-white/[.03] rounded-2xl transition">
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
              {/* Tier gate preview */}
              <div className="mt-3 rounded-2xl border border-white/10 p-3 text-xs text-white/70">
                <div className="mb-2 font-semibold text-white">Minimum subscription tier</div>
                <div className="flex gap-2">
                  {["Tier 1", "Tier 2", "Tier 3"].map((t, i) => (
                    <button
                      key={t}
                      className={`rounded-xl px-3 py-1 border text-xs ${
                        i === 2
                          ? "border-purple-400/40 bg-purple-400/10"
                          : "border-white/15 hover:bg-white/5"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* Glow ring */}
            <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[32px] shadow-[0_0_80px_0_rgba(168,85,247,0.25)]" />
          </div>
        </div>
      </section>

      {/* ---------------- Why / Value ---------------- */}
      <section id="features" className="relative border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Subs aren’t just numbers. They’re your community.</h2>
          <p className="mt-3 max-w-2xl text-white/70">
            Emotes and badges are nice — but they don’t change behavior. CallSubs gives followers a reason to subscribe (or upgrade)
            with <span className="text-white">premium, controlled moments</span> that feel unforgettable.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Control",
                desc: "Tier-gate access, set duration, price, and availability. One-tap accept or skip.",
                icon: <IconShield />,
              },
              {
                title: "Incentivize",
                desc: "Turn followers into subs — and subs into Tier 2/3 — with real, exclusive access.",
                icon: <IconSpark />,
              },
              {
                title: "Monetize",
                desc: "More subs = stable MRR. Design perks that grow loyalty without chaos.",
                icon: <IconAnalytics />,
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group rounded-3xl border border-white/10 bg-white/[.04] p-5 backdrop-blur transition hover:bg-white/[.06] hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]"
              >
                <div className="flex items-center gap-2 text-white/80">{f.icon}<span className="text-sm font-semibold">{f.title}</span></div>
                <p className="mt-2 text-sm text-white/70">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- How it works ---------------- */}
      <section id="how" className="relative border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Go live. Stay in control.</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-4">
            {[
              { step: "01", title: "Set rules", desc: "Choose tiers, time limits, and price." },
              { step: "02", title: "Share link", desc: "Your subs request access from your widget." },
              { step: "03", title: "Accept / skip", desc: "One-tap control with safety tools built in." },
              { step: "04", title: "Create moments", desc: "Clippable, memorable VIP interactions." },
            ].map((s) => (
              <div key={s.step} className="rounded-3xl border border-white/10 p-5 bg-white/[.04]">
                <div className="text-xs text-white/50">{s.step}</div>
                <div className="mt-1 font-semibold">{s.title}</div>
                <div className="mt-1 text-sm text-white/70">{s.desc}</div>
              </div>
            ))}
          </div>

          {/* Demo block (placeholder) */}
          <div className="mt-10 rounded-3xl border border-white/10 p-4 bg-white/[.03] backdrop-blur">
            <div className="aspect-video w-full rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/0 grid place-items-center text-white/60 text-sm">
              Demo video placeholder — drop your MP4 here
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Pricing (placeholder) ---------------- */}
      <section id="pricing" className="relative border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Simple, creator-first pricing.</h2>
          <p className="mt-2 text-white/70">Transparent. No lock-in. Built to grow with you.</p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { name: "Starter", price: "Free", desc: "Test with Tier 1 subs, basic controls." },
              { name: "Creator", price: "$9/mo", desc: "Tier gating, queue controls, overlay tools." },
              { name: "Pro", price: "$29/mo", desc: "Priority support, advanced analytics, VIP perks." },
            ].map((p, i) => (
              <div
                key={p.name}
                className={`rounded-3xl border p-6 backdrop-blur ${
                  i === 1
                    ? "border-purple-400/40 bg-purple-400/10 shadow-[0_0_50px_rgba(168,85,247,0.15)]"
                    : "border-white/10 bg-white/[.04]"
                }`}
              >
                <div className="text-sm font-semibold">{p.name}</div>
                <div className="mt-2 text-3xl font-extrabold">{p.price}</div>
                <div className="mt-2 text-sm text-white/70">{p.desc}</div>
                <Button className="mt-5 w-full">Choose {p.name}</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Link copy ---------------- */}
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

      {/* ---------------- CTA Footer ---------------- */}
      <footer className="mt-16 border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center">
          <h3 className="text-xl md:text-2xl font-bold">
            Start rewarding your most loyal fans. Make your subs matter.
          </h3>
          <div className="mt-5 flex items-center justify-center gap-3">
            <Button onClick={() => signIn("twitch", { callbackUrl: "/dashboard" })} className="gap-2">
              <IconTwitch /> Get Early Access
            </Button>
            <Button variant="ghost" href="#how">How it works</Button>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-white/50">
            <img src="/logo.png" alt="CallSubs Logo" className="h-4 w-4 opacity-80" />
            <span>© {new Date().getFullYear()} CallSubs. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
