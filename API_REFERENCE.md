# IG DM Intel API Reference

Base URL: `https://<your-domain>`

All endpoints use Next.js route handlers under `/api/*`.

## Authentication (API Key)

### Required header

For all `v1` endpoints (`/api/v1/*`), authenticate requests by sending:

`x-api-key: <your_api_key>`

### Behavior

`/api/v1/*` requests are authenticated by `middleware.ts`:

- If `x-api-key` is missing, the API returns `401`:
  - Response: `{ "error": "Missing x-api-key header" }`
- If the API key is not found in Supabase (`api_keys` table), the API returns `401`:
  - Response: `{ "error": "Invalid API Key" }`

Notes:
- This middleware is matched to `/api/v1/:path*` only, so non-`v1` routes (like `/api/checkout`) are not protected by this `x-api-key` middleware.
- Since the middleware runs for all methods on `/api/v1/*` (including `OPTIONS`), browser CORS preflight may fail with `401` if the preflight request does not include the `x-api-key` header value.

Example:

```bash
curl -X POST "https://<your-domain>/api/v1/intent" \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_key" \
  -d '{"message_text":"Hey I need help scaling my backend operations ASAP."}'
```

## Rate Limits (Quota-based)

Rate limiting is quota-based and enforced in `middleware.ts` for `/api/v1/*`.

### How it works

The middleware reads the API key record from Supabase (`api_keys`) and checks:

- `requests_used >= requests_limit` => reject with `429`
- otherwise => allow, then increment `requests_used` by `1` and write an entry to `usage_logs`

The increment happens in middleware (before the route handler runs), so a request that is authenticated will count against your quota even if the handler later errors.

### Where `requests_limit` comes from

`requests_limit` is stored per API key in Supabase:

- API keys created via the `generateApiKeyAction` default to `requests_limit = 100`
- Stripe webhook tier upgrades update `requests_limit` to higher values (e.g. `10000` / `25000`) for the email associated with the Stripe checkout

### 429 response

When the quota is exceeded, the API returns `429`:

- Response: `{ "error": "Usage Limit Exceeded" }`

Important:
- This is not a time-window limiter (there is no “per minute” value in the code). It is based on a fixed `requests_limit` counter.

## Endpoints

### 1) Intent Detection

**POST** `/api/v1/intent`

Headers:
- `Content-Type: application/json`
- `x-api-key: <your_api_key>`

Request body (JSON):
- `message_text` (string, required)

Successful response:
- Status: `200`
- Content-Type: `application/json`
- Body:
  - `intent_score` (number) (60–100)
  - `urgency` (string) (`"high"` if `intent_score > 85`, otherwise `"medium"`)
  - `budget_signals` (string) (`"detected"` if `intent_score > 75`, otherwise `"neutral"`)
  - `technical_sophistication` (string) (`"advanced"`)
  - `recommended_response` (string)
  - `lead_status` (string) (`"Hot"`)

Error responses:
- `400` (missing `message_text`)
  - `{ "error": "Missing message_text" }`
- `500` (unexpected/invalid request)
  - `{ "error": "Invalid request" }`
- `401` / `429` from auth + quota middleware (see sections above)

### 2) Profile Analysis

**POST** `/api/v1/profile`

Headers:
- `Content-Type: application/json`
- `x-api-key: <your_api_key>`

Request body (JSON):
- `profile_url` (string, optional)
- `bio_text` (string, optional)

Validation:
- At least one of `profile_url` or `bio_text` must be provided.

Successful response:
- Status: `200`
- Content-Type: `application/json`
- Body:
  - `lead_score` (number) (50–100)
  - `follower_quality` (string) (`"high"` if `lead_score > 80`, otherwise `"medium"`)
  - `content_sentiment` (string) (`"positive"`)
  - `avatar_status` (string) (`"Ideal Avatar"` if `lead_score > 90`, otherwise `"General Prospect"`)
  - `detected_niche` (string) (`"High-Ticket Scaling"`)
  - `analysis_summary` (string)

Error responses:
- `400` (missing both `profile_url` and `bio_text`)
  - `{ "error": "Missing profile_url or bio_text" }`
- `500` (unexpected/invalid request)
  - `{ "error": "Invalid request" }`
- `401` / `429` from auth + quota middleware (see sections above)

### 3) Consultant Insights

**POST** `/api/v1/insights`

Headers:
- `Content-Type: application/json`
- `x-api-key: <your_api_key>`

Request body (JSON):
- `bio_text` (string, optional)
- `profile_url` (string, optional)

Validation:
- At least one of `bio_text` or `profile_url` must be provided.

Successful response:
- Status: `200`
- Content-Type: `application/json`
- Body:
  - `lead_type` (string)
  - `estimated_revenue` (string) (`"7-figure"` if bio contains `"agency"`, otherwise `"6-figure"`)
  - `consultant_tag` (string) (`"High-Value Lead"`)
  - `industry_specific_tagging` (string) (`"Scaling / SaaS / Consulting"`)
  - `recommendation` (string)

Error responses:
- `400` (missing both `bio_text` and `profile_url`)
  - `{ "error": "Missing bio_text or profile_url" }`
- `500` (unexpected/invalid request)
  - `{ "error": "Invalid request" }`
- `401` / `429` from auth + quota middleware (see sections above)

### 4) Screenshot Verification

**POST** `/api/v1/screenshot`

Headers:
- `Content-Type: application/json`
- `x-api-key: <your_api_key>`

Request body (JSON):
- `url` (string, required)

Successful response:
- Status: `200`
- Content-Type: `image/png`
- Body: raw PNG bytes (binary)

Error responses:
- `400` (missing `url`)
  - `{ "error": "Missing url" }`
- `500` (render failure / invalid request)
  - `{ "error": "Render failure or invalid request" }`
- `401` / `429` from auth + quota middleware (see sections above)

### 5) Create Stripe Checkout Session

**POST** `/api/checkout`

Note: this route is **not** protected by the `/api/v1/*` `x-api-key` middleware.

Headers:
- `Content-Type: application/json`

Request body (JSON):
- `priceId` (string, required)
- `email` (string, required)

Successful response:
- Status: `200`
- Content-Type: `application/json`
- Body: `{ "url": "<stripe_checkout_session_url>" }`

Error responses:
- `400` (missing `priceId` or `email`)
  - `{ "error": "Missing priceId or email" }`
- `500`
  - `{ "error": "Failed to create checkout session" }`

### 6) Stripe Webhook Handler

**POST** `/api/webhooks/stripe`

Note: this route is a Stripe webhook and uses Stripe signature verification (when `STRIPE_WEBHOOK_SECRET` is set).

Headers:
- `stripe-signature: <signature_header_from_stripe>`

Request body:
- Raw text body (the handler uses `await request.text()`).

Successful response:
- Status: `200`
- Content-Type: `application/json`
- Body: `{ "received": true }`

Error responses:
- `400` (webhook verification failure)
  - Body (plain text): `Webhook Error: <message>`

## Error Codes Summary

### JSON errors (most routes)

| Status | When | Response body |
|---:|---|---|
| `400` | Missing/invalid request body | `{ "error": "<message>" }` |
| `401` | Missing or invalid API key (`/api/v1/*`) | `{ "error": "Missing x-api-key header" }` or `{ "error": "Invalid API Key" }` |
| `429` | API quota exceeded (`/api/v1/*`) | `{ "error": "Usage Limit Exceeded" }` |
| `500` | Unexpected/failed server operation | `{ "error": "Invalid request" }`, `{ "error": "Render failure or invalid request" }`, or `{ "error": "Failed to create checkout session" }` |

### Non-JSON error

- `POST /api/webhooks/stripe` may return plain text on `400`:
  - `Webhook Error: <message>`

