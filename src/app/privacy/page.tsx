"use client";

import React from "react";
import PremiumFooter from "@/components/PremiumFooter";

export default function PrivacyPage() {
  
    const sections = [
        {
          id: "who-we-are",
          title: "1. Who We Are",
          content: (
            <>
              <p>CallSubs is operated by CallSubs Inc. For GDPR purposes, we act as the Data Controller of your personal information.</p>
              <ul className="list-none pl-0 mt-3 space-y-2">
                <li>Email: <a className="underline text-[#4B5FFF]" href="mailto:support@callsubs.com">support@callsubs.com</a></li>
                <li>Address: 127 Rue du Faubourg Saint-Honoré, 75008 Paris, France</li>
              </ul>
            </>
          ),
        },
        {
          id: "information-we-collect",
          title: "2. Information We Collect",
          content: (
            <>
              <h3 className="text-xl font-semibold mt-4">a) Information You Provide</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Account information (name, email, username)</li>
                <li>Payment details (via third-party processors)</li>
                <li>Profile and preferences</li>
                <li>Communications with support</li>
              </ul>
              <h3 className="text-xl font-semibold mt-6">b) Information Collected Automatically</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Device and connection details</li>
                <li>Usage data (logins, features used, call duration)</li>
                <li>Cookies and similar technologies</li>
              </ul>
              <h3 className="text-xl font-semibold mt-6">c) Information from Third Parties</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Payment providers (transaction confirmations)</li>
                <li>Social login integrations (if enabled)</li>
                <li>Fraud prevention and analytics services</li>
              </ul>
            </>
          ),
        },
        {
          id: "how-we-use",
          title: "3. How We Use Your Information",
          content: (
            <ul className="list-decimal pl-5 space-y-2">
              <li>Service delivery (operating Calls between Streamers and Viewers)</li>
              <li>Payments (processing transactions and preventing fraud)</li>
              <li>Safety and compliance (enforcing rules and legal obligations)</li>
              <li>Improvements (troubleshooting, analytics, feature development)</li>
              <li>Marketing (with consent where required)</li>
            </ul>
          ),
        },
        {
          id: "sharing",
          title: "4. How We Share Information",
          content: (
            <ul className="list-decimal pl-5 space-y-2">
              <li>Service providers (payments, hosting, analytics)</li>
              <li>Streamers/Viewers as needed for a Call</li>
              <li>Authorities when legally required</li>
              <li>Business transfers (e.g., acquisition or merger)</li>
            </ul>
          ),
        },
        {
          id: "transfers",
          title: "5. International Data Transfers",
          content: (
            <ul className="list-disc pl-5 space-y-2">
              <li>Transfers may occur outside the EU/UK.</li>
              <li>We use adequate safeguards such as SCCs and encryption.</li>
            </ul>
          ),
        },
        {
          id: "your-rights",
          title: "6. Your Rights",
          content: (
            <ul className="list-decimal pl-5 space-y-2">
              <li>Access, rectification, deletion</li>
              <li>Restriction or objection to processing</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
              <li>Lodge a complaint with your data authority</li>
            </ul>
          ),
        },
        {
          id: "retention",
          title: "7. Data Retention",
          content: <p>We retain data only as long as necessary for services, legal obligations, and dispute resolution, then delete or anonymize it.</p>,
        },
        {
          id: "cookies",
          title: "8. Cookies & Tracking",
          content: <p>We use cookies for essential operations, analytics, and (with consent) marketing. You can manage preferences via your browser or our consent tools.</p>,
        },
        {
          id: "security",
          title: "9. Security",
          content: <p>We use administrative, technical, and physical safeguards to protect information, but no system is 100% secure.</p>,
        },
        {
          id: "children",
          title: "10. Children’s Privacy",
          content: <p>CallSubs is not directed at individuals under 18. We do not knowingly collect data from minors.</p>,
        },
        {
          id: "changes",
          title: "11. Changes to This Policy",
          content: <p>We may update this policy. Material changes will be notified via email or in‑app notice. Continued use indicates acceptance.</p>,
        },
        {
          id: "contact",
          title: "12. Contact",
          content: (
            <ul className="list-none pl-0 space-y-2">
              <li>Privacy: <a className="underline text-[#4B5FFF]" href="mailto:support@callsubs.com">support@callsubs.com</a></li>
              <li>Address: 127 Rue du Faubourg Saint-Honoré, 75008 Paris, France</li>
            </ul>
          ),
        },
      ];
    
      return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#222] print:bg-white">
          <style>{`
            .legal-container { max-width: 900px; }
            .toc a { color: #4B5FFF; }
            .toc a:hover { text-decoration: underline; }
            .section-divider { border-top: 1px solid #E0E0E0; }
            @media print {
              .no-print { display: none !important; }
              a { color: #000 !important; text-decoration: underline; }
              body { background: #fff !important; }
            }
          `}</style>
    
          {/* Title */}
          <header className="w-full border-b border-[#E0E0E0] bg-white">
            <div className="mx-auto legal-container px-6 py-10">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#111]">Privacy Policy</h1>
              <p className="text-sm md:text-base text-[#666] mt-2">Effective Date: January 15, 2025</p>
            </div>
          </header>
    
          {/* Content + ToC */}
          <main className="mx-auto legal-container px-6 py-10 md:py-14 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-10">
            {/* ToC (desktop only) */}
            <aside className="hidden md:block">
              <div className="sticky top-24 toc">
                <div className="text-xs uppercase tracking-wider text-[#888] mb-3">On this page</div>
                <nav className="space-y-2 text-sm">
                  {sections.map(s => (
                    <a key={s.id} href={`#${s.id}`} className="block">
                      {s.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
    
            {/* Main content */}
            <article className="prose prose-slate max-w-none">
              {sections.map((s, idx) => (
                <section key={s.id} id={s.id} className="py-10 md:py-16 break-inside-avoid">
                  <h2 className="text-2xl font-semibold text-[#111] mb-4">{s.title}</h2>
                  <div className="text-[16.5px] leading-7 text-[#333]">{s.content}</div>
                  {idx < sections.length - 1 && <div className="mt-10 md:mt-14 section-divider" />}
                </section>
              ))}
            </article>
          </main>
    
          {/* Footer (hidden on print) */}
          <div className="no-print">
            <PremiumFooter />
          </div>
        </div>
      );
}