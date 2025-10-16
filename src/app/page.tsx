"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import IntroSplash from "@/components/IntroSplash"; 
import PlatformBanner from "@/components/PlatformBanner";

// --- Simple UI primitives (Tailwind-based) ---
function Button({ children, onClick, href, variant = "primary", className = "" }: any) {
  const base =
    "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold shadow-sm transition active:scale-[.98]";
  const variants: Record<string, string> = {
    primary:
      "bg-black text-white hover:bg-neutral-800 focus:ring-2 focus:ring-black/40",
    ghost:
      "bg-white/70 backdrop-blur text-black hover:bg-white/90 border border-black/10",
    outline:
      "border border-black/20 text-black hover:bg-black/5",
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

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const widgetUrl = `https://callsubs.app/widget/yourchannel`;

  // 🔐 Redirect to dashboard if user is authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
      console.log("User is authenticated, redirecting to dashboard");
    }
  }, [status, router]);

  // 🌀 Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 text-neutral-900">
      {/* 🌿 Nav */}
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <img
              src="/logo.png" // 👈 replace with your Viking logo path
              alt="CallSubs Logo"
              className="h-8 w-8"
            />
            <span className="text-lg font-semibold tracking-tight">CallSubs</span>
          </a>

          {/* Nav links */}
          <nav className="hidden items-center gap-6 md:flex">
            <a href="#features" className="text-sm text-neutral-700 hover:text-black transition">
              Features
            </a>
            <a href="#how" className="text-sm text-neutral-700 hover:text-black transition">
              How it works
            </a>
            <a href="#pricing" className="text-sm text-neutral-700 hover:text-black transition">
              Pricing
            </a>
          </nav>

          {/* Auth / CTA */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" href="#pricing">
              Pricing
            </Button>
            <Button onClick={() => signIn("twitch", { callbackUrl: "/dashboard" })} className="gap-2">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                <path fill="currentColor" d="M4 3h16v10.5l-4 4H12l-2 2H8v-2H4V3zm2 2v10h3v2l2-2h4.586L18 12.586V5H6zm8 2h2v5h-2V7zm-5 0h2v5H9V7z"/>
              </svg>
              <span>Sign in with Twitch</span>
            </Button>
          </div>
        </div>
      </header>

      {/* 🧠 Hero Section */}
      <IntroSplash onCtaClick={() => signIn("twitch", { callbackUrl: "/dashboard" })} />

      <PlatformBanner />

      {/* 📝 Copy link section */}
      <div className="mt-10 flex flex-wrap items-center gap-3 px-4 max-w-6xl mx-auto">
        <code className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm shadow-sm">
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
