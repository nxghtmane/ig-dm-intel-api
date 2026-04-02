'use client';

import React from 'react';
import { Terminal, Copy, ArrowLeft, Check, Zap, Shield, Activity, Globe } from 'lucide-react';
import Link from 'next/link';

const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="relative flex items-center justify-center w-8 h-8 overflow-hidden rounded-lg border border-white/10 bg-[#0B0F19]">
      <img src="/assets/logo.png" alt="Neural Architect Logo" className="w-full h-full object-contain" />
    </div>
    <span className="text-xl font-bold tracking-tight text-white font-['Space_Grotesk']">
      Neural Architect
    </span>
  </div>
);

const Section = ({ title, id, children }: { title: string, id: string, children: React.ReactNode }) => (
  <section id={id} className="py-12 border-b border-white/5 last:border-0">
    <h2 className="text-2xl font-bold mb-6 font-['Space_Grotesk'] text-white flex items-center gap-3">
      {title}
    </h2>
    <div className="text-gray-400 space-y-4 leading-relaxed">
      {children}
    </div>
  </section>
);

const CodeBlock = ({ code, language = 'bash' }: { code: string, language?: string }) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-6">
      <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 blur transition duration-500" />
      <div className="relative flex flex-col w-full overflow-hidden rounded-xl bg-[#050812] border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.02]">
          <span className="text-[10px] uppercase tracking-widest font-mono text-gray-500">{language}</span>
          <button 
            onClick={copyToClipboard}
            className="p-1.5 hover:bg-white/5 rounded-md transition-colors text-gray-500 hover:text-white"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
        <div className="p-5 overflow-x-auto text-sm font-mono leading-relaxed text-gray-300">
          <pre>{code}</pre>
        </div>
      </div>
    </div>
  );
};

const EndpointCard = ({ method, path, description, requestBody, responseBody }: any) => (
  <div className="mb-12 p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group">
    <div className="flex items-center gap-3 mb-4">
      <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
        method === 'POST' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/20' : 'bg-blue-500/20 text-blue-400 border border-blue-500/20'
      }`}>
        {method}
      </span>
      <code className="text-gray-200 font-mono text-sm tracking-tight">{path}</code>
    </div>
    <p className="text-gray-400 mb-6 text-sm">{description}</p>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h4 className="text-[10px] uppercase tracking-widest text-gray-500 mb-3 font-semibold">Request Body</h4>
        <CodeBlock language="json" code={requestBody} />
      </div>
      <div>
        <h4 className="text-[10px] uppercase tracking-widest text-gray-500 mb-3 font-semibold">Sample Response</h4>
        <CodeBlock language="json" code={responseBody} />
      </div>
    </div>
  </div>
);

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white selection:bg-purple-500/30 font-['Inter']">
      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Persistent Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0B0F19]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-4 h-4 text-gray-500 group-hover:-translate-x-1 transition-transform" />
            <Logo />
          </Link>
          <div className="flex items-center gap-6">
             <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest leading-none">API Operational</span>
             </div>
             <button className="px-4 py-2 text-xs font-semibold rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                Status
             </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* Sidebar Nav */}
        <aside className="hidden lg:block lg:sticky lg:top-32 lg:h-[calc(100vh-8rem)]">
          <nav className="flex flex-col gap-1">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-4 font-bold">Getting Started</p>
            {['Introduction', 'Authentication', 'Base URL'].map(item => (
              <a 
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all mb-1"
              >
                {item}
              </a>
            ))}
            
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-4 mt-8 font-bold">Endpoints</p>
            {['Intent Detection', 'Profile Analysis', 'Consultant Insights', 'Screenshot'].map(item => (
              <a 
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all mb-1"
              >
                {item}
              </a>
            ))}

            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-4 mt-8 font-bold">System</p>
            {['Error Codes', 'Rate Limits'].map(item => (
              <a 
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all mb-1"
              >
                {item}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3 pb-24">
          
          <Section title="Introduction" id="introduction">
            <p className="text-xl text-gray-300 font-light leading-relaxed">
              The IG DM Intel API provides an advanced intelligence layer for Instagram automation. Use our pre-trained neural models to detect buyer intent, analyze prospect profiles, and generate actionable insights for high-ticket appointment setting.
            </p>
          </Section>

          <Section title="Authentication" id="authentication">
            <p>
              Security is built into every request. Authenticate your application by passing the <code className="text-purple-400">x-api-key</code> in the request header.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex gap-4 items-start">
                    <Shield className="w-5 h-5 text-purple-400 shrink-0" />
                    <div>
                        <p className="text-white text-sm font-semibold mb-1">Header Key</p>
                        <code className="text-xs text-gray-500">x-api-key</code>
                    </div>
                </div>
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex gap-4 items-start">
                    <Globe className="w-5 h-5 text-cyan-400 shrink-0" />
                    <div>
                        <p className="text-white text-sm font-semibold mb-1">Global Access</p>
                        <p className="text-xs text-gray-500">Available across all V1 routes</p>
                    </div>
                </div>
            </div>
            <CodeBlock code={`curl -X POST "https://your-domain.com/api/v1/intent" \\
  -H "x-api-key: your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"message_text": "I need help with my marketing strategy."}'`} />
          </Section>

          <Section title="Base URL" id="base-url">
             <div className="flex items-center gap-4 p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
                <Terminal className="w-5 h-5 text-purple-400" />
                <code className="text-purple-300 text-sm">https://api.symm.digital/api/v1</code>
             </div>
          </Section>

          <div className="pt-16">
            <h3 className="text-4xl font-bold mb-12 font-['Space_Grotesk']">Endpoints</h3>

            <div id="intent-detection">
              <EndpointCard 
                method="POST"
                path="/intent"
                description="Analyzes the intent of a message to determine lead quality and recommended follow-up using LLM-powered classification."
                requestBody={`{
  "message_text": "string (Required)"
}`}
                responseBody={`{
  "intent_score": 88,
  "urgency": "high",
  "budget_signals": "detected",
  "technical_sophistication": "advanced",
  "recommended_response": "...",
  "lead_status": "Hot"
}`}
              />
            </div>

            <div id="profile-analysis">
              <EndpointCard 
                method="POST"
                path="/profile"
                description="Scours an Instagram profile or bio text to determine the prospect's lead quality score."
                requestBody={`{
  "profile_url": "string (Optional)",
  "bio_text": "string (Optional)"
}`}
                responseBody={`{
  "lead_score": 92,
  "follower_quality": "high",
  "content_sentiment": "positive",
  "avatar_status": "Ideal Avatar",
  "detected_niche": "High-Ticket Scaling",
  "analysis_summary": "..."
}`}
              />
            </div>

            <div id="consultant-insights">
               <EndpointCard 
                method="POST"
                path="/insights"
                description="Generate strategic deep-dives into the prospect's industry and potential revenue size."
                requestBody={`{
  "profile_url": "string (Optional)",
  "bio_text": "string (Optional)"
}`}
                responseBody={`{
  "lead_type": "Agency Owner",
  "estimated_revenue": "7-figure",
  "consultant_tag": "High-Value Lead",
  "industry_specific_tagging": "Scaling / SaaS / Consulting",
  "recommendation": "..."
}`}
              />
            </div>

            <div id="screenshot">
               <EndpointCard 
                method="POST"
                path="/screenshot"
                description="Puppeteer-powered profile rendering. Returns raw image bytes for real-time verification."
                requestBody={`{
  "url": "string (Required)"
}`}
                responseBody={`[Raw Binary Stream: Content-Type: image/png]`}
              />
            </div>
          </div>

          <Section title="Error Codes" id="error-codes">
             <div className="overflow-hidden rounded-xl border border-white/5 bg-white/[0.01]">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.02]">
                            <th className="px-6 py-4 font-semibold text-gray-200">Code</th>
                            <th className="px-6 py-4 font-semibold text-gray-200">Status</th>
                            <th className="px-6 py-4 font-semibold text-gray-200">Meaning</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                         {[
                             ['200', 'OK', 'Success: Request processed successfully.'],
                             ['400', 'Bad Request', 'Validation: Missing or invalid parameters.'],
                             ['401', 'Unauthorized', 'Security: Missing or invalid x-api-key.'],
                             ['429', 'Too Many Requests', 'Quota: Usage limit exceeded for this key.'],
                             ['500', 'Server Error', 'Internal: Unexpected system failure.'],
                         ].map(([code, status, msg]) => (
                             <tr key={code} className="hover:bg-white/[0.01] transition-colors">
                                <td className="px-6 py-4 font-mono text-purple-400 font-bold">{code}</td>
                                <td className="px-6 py-4 text-white font-medium">{status}</td>
                                <td className="px-6 py-4 text-gray-500">{msg}</td>
                             </tr>
                         ))}
                    </tbody>
                </table>
             </div>
          </Section>

          <Section title="Rate Limits" id="rate-limits">
             <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/5 to-cyan-500/5 border border-white/5">
                <div className="flex items-center gap-4 mb-6">
                    <Activity className="w-6 h-6 text-purple-400" />
                    <h4 className="text-white font-semibold">Quota-Based System</h4>
                </div>
                <p className="mb-4">IG DM Intel API uses a <span className="text-white">total request quota</span> architecture rather than time-window throttling. This ensures zero latency during bulk operations until your total allocated limit is reached.</p>
                <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                        <p><span className="text-gray-200">Live Incrementing:</span> Every successful API call (HTTP 200) increments your usage count in real-time.</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                        <p><span className="text-gray-200">Automated Cut-off:</span> Once usage reaches your allocated requests_limit, additional calls will return a 429 error.</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                        <p><span className="text-gray-200">Instant Upgrades:</span> Quotas are automatically updated upon successful Stripe checkout verification.</p>
                    </div>
                </div>
             </div>
          </Section>

        </main>
      </div>

      <footer className="border-t border-white/5 py-12 bg-[#050812]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <Logo />
            <p className="text-xs text-gray-600 uppercase tracking-widest">© 2026 Neural Architect API. Built with precision.</p>
        </div>
      </footer>
    </div>
  );
}
