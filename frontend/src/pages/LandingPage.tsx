import { 
  ShieldCheck, Database, Zap, Lock, 
  ChevronRight, Globe, Layers, BarChart3 
} from 'lucide-react';

/**
 * DESIGN TOKENS
 * BG: #121212
 * Surface: #181818
 * Accent: #FFFFFF
 * Muted: #9CA3AF
 */

const LandingPage = () => {
  return (
    <div className="bg-[#121212] text-[#E0E0E0] min-h-screen font-sans selection:bg-white selection:text-black scroll-smooth">
      
      {/* --- ACCESSIBILITY: SKIP TO CONTENT --- */}
      <a href="#main-content" className="sr-only focus:not-sr-only p-4 bg-white text-black absolute z-[100]">
        Skip to content
      </a>

      <main id="main-content">
        {/* --- HERO SECTION --- */}
        <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden" aria-labelledby="hero-heading">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="flex flex-col items-center text-center">
              
              <h1 id="hero-heading" className="text-4xl md:text-7xl font-black tracking-tight text-white mb-8 max-w-5xl">
                Turn Messy Financial Data <br />
                <span className="text-[#9CA3AF]">Into Structured Truth.</span>
              </h1>
              
              <p className="text-xl text-[#9CA3AF] mb-12 max-w-2xl leading-relaxed">
                The high-performance parsing engine for fintech engineers. Extract transaction primitives from any source into ACID-compliant JSON models in milliseconds.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
                <a 
                  href="/register" 
                  className="bg-white text-[#121212] px-10 py-4 rounded-md font-bold hover:bg-[#E0E0E0] transition-all flex items-center justify-center gap-2 focus:ring-2 focus:ring-offset-2 focus:ring-white outline-none"
                >
                  Get Your API Key <ChevronRight size={18} aria-hidden="true" />
                </a>
                <a 
                  href="/docs" 
                  className="bg-[#181818] border border-white/10 px-10 py-4 rounded-md font-bold hover:bg-[#1f1f1f] transition-all flex items-center justify-center focus:ring-2 focus:ring-white outline-none"
                >
                  Read the Docs
                </a>
              </div>
              
              <p className="mt-6 text-sm text-[#6B7280]">
                Free for developers • No credit card required • GDPR Ready
              </p>
            </div>
          </div>
          
          {/* BACKGROUND TEXTURE */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 -z-10" />
        </section>

        {/* --- HOW IT WORKS: 3-STEP FLOW --- */}
        <section className="py-24 border-t border-white/5" aria-labelledby="how-it-works">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 id="how-it-works" className="text-center text-3xl font-bold text-white mb-20 tracking-tight">Three steps to a clean pipeline</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
              {/* Connector Line for Desktop */}
              <div className="hidden md:block absolute top-10 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -z-10" />
              
              {[
                { step: "01", title: "Ingest Raw Data", desc: "Pipe SMS, PDF text, or unstructured logs directly into our secure endpoint.", icon: <Globe size={20} /> },
                { step: "02", title: "Normalize Primitives", desc: "Our engine identifies amounts, balances, and dates with 99.9% certainty.", icon: <Layers size={20} /> },
                { step: "03", title: "Immutable Storage", desc: "Data is saved with ACID compliance and exposed via high-speed JSON.", icon: <Database size={20} /> },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center group">
                  <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center font-black mb-6 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-3">{item.title}</h3>
                  <p className="text-sm text-[#9CA3AF] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- THE DATA VAULT: REFACTORED FOR SCANNABILITY --- */}
        <section className="py-24 bg-[#181818]/20" aria-labelledby="features-heading">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="bg-[#181818] border border-white/5 rounded-3xl p-8 md:p-16 flex flex-col lg:flex-row items-center gap-16">
              <div className="w-full lg:w-1/2">
                <header className="mb-8">
                  <h2 id="features-heading" className="text-4xl font-bold text-white mb-4 tracking-tight">Structured for Scale.</h2>
                  <p className="text-[#9CA3AF]">Ness isn't just a parser; it's a data validator that ensures every transaction record is audit-ready from the second it's generated.</p>
                </header>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {[
                    { title: "ACID Transactions", icon: <ShieldCheck />, text: "MongoDB-powered isolation for every single extraction." },
                    { title: "Latency-First", icon: <Zap />, text: "Parsed and stored in <50ms across global regions." },
                    { title: "Tenant Isolation", icon: <Lock />, text: "Strict logical separation of financial datasets." },
                    { title: "Real-time Audits", icon: <BarChart3 />, text: "Automatic integrity hashing for every JSON response." }
                  ].map((feat, i) => (
                    <div key={i} className="space-y-3">
                      <div className="text-white">{feat.icon}</div>
                      <h4 className="text-white font-bold text-sm">{feat.title}</h4>
                      <p className="text-xs text-[#9CA3AF] leading-normal">{feat.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full lg:w-1/2">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-white/10 to-transparent blur opacity-25 group-hover:opacity-50 transition" />
                  <div className="relative bg-[#121212] p-8 rounded-xl border border-white/10 font-mono text-xs overflow-hidden">
                    <div className="flex gap-1.5 mb-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                    </div>
                    <code className="text-green-400 block whitespace-pre">
{`{
  "status": "VALIDATED",
  "primitive": {
    "amount": 1250.50,
    "currency": "USD",
    "type": "DEBIT",
    "timestamp": "2026-01-13T12:50Z"
  },
  "audit": {
    "sha256": "8f3e2...9a1",
    "isolation_id": "iso_9921"
  }
}`}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- FINAL CTA SECTION --- */}
        <section className="py-32 text-center relative">
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <h2 className="text-5xl font-bold text-white mb-8 tracking-tighter">Ready to secure your data pipeline?</h2>
            <p className="text-xl text-[#9CA3AF] mb-12 max-w-2xl mx-auto">
              Start building high-integrity financial apps today. No bluff, no buzzwords. Just pure engineering.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <a href="/register" className="bg-gray-100 text-black px-10 py-5 rounded-md font-bold text-lg hover:opacity-90 transition-transform focus:ring-2 focus:ring-white outline-none">
                Start Free API Access
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;