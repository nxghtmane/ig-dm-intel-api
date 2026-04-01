# Neural Architect - IG Appointment Setting Intelligence API

The ultimate intelligence layer for Instagram high-ticket appointment setting. Identify ideal avatars, detect intent, and scale your outreach with precision.

## 🚀 Key Features

- **DM Intent Detection (`/api/v1/intent`)**: LLM-powered layer that analyzes message content for urgency, budget signals, and technical sophistication.
- **Profile Analysis (`/api/v1/profile`)**: Scours bio, follower quality, and content sentiment to identify your "Ideal Client Avatar" before you hit send.
- **Consultant Insights (`/api/v1/insights`)**: Industry-specific tagging to identify if a lead is a Coach, Agency Owner, or Enterprise Decision Maker.
- **Screenshot Verification (`/api/v1/screenshot`)**: Puppeteer-powered profile rendering for visual verification.
- **High-Performance Architecture**: Built with Next.js 14 and Supabase for secure, low-latency intelligence.

## 🛠 Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database / Auth**: [Supabase](https://supabase.com/)
- **Browser Automation**: [Puppeteer](https://pptr.dev/)
- **Styling**: Vanilla CSS (Neon Minimalist Theme)

## 📡 API Usage

### Authentication
Authenticate all requests by passing the `x-api-key` header.

```bash
x-api-key: your_api_key
```

### Example: Intent Detection
```bash
curl -X POST https://your-domain.com/api/v1/intent \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_test_key" \
  -d '{"message_text": "Hey I need help scaling my backend operations ASAP."}'
```

## 📄 License
MIT

---
Developed for high-ticket scale. 
Support: sangi.owned@gmail.com
