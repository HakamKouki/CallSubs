
import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function JoinDiscordSection() {
  // Removed: handleJoin (no longer needed since left CTA is gone)
  const inviteUrl = "https://discord.gg/mzNyvwyVrF"; // updated link
  const [copied, setCopied] = useState(false);

  return (
    <section className="relative overflow-hidden">
      <style>{`
        .cs-discord-bg {
          background:
            radial-gradient(1000px 420px at 50% -120px, rgba(124,58,237,0.25), rgba(124,58,237,0) 60%),
            radial-gradient(800px 320px at 50% 110%, rgba(147,51,234,0.18), rgba(147,51,234,0) 65%),
            linear-gradient(135deg, #0b0f1a 0%, #111126 35%, #1a0d3a 100%);
        }
        .cs-discord-glow {
          box-shadow: 0 12px 40px rgba(147,51,234,0.18), inset 0 0 0 1px rgba(255,255,255,0.06);
        }
        .cs-logo-hover:hover {
          transform: translateY(-2px) scale(1.03);
          filter: drop-shadow(0 0 18px rgba(168,85,247,0.45));
        }
        @keyframes cs-fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Background */}
      <div className="cs-discord-bg absolute inset-0" />

      {/* Subtle purple accent ribbons */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[70vw] max-w-5xl h-40 rounded-full blur-3xl opacity-30"
             style={{ background: "radial-gradient(closest-side, rgba(147,51,234,0.35), rgba(147,51,234,0) 70%)" }} />
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[60vw] max-w-4xl h-36 rounded-full blur-3xl opacity-25"
             style={{ background: "radial-gradient(closest-side, rgba(168,85,247,0.3), rgba(168,85,247,0) 70%)" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left: Text (CTA removed) */}
          <div style={{ animation: "cs-fade-up .6s ease forwards" }}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              Join Our Streamer Community on Discord!
            </h2>
            <p className="mt-4 text-white/80 text-base sm:text-lg max-w-xl">
              Connect with fellow streamers, get updates, share tips, and grow your CallSubs network.
            </p>

            <ul className="mt-6 space-y-3 text-white/85">
              {[
                "Get real-time support from the team.",
                "Share your experiences with other streamers.",
                "Exclusive updates and early access to new features."
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-blue-400 ring-2 ring-blue-300/30" />
                  <span className="text-sm sm:text-base">{item}</span>
                </li>
              ))}
            </ul>

            {/* Removed left-side CTA and helper text to keep only the widget button on the right */}
          </div>

          {/* Right: Visual (kept primary Join button here) */}
          <div className="relative">
            <div className="mx-auto w-full max-w-sm rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 cs-discord-glow">
              <div className="flex items-center justify-center">
                {/* Discord logo (white) */}
                <img
                  src="https://cdn.worldvectorlogo.com/logos/discord-6.svg"
                  alt="Discord"
                  className="h-16 w-16 p-2 rounded-xl bg-white/5 border border-white/10 transition-all duration-300 cs-logo-hover"
                />
              </div>

              {/* Invite preview (interactive) */}
              <div className="mt-6 space-y-3">
                {/* Server row */}
                <div className="flex items-center justify-center gap-3">
                  {/* UPDATED: square icon uses current logo + pure black bg */}
                  <div className="h-10 w-10 rounded-xl bg-black border border-white/10 flex items-center justify-center">
                    <img
                      src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/688a6f696ca6741f805e95d3/6c4dbd763_Designsanstitre.png"
                      alt="CallSubs"
                      className="h-6 w-6 object-contain"
                    />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-white">CallSubs</div>
                    <div className="text-xs text-white/70">Streamer Community</div>
                  </div>
                </div>
                {/* Invite link pill with copy */}
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="w-full truncate rounded-md bg-black/20 border border-white/10 px-3 py-2 text-sm text-white/90">
                        {inviteUrl.replace(/^https?:\/\//, '')}
                      </div>
                    </div>
                    <button
                      aria-label={copied ? "Copied" : "Copy invite link"}
                      className="shrink-0 h-9 w-9 grid place-items-center rounded-md bg-white/10 border border-white/15 hover:bg-white/15 transition"
                      onClick={() => {
                        navigator.clipboard.writeText(inviteUrl);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1500);
                      }}
                    >
                      {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-white/90" />}
                    </button>
                  </div>
                  <div className="mt-2 text-[11px] text-white/60">Official CallSubs invite</div>
                </div>
              </div>

              {/* Keep only this primary button */}
              <a
                href={inviteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 block text-center px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-fuchsia-600 via-purple-600 to-cyan-400
                           hover:scale-[1.02] transition-transform border border-blue-400/40"
                aria-label="Join our Discord server"
              >
                Join Our Discord
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
