"use client";

import React, { useState } from "react";
import { Instagram, Twitter, Mail } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function PremiumFooter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{ loading: boolean; ok: boolean; error: string }>({
    loading: false,
    ok: false,
    error: "",
  });

  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setStatus({ loading: false, ok: false, error: "Please enter a valid email." });
      return;
    }
    setStatus({ loading: true, ok: false, error: "" });

    try {
      // ✅ TEMP MOCK: In production, replace with your API call to SendEmail
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setStatus({ loading: false, ok: true, error: "" });
      setEmail("");
    } catch {
      setStatus({ loading: false, ok: false, error: "Something went wrong. Please try again." });
    }
  };

  const linkClasses =
    "text-white/80 hover:text-purple-200 transition-colors text-sm hover:[text-shadow:0_0_10px_rgba(168,85,247,0.45)]";
  const iconClasses = "h-5 w-5 text-white/80 hover:text-purple-200 transition-colors";

  return (
    <footer className="relative text-white overflow-hidden">
      <style>{`
        .cs-footer-bg {
          background:
            radial-gradient(900px 360px at 50% -140px, rgba(124,58,237,0.22), rgba(124,58,237,0) 60%),
            radial-gradient(800px 320px at 50% 115%, rgba(59,130,246,0.16), rgba(59,130,246,0) 65%),
            linear-gradient(135deg, #000000 0%, #0a0d1a 45%, #130a2a 100%);
        }
        .cs-footer-divider {
          height: 1px;
          background: linear-gradient(to right, rgba(124,58,237,0.28), rgba(59,130,246,0.28), rgba(124,58,237,0.28));
          box-shadow: 0 0 12px rgba(124,58,237,0.28);
        }
        .cs-top-glow-line {
          background: linear-gradient(90deg, rgba(124,58,237,0.28), rgba(59,130,246,0.28), rgba(124,58,237,0.28));
          box-shadow: 0 -6px 28px rgba(124,58,237,0.28);
        }
      `}</style>

      {/* Top glow line */}
      <div className="cs-top-glow-line absolute top-0 left-0 right-0 h-[1px]" />

      {/* Background */}
      <div className="cs-footer-bg absolute inset-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Brand block */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-lg bg-white/5 border border-white/10 shadow-[0_0_22px_rgba(168,85,247,0.35)]">
                <img
                  src="/logo.svg"
                  alt="CallSubs Logo"
                  className="h-9 w-9"
                />
              </div>
              <span className="text-xl font-bold">CallSubs</span>
            </div>
            <p className="mt-3 text-white/70 text-sm max-w-sm">
              The safest way to connect with your fans live.
            </p>

            {/* Socials */}
            <div className="mt-5 flex items-center gap-4">
              <a
                href="https://www.instagram.com/callsubstv/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram className={iconClasses} />
              </a>
              <a
                href="https://x.com/Call_Subs"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter/X"
              >
                <Twitter className={iconClasses} />
              </a>
              <a
                href="https://discord.gg/mzNyvwyVrF"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discord"
              >
                <img
                  src="https://cdn.worldvectorlogo.com/logos/discord-6.svg"
                  alt="Discord"
                  className="h-5 w-5 transition-opacity hover:opacity-100"
                  style={{ filter: "brightness(0) invert(1)", opacity: 0.8 }}
                />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white/80">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#how-it-works" className={linkClasses}>Features</a></li>
                <li><a href="/safety" className={linkClasses}>Safety</a></li>
                <li><a href="/terms" className={linkClasses}>Terms of Service</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white/80">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#faq" className={linkClasses}>FAQs</a></li>
                <li><a href="/privacy" className={linkClasses}>Privacy Policy</a></li>
                <li><a href="/contact" className={linkClasses}>Contact</a></li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4">
            <h4 className="text-sm font-semibold text-white/80">Stay Updated</h4>
            <p className="mt-2 text-white/70 text-sm">
              Join our newsletter for product updates and tips.
            </p>
            <form onSubmit={handleSignup} className="mt-4 flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  type="email"
                  aria-label="Email address"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 bg-white/10 border-white/15 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400/60 focus:border-purple-300/40"
                />
              </div>
              <Button
                type="submit"
                disabled={status.loading}
                className="shrink-0 rounded-full px-5 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 hover:opacity-95 hover:shadow-[0_0_24px_rgba(168,85,247,0.35),0_0_28px_rgba(147,51,234,0.25)]"
              >
                {status.loading ? "Signing..." : "Sign Up"}
              </Button>
            </form>
            {status.error && (
              <p className="mt-2 text-rose-300 text-xs">{status.error}</p>
            )}
            {status.ok && (
              <p className="mt-2 text-emerald-300 text-xs">
                Thanks! Check your inbox for a confirmation.
              </p>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 w-full cs-footer-divider" />

        {/* Bottom legal */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} CallSubs. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="/terms" className="text-xs text-white/60 hover:text-purple-200 hover:[text-shadow:0_0_10px_rgba(168,85,247,0.45)] transition-colors">
              Terms
            </a>
            <a href="/privacy" className="text-xs text-white/60 hover:text-purple-200 hover:[text-shadow:0_0_10px_rgba(168,85,247,0.45)] transition-colors">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
