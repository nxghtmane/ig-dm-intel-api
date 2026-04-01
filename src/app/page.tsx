import React from 'react';

export default function Home() {
  return (
    <main className="container">
      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero-title">Neural Architect</h1>
        <p className="hero-subtitle">
          The ultimate intelligence layer for Instagram high-ticket appointment setting. 
          Identify ideal avatars, detect intent, and scale your outreach with precision.
        </p>
        <div style={{ marginTop: '3rem' }}>
          <a href="#docs" className="btn-primary">Get API Access</a>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="feature-grid">
        <div className="feature-card">
          <div className="feature-icon">🧠</div>
          <h3 className="feature-title">DM Intent Detection</h3>
          <p className="feature-desc">
            Our LLM-powered layer analyzes incoming messages to score leads based on urgency, 
            budget signals, and technical sophistication.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🔍</div>
          <h3 className="feature-title">Profile Analysis</h3>
          <p className="feature-desc">
            Deep-scrape bio, follower quality, and content sentiment to identify your ideal 
            avatar before you ever hit send.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📈</div>
          <h3 className="feature-title">Consultant Insights</h3>
          <p className="feature-desc">
            Industry-specific tagging: identifies if a lead is a coach, agency owner, or 
            enterprise decision maker.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3 className="feature-title">Seamless Architecture</h3>
          <p className="feature-desc">
            Designed for 99.9% uptime. Integrate with your existing CRM or outreach tool 
            with just four lines of code.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
            <span className="code-pill active">Webhooks</span>
            <span className="code-pill">REST API</span>
            <span className="code-pill">GraphQL</span>
          </div>
        </div>
      </section>

      {/* Documentation Section */}
      <section id="docs" className="code-section">
        <div className="code-header">
          <span className="code-pill active">Endpoint Documentation</span>
        </div>
        
        <h3 style={{ marginBottom: '1rem' }}>1. Intent Detection</h3>
        <div className="code-block">
          <span className="code-keyword">POST</span> <span className="code-url">/api/v1/intent</span><br />
          <span className="code-string">headers: &#123; "x-api-key": "..." &#125;</span><br />
          <span className="code-string">body: &#123; "message_text": "Hey, I need help scaling ASAP." &#125;</span>
        </div>

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>2. Profile Analysis</h3>
        <div className="code-block">
          <span className="code-keyword">POST</span> <span className="code-url">/api/v1/profile</span><br />
          <span className="code-string">headers: &#123; "x-api-key": "..." &#125;</span><br />
          <span className="code-string">body: &#123; "profile_url": "instagram.com/alexhormozi" &#125;</span>
        </div>

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>3. Consultant Insights</h3>
        <div className="code-block">
          <span className="code-keyword">POST</span> <span className="code-url">/api/v1/insights</span><br />
          <span className="code-string">headers: &#123; "x-api-key": "..." &#125;</span><br />
          <span className="code-string">body: &#123; "bio_text": "Scaling 7-figure e-com brands." &#125;</span>
        </div>
      </section>

      <footer className="footer">
        &copy; {new Date().getFullYear()} Neural Architect | Built for High-Ticket Scale.<br />
        <span style={{ fontSize: '0.8rem', marginTop: '1rem', display: 'block' }}>
          Contact: sangi.owned@gmail.com
        </span>
      </footer>
    </main>
  );
}
