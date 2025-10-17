"use client";

import React from "react";
import PremiumFooter from "@/components/PremiumFooter";

export default function TermsPage() {
  
  const sections = [
    {
      id: "definitions",
      title: "1. Definitions",
      content: (
        <ul className="list-decimal pl-5 space-y-2">
          <li><strong>CallSubs</strong>, <strong>we</strong>, <strong>our</strong>, or <strong>us</strong> refers to CallSubs Inc., operator of the Platform.</li>
          <li><strong>Platform</strong> means our website, applications, and services.</li>
          <li><strong>Streamer</strong> means a creator who uses CallSubs to receive paid calls from viewers.</li>
          <li><strong>Viewer</strong> means a user who pays to participate in calls with Streamers.</li>
          <li><strong>User</strong> means any individual using the Platform (including Streamers and Viewers).</li>
          <li><strong>Call</strong> means a live voice interaction facilitated via CallSubs between a Streamer and a Viewer.</li>
        </ul>
      ),
    },
    {
      id: "eligibility",
      title: "2. Eligibility",
      content: (
        <ul className="list-decimal pl-5 space-y-2">
          <li>You must be at least 18 years old (or the age of majority in your jurisdiction).</li>
          <li>You represent that you have legal capacity to enter into a binding agreement.</li>
          <li>We may suspend or terminate access if eligibility requirements are not met.</li>
        </ul>
      ),
    },
    {
      id: "accounts",
      title: "3. Accounts",
      content: (
        <ul className="list-decimal pl-5 space-y-2">
          <li>Provide accurate and complete information when creating an account.</li>
          <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
          <li>You are responsible for all activity under your account; notify us of suspected unauthorized use.</li>
        </ul>
      ),
    },
    {
      id: "platform",
      title: "4. The Platform",
      content: (
        <ul className="list-decimal pl-5 space-y-2">
          <li>CallSubs provides a marketplace enabling Viewers to purchase access to Calls with Streamers.</li>
          <li>We do not control or monitor the content of Calls except for compliance and security purposes.</li>
          <li>We do not guarantee the availability, quality, or duration of any Call.</li>
        </ul>
      ),
    },
    {
      id: "payments-fees",
      title: "5. Payments & Fees",
      content: (
        <ul className="list-decimal pl-5 space-y-2">
          <li>Payments are processed by third-party providers (e.g., Stripe). You agree to their terms.</li>
          <li>Streamers set prices. Amounts are shown before purchase.</li>
          <li>Payments are charged at booking/checkout. Fees and taxes may apply.</li>
          <li>Refunds are generally not provided except as stated in Section 6.</li>
          <li>CallSubs may deduct service fees and applicable taxes from payments to Streamers.</li>
        </ul>
      ),
    },
    {
      id: "refunds-disputes",
      title: "6. Refunds & Disputes",
      content: (
        <>
          <p className="mb-3"><strong>All sales are final.</strong> Exceptions may be granted if:</p>
          <ul className="list-decimal pl-5 space-y-2">
            <li>A Call did not take place due to technical issues attributable to CallSubs; or</li>
            <li>Fraudulent activity is detected.</li>
          </ul>
          <p className="mt-3">Disputes regarding conduct or content of a Call are generally outside our responsibility.</p>
        </>
      ),
    },
    {
      id: "conduct",
      title: "7. User Conduct",
      content: (
        <>
          <p className="mb-3">You agree not to use the Platform to:</p>
          <ul className="list-decimal pl-5 space-y-2">
            <li>Engage in harassment, hate speech, threats, or unlawful content.</li>
            <li>Share sexual, pornographic, violent, or otherwise inappropriate material.</li>
            <li>Infringe intellectual property or privacy rights of others.</li>
            <li>Attempt to bypass security, hack, or disrupt the Platform.</li>
            <li>Engage in scams, fraud, or deceptive practices.</li>
          </ul>
          <p className="mt-3"><strong>Streamers</strong> are responsible for Call content; <strong>Viewers</strong> are responsible for their interactions.</p>
        </>
      ),
    },
    {
      id: "ip",
      title: "8. Intellectual Property",
      content: (
        <ul className="list-decimal pl-5 space-y-2">
          <li>CallSubs owns all rights to the Platform, including software, logos, and branding.</li>
          <li>You may not copy, modify, or distribute any part of the Platform without written consent.</li>
          <li>Content generated in Calls belongs to the Streamer unless otherwise agreed.</li>
        </ul>
      ),
    },
    {
      id: "disclaimer",
      title: "9. Disclaimer of Warranties",
      content: (
        <ul className="list-decimal pl-5 space-y-2">
          <li>The Platform is provided “as is” and “as available.”</li>
          <li>No warranties are made regarding availability, reliability, or error-free operation.</li>
          <li>We do not warrant the behavior, safety, or legality of Users or the outcome of any Call.</li>
        </ul>
      ),
    },
    {
      id: "limitation",
      title: "10. Limitation of Liability",
      content: (
        <ul className="list-decimal pl-5 space-y-2">
          <li>To the fullest extent permitted by law, we are not liable for indirect or consequential damages.</li>
          <li>Our total liability shall not exceed the amount paid by you to CallSubs in the 6 months preceding the claim.</li>
          <li>Users interact at their own risk.</li>
        </ul>
      ),
    },
    {
      id: "termination",
      title: "11. Termination",
      content: (
        <ul className="list-decimal pl-5 space-y-2">
          <li>We may suspend or terminate accounts for violations of these Terms or harmful conduct.</li>
          <li>Users may terminate their account at any time via account settings.</li>
          <li>Obligations reasonably expected to survive termination remain in effect.</li>
        </ul>
      ),
    },
    {
      id: "indemnification",
      title: "12. Indemnification",
      content: (
        <p>You agree to indemnify and hold harmless CallSubs and its affiliates from claims arising from your use of the Platform, violation of these Terms, or interactions during Calls.</p>
      ),
    },
    {
      id: "law-disputes",
      title: "13. Governing Law & Dispute Resolution",
      content: (
        <ul className="list-decimal pl-5 space-y-2">
          <li>These Terms are governed by the laws of Delaware, United States.</li>
          <li>Disputes shall be resolved exclusively in the courts of Delaware.</li>
          <li>Users waive participation in class actions or consolidated proceedings.</li>
        </ul>
      ),
    },
    {
      id: "changes",
      title: "14. Changes to These Terms",
      content: (
        <p>We may update these Terms from time to time. Changes are effective upon posting. Continued use of the Platform constitutes acceptance of updated Terms.</p>
      ),
    },
    {
      id: "contact",
      title: "15. Contact",
      content: (
        <ul className="list-none pl-0 space-y-2">
          <li>Email: <a className="underline text-[#4B5FFF]" href="mailto:support@callsubs.com">support@callsubs.com</a></li>
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
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#111]">Terms of Service</h1>
          <p className="text-sm md:text-base text-[#666] mt-2">Last updated: January 15, 2025</p>
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
