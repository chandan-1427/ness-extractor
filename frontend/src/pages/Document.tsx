import { motion } from 'framer-motion';
import { 
  Database, 
  ShieldCheck, 
  Code2, 
  Terminal, 
  FileJson, 
} from 'lucide-react';

const DocsPage = () => {
  return (
    <div className="bg-[#050505] text-[#ADADAD] min-h-screen font-sans selection:bg-white selection:text-black">

      {/* MAIN CONTENT */}
      <main className="lg:ml-64 p-6 md:p-12 lg:p-20 max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold uppercase tracking-widest mb-4">
            <Database size={14} />
            Data Lifecycle
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-6">
            Extraction & Storage
          </h1>
          <p className="text-lg text-gray-400 mb-12 leading-relaxed">
            The Ness engine transforms unstructured financial noise into immutable, audit-ready JSON primitives using a high-concurrency pipeline.
          </p>

          {/* 1. INGESTION SECTION */}
          <section className="mb-20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="p-2 bg-white/5 rounded-md border border-white/10">
                <Terminal size={18} className="text-gray-400" />
              </div>
              01. Ingestion Layer
            </h2>
            <p className="mb-6 leading-relaxed text-gray-400">
              Raw strings—whether from SMS notifications, PDF text layers, or raw application logs—are sent to the secure Ness edge. Every request is verified for <span className="text-white italic">tenant isolation</span> before the parsing logic is initialized.
            </p>
            <div className="bg-[#0A0A0A] rounded-xl border border-white/10 p-4 font-mono text-sm">
              <div className="flex items-center gap-2 text-gray-500 mb-2 border-b border-white/5 pb-2">
                <span className="text-emerald-500 font-bold uppercase text-[10px]">Post</span>
                <span className="text-[10px]">https://api.ness.com/v1/extract</span>
              </div>
              <code className="text-gray-300">
                {`{ "raw": "Sent 250.00 EUR to Max on Jan 17" }`}
              </code>
            </div>
          </section>

          {/* 2. TRANSFORMATION SECTION */}
          <section className="mb-20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="p-2 bg-white/5 rounded-md border border-white/10">
                <Code2 size={18} className="text-gray-400" />
              </div>
              02. Normalization Engine
            </h2>
            <p className="mb-8 text-gray-400">
              
              Our engine applies a three-stage normalization process to ensure "Structured Truth":
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Primitive Identification', desc: 'Isolating amounts, currencies, and flow direction.' },
                { title: 'Entity Resolution', desc: 'Mapping messy strings to verified merchant IDs.' },
                { title: 'Timestamp Casting', desc: 'Converting relative time to UTC ISO-8601.' },
              ].map((step, i) => (
                <div key={i} className="p-5 rounded-lg border border-white/5 bg-white/[0.02]">
                  <h4 className="text-white font-bold text-sm mb-2">{step.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 3. STORAGE & ACID SECTION */}
          <section className="mb-20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="p-2 bg-white/5 rounded-md border border-white/10">
                <ShieldCheck size={18} className="text-gray-400" />
              </div>
              03. ACID-Compliant Persistence
            </h2>
            <p className="mb-8 text-gray-400">
              Unlike traditional parsers, Ness treats every extraction as a database transaction.
              
            </p>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-xl border border-white/5 bg-[#080808]">
                <div className="font-bold text-white font-mono">A</div>
                <div>
                  <h5 className="text-white text-sm font-bold">Atomicity</h5>
                  <p className="text-xs text-gray-500">The extraction and the database write happen as a single, inseparable unit.</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-xl border border-white/5 bg-[#080808]">
                <div className="font-bold text-white font-mono">I</div>
                <div>
                  <h5 className="text-white text-sm font-bold">Isolation</h5>
                  <p className="text-xs text-gray-500">Tenant-level logical separation ensures your financial data is never shared.</p>
                </div>
              </div>
            </div>
          </section>

          {/* CODE OUTPUT BLOCK */}
          <section className="mb-20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="p-2 bg-white/5 rounded-md border border-white/10">
                <FileJson size={18} className="text-gray-400" />
              </div>
              The "Audit Ready" Output
            </h2>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl blur opacity-75" />
              <div className="relative bg-[#050505] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                <pre className="p-6 md:p-8 font-mono text-[13px] leading-relaxed text-emerald-400 overflow-x-auto">
                  <code>{JSON.stringify({
                    status: "VALIDATED",
                    primitive: { 
                      amount: 250.00, 
                      currency: "EUR",
                      type: "DEBIT" 
                    },
                    audit: { 
                      sha256: "9f8e2...0z1",
                      integrity_check: "passed"
                    }
                  }, null, 2)}</code>
                </pre>
              </div>
            </div>
          </section>

        </motion.div>
      </main>
    </div>
  );
};

export default DocsPage;