import React from 'react';

export default function Home() {
  return (
    <div className="container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <img src="/assets/logo.png" alt="Neural Architect Logo" style={{ height: '40px', width: 'auto' }} />
          Neural Architect
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <a href="#stats" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.875rem' }}>Features</a>
          <a href="#pricing" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.875rem' }}>Pricing</a>
          <a href="#pricing" className="btn btn-purple" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>Get API Key</a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <h1 className="hero-title">
          Automate Your <br />
          <span className="gradient-text">Instagram Intelligence</span>
        </h1>
        <p className="hero-subtitle">
          The definitive cold DM engine for coaches and consultants. 
          Analyze profiles, detect buying intent, and extract high-value insights with neural-precision API calls.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a href="#pricing" className="btn btn-purple">Start Building Now</a>
          <a href="#docs" className="btn btn-outline">Read Documentation</a>
        </div>
      </header>

      {/* Decision Intelligence Section */}
      <section id="stats" className="section">
        <h2 className="section-title">Decision Intelligence</h2>
        <div className="grid-3">
          <div className="card">
            <div className="card-icon bg-purple">⚡</div>
            <h3>DM Intent Detection</h3>
            <p style={{ color: '#94A3B8', marginTop: '1rem' }}>
              Our LLM-powered layer analyzes incoming messages to score leads based on urgency, 
              budget signals, and technical sophistication.
            </p>
          </div>
          <div className="card">
            <div className="card-icon bg-cyan">👤</div>
            <h3>Profile Analysis</h3>
            <p style={{ color: '#94A3B8', marginTop: '1rem' }}>
              Deep-scrape bio, follower quality, and content sentiment to identify your ideal 
              avatar before you ever hit send.
            </p>
          </div>
          <div className="card">
            <div className="card-icon bg-blue">📊</div>
            <h3>Consultant Insights</h3>
            <p style={{ color: '#94A3B8', marginTop: '1rem' }}>
              Industry-specific tagging: identifies if a lead is a coach, agency owner, or 
              enterprise decision maker.
            </p>
          </div>
        </div>
      </section>

      {/* Integration Code Section */}
      <section id="docs" className="section">
        <div className="card" style={{ maxWidth: '900px', margin: '0 auto', background: '#000' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Seamless Architecture</h3>
          <p style={{ color: '#94A3B8', marginBottom: '2rem' }}>
             Designed for 99.9% uptime. Integrate with your existing CRM or outreach tool with just four lines of code.
          </p>
          <div className="code-container">
            <div className="code-line"><span className="code-cmt">// Initialize Neural Architect</span></div>
            <div className="code-line">
              <span className="code-key">const</span> response = <span className="code-key">await</span> fetch(<span className="code-val">'https://api.neuralarch.ai/v1/analyze'</span>, &#123;
            </div>
            <div className="code-line">&nbsp;&nbsp;method: <span className="code-val">'POST'</span>,</div>
            <div className="code-line">&nbsp;&nbsp;headers: &#123; <span className="code-val">'x-api-key'</span>: <span className="code-val">'sk_live_...'</span> &#125;,</div>
            <div className="code-line">&nbsp;&nbsp;body: JSON.stringify(&#123; <span className="code-val">ig_handle</span>: <span className="code-val">'arch.design'</span> &#125;)</div>
            <div className="code-line">&#125;);</div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section">
        <h2 className="section-title">Scale Your Outreach</h2>
        <div className="grid-3">
          {/* Starter */}
          <div className="card pricing-card">
            <h4>Starter</h4>
            <div className="price">$0<span>/mo</span></div>
            <ul className="pricing-list">
              <li>100 API Requests</li>
              <li>Basic Profile Deep-Scrape</li>
              <li>Intent Detection Alpha</li>
              <li>Email Support</li>
            </ul>
            <a href="#" className="btn btn-outline" style={{ marginTop: 'auto' }}>Get Started</a>
          </div>

          {/* Growth - Featured */}
          <div className="card pricing-card pricing-featured">
            <span className="badge">Most Popular</span>
            <h4>Growth</h4>
            <div className="price">$29<span>/mo</span></div>
            <ul className="pricing-list">
              <li>10,000 API Requests</li>
              <li>Advanced Consultant Insights</li>
              <li>Priority Webhook Support</li>
              <li>Custom Lead Scoring</li>
            </ul>
            <a href="#" className="btn btn-purple" style={{ marginTop: 'auto' }}>Start Building</a>
          </div>

          {/* Business */}
          <div className="card pricing-card">
            <h4>Business</h4>
            <div className="price">$129<span>/mo</span></div>
            <ul className="pricing-list">
              <li>25,000 API Requests</li>
              <li>Unlimited Team Members</li>
              <li>Custom Sentiment Models</li>
              <li>24/7 Dedicated Support</li>
            </ul>
            <a href="#" className="btn btn-outline" style={{ marginTop: 'auto' }}>Contact Sales</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Neural Architect. Build with intelligence.</p>
          <p style={{ marginTop: '0.5rem' }}>Support: sangi.owned@gmail.com</p>
        </div>
      </footer>
    </div>
  );
}
