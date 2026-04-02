import React, { useState, useEffect, Suspense } from 'react';
import { Terminal, Code2, Zap, Check, X, Loader2, Cpu, ChevronRight, Star, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { generateApiKeyAction, getApiKeyByEmailAction } from './actions/api-keys';

// --- Types ---
type PricingTier = {
  name: string;
  price: string;
  requests: string;
  features: string[];
  isPopular?: boolean;
  priceId?: string;
};

// --- Price IDs from Stripe ---
const GROWTH_PRICE_ID = 'price_1THUd80zW5J1mpgFQwBCcvKs';
const BUSINESS_PRICE_ID = 'price_1THUeK0zW5J1mpgFTIXd5AZX';

// --- Mock Data ---
const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Starter',
    price: '$0',
    requests: '100 Requests/mo',
    features: ['Basic Profile Analysis', 'Standard Latency', 'Community Support'],
  },
  {
    name: 'Growth',
    price: '$29',
    requests: '10,000 Requests/mo',
    features: ['DM Intent Detection', 'Low Latency', 'Email Support', 'Webhook Access'],
    isPopular: true,
    priceId: GROWTH_PRICE_ID,
  },
  {
    name: 'Business',
    price: '$129',
    requests: '25,000 Requests/mo',
    features: ['Consultant Insights Engine', 'Zero Latency', 'Dedicated Account Manager', 'Custom Models'],
    priceId: BUSINESS_PRICE_ID,
  },
];

// --- Components ---

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

const TerminalWindow = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="flex flex-col w-full overflow-hidden rounded-xl bg-[#050812] border border-white/10 shadow-2xl">
    <div className="flex items-center px-4 py-3 border-b border-white/5 bg-white/[0.02]">
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
      </div>
      <span className="ml-4 text-xs font-mono text-gray-500">{title}</span>
    </div>
    <div className="p-6 overflow-x-auto text-sm font-mono leading-relaxed text-gray-300">
      {children}
    </div>
  </div>
);

function NeuralArchitectContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [generatedKey, setGeneratedKey] = useState('');
  const [selectedTierPriceId, setSelectedTierPriceId] = useState<string | null>(null);
  
  // Success state from stripe
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [upgradedLimit, setUpgradedLimit] = useState<number | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const success = searchParams.get('success');
    if (success === 'true') {
        setPurchaseSuccess(true);
        setIsModalOpen(true);
        // Try to fetch the key if we have email in local storage or something
        // For simplicity, we'll ask them to enter email to "recover" their upgraded key if needed
        // but here we just show a success message
    }
  }, [searchParams]);

  const handleCheckout = async (priceId: string) => {
    if (!email) {
      setSelectedTierPriceId(priceId);
      setIsModalOpen(true);
      return;
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId, email }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.error('Checkout error:', err.message);
    }
  };

  const handleGetApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    try {
      if (selectedTierPriceId) {
        await handleCheckout(selectedTierPriceId);
        return;
      }

      // Check if they are successful buyers looking for their key
      const result = await getApiKeyByEmailAction(email);
      if (result.success && result.data) {
          setGeneratedKey(result.data.key);
          setUpgradedLimit(result.data.requests_limit);
          setSubmitSuccess(true);
          return;
      }

      // Otherwise generate a new one
      const response = await generateApiKeyAction(email);
      if (!response.success) {
        throw new Error(response.error);
      }
      setGeneratedKey(response.key!);
      setSubmitSuccess(true);
    } catch (err: any) {
      console.error('Error handling key:', err.message);
      alert('Error processing request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white selection:bg-purple-500/30 font-['Inter']">
      
      <header className="absolute top-0 left-0 right-0 p-6 md:p-8 flex justify-between items-center z-40 max-w-7xl mx-auto">
        <Logo />
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
        >
          Developer Login
        </button>
      </header>

      <main className="relative flex flex-col items-center justify-center px-6 pt-32 pb-24 mx-auto max-w-7xl lg:pt-48">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center max-w-4xl text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight font-['Space_Grotesk']">
            Automate Your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
              Instagram Intelligence
            </span>
          </h1>
          
          <p className="max-w-2xl text-lg md:text-xl text-gray-400 mb-10 leading-relaxed">
            The definitive cold DM engine for coaches and consultants. Analyze profiles, detect buying intent, and extract high-value insights with neural-precision API calls.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="group relative flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all shadow-[0_0_40_px_-10px_rgba(139,92,246,0.5)] hover:shadow-[0_0_60px_-10px_rgba(139,92,246,0.6)]"
            >
              Get API Key
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <Link 
              href="/docs"
              className="flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-gray-300 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              Read Documentation
            </Link>
          </div>
        </div>

        <div id="docs" className="relative z-10 w-full mt-24 lg:mt-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="group relative">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 blur transition duration-500" />
              <TerminalWindow title="request.sh">
                <pre>
                  <span className="text-pink-400">curl</span> <span className="text-gray-300">-X POST</span> https://api.yourdomain.com/api/v1/intent \<br/>
                  &nbsp;&nbsp;<span className="text-gray-300">-H</span> <span className="text-green-300">"x-api-key: YOUR_API_KEY"</span> \<br/>
                  &nbsp;&nbsp;<span className="text-gray-300">-H</span> <span className="text-green-300">"Content-Type: application/json"</span> \<br/>
                  &nbsp;&nbsp;<span className="text-gray-300">-d</span> <span className="text-green-300">'{'{'}"message_text": "I need help scaling my agency"{'}'}'</span>
                </pre>
              </TerminalWindow>
            </div>

            <div className="group relative">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 blur transition duration-500" />
              <TerminalWindow title="response.json">
                <pre>
                  <span className="text-gray-300">{'{'}</span><br/>
                  &nbsp;&nbsp;<span className="text-blue-300">"intent_score"</span>: <span className="text-purple-400">88</span>,<br/>
                  &nbsp;&nbsp;<span className="text-blue-300">"urgency"</span>: <span className="text-green-300">"high"</span>,<br/>
                  &nbsp;&nbsp;<span className="text-blue-300">"budget_signals"</span>: <span className="text-green-300">"detected"</span>,<br/>
                  &nbsp;&nbsp;<span className="text-blue-300">"recommended_response"</span>: <span className="text-green-300">"Are you free for a sync?"</span>,<br/>
                  &nbsp;&nbsp;<span className="text-blue-300">"lead_status"</span>: <span className="text-green-300">"Hot"</span><br/>
                  <span className="text-gray-300">{'}'}</span>
                </pre>
              </TerminalWindow>
            </div>
          </div>
        </div>

        <div className="relative z-10 w-full mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-['Space_Grotesk'] text-white">
              Simple, scalable pricing
            </h2>
            <p className="text-gray-400">Start for free, scale when you close deals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRICING_TIERS.map((tier) => (
              <div 
                key={tier.name}
                className={`relative flex flex-col p-8 rounded-2xl border ${
                  tier.isPopular 
                    ? 'bg-white/10 border-purple-500/50 shadow-[0_0_30px_-10px_rgba(139,92,246,0.3)]' 
                    : 'bg-white/5 border-white/10'
                } backdrop-blur-sm`}
              >
                {tier.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-semibold tracking-wider text-purple-200 uppercase bg-purple-600 rounded-full">
                    Most Popular
                  </div>
                )}
                
                <h3 className="text-xl font-medium text-gray-300 mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-sm text-gray-500">/mo</span>
                </div>
                <p className="text-sm text-cyan-400 font-mono mb-8">{tier.requests}</p>
                
                <ul className="flex flex-col gap-4 mb-8 flex-grow">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-purple-400 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => tier.priceId ? handleCheckout(tier.priceId) : setIsModalOpen(true)}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    tier.isPopular 
                      ? 'bg-purple-600 hover:bg-purple-500 text-white' 
                      : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                  }`}
                >
                  {tier.price === '$0' ? 'Start Free' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>
        </div>

      </main>

      <footer className="border-t border-white/10 py-8 text-center bg-[#050812]">
        <p className="text-sm text-gray-600">© 2026 Neural Architect API. Built for high-ticket setters.</p>
      </footer>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div 
            className="relative w-full max-w-md p-8 overflow-hidden bg-[#0a0d14] border border-white/10 rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[100px] bg-purple-600/30 blur-[60px] pointer-events-none" />

            <button 
              onClick={() => {
                  setIsModalOpen(false);
                  setPurchaseSuccess(false);
                  setSubmitSuccess(false);
                  setEmail('');
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative z-10 text-center">
              {purchaseSuccess && !submitSuccess ? (
                <>
                  <div className="flex justify-center mb-6">
                    <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                        <Sparkles className="w-8 h-8 text-green-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 font-['Space_Grotesk'] text-white">Upgrade Successful!</h3>
                  <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                    Thank you for your purchase. Please enter your email below to retrieve your <span className="text-purple-400 font-bold uppercase">Upgraded API Key</span>.
                  </p>
                  <form onSubmit={handleGetApiKey} className="flex flex-col gap-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter purchase email"
                      required
                      className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 text-sm font-semibold text-white bg-purple-600 rounded-xl hover:bg-purple-500 disabled:opacity-70"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 mx-auto animate-spin" /> : 'Retrieve Upgraded Key'}
                    </button>
                  </form>
                </>
              ) : submitSuccess ? (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                  {upgradedLimit ? (
                      <div className="mb-4 flex items-center justify-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-widest">
                          <Star className="w-3 h-3" />
                          Limit Upgraded: {upgradedLimit.toLocaleString()} Requests
                          <Star className="w-3 h-3" />
                      </div>
                  ) : (
                      <p className="text-green-400 font-medium mb-4">API Key Secured!</p>
                  )}
                  <code className="block p-3 bg-black/50 border border-white/10 rounded-lg text-xs break-all text-gray-300 font-mono mb-4 text-left">
                    {generatedKey}
                  </code>
                  <button 
                    onClick={() => {
                        navigator.clipboard.writeText(generatedKey);
                        alert('Copied to clipboard!');
                    }}
                    className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-purple-400 font-medium uppercase tracking-wider transition-all"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-center mb-6">
                    <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                        <Zap className="w-8 h-8 text-purple-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 font-['Space_Grotesk'] text-white">Get Your API Key</h3>
                  <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                    Enter your email address to generate your free <span className="text-cyan-400 font-bold">Starter</span> key.
                  </p>
                  <form onSubmit={handleGetApiKey} className="flex flex-col gap-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="developer@company.com"
                      required
                      className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 text-sm font-semibold text-white bg-purple-600 rounded-xl hover:bg-purple-500 disabled:opacity-70"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 mx-auto animate-spin" /> : 'Generate Free Key'}
                    </button>
                  </form>
                </>
              )}
              
              <p className="mt-6 text-[10px] text-gray-600 uppercase tracking-widest">
                Protected by Neural Architect Security
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NeuralArchitectLanding() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0F19] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>}>
      <NeuralArchitectContent />
    </Suspense>
  );
}
