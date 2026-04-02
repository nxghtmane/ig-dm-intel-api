# IG DM Intel API Documentation

Welcome to the **IG DM Intel API** documentation. This API provides advanced analysis and intelligence tools for Instagram Direct Messages, profiling, and insights, specifically designed for high-ticket scaling and lead generation.

---

## Table of Contents
1. [Authentication](#authentication)
2. [Base URL](#base-url)
3. [Endpoints](#endpoints)
   - [Intent Detection](#1-intent-detection-post)
   - [Profile Analysis](#2-profile-analysis-post)
   - [Consultant Insights](#3-consultant-insights-post)
   - [Screenshot Verification](#4-screenshot-verification-post)
4. [Error Codes](#error-codes)
5. [Rate Limits](#rate-limits)

---

## Authentication

All API requests to the version 1 (`/api/v1/*`) endpoints must include your API key in the request headers.

| Header | Value |
| :--- | :--- |
| `x-api-key` | `YOUR_API_KEY` |

> [!IMPORTANT]
> Keep your API key secure. Do not share it in public repositories or client-side code.

### Example Request (cURL)
```bash
curl -X POST "https://api.yourdomain.com/api/v1/intent" \
  -H "x-api-key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{"message_text": "I need help with my marketing strategy."}'
```

---

## Base URL

All endpoints are hosted at:
`https://<your-deployment-url>/api/v1`

---

## Endpoints

### 1. Intent Detection (POST)
Analyze the intent of a message to determine lead quality and recommended follow-up.

*   **URL:** `/intent`
*   **Method:** `POST`
*   **Body (JSON):**
    *   `message_text` (string, **Required**): The text of the DM to analyze.

#### Response Format (200 OK)
```json
{
  "intent_score": 88,
  "urgency": "high",
  "budget_signals": "detected",
  "technical_sophistication": "advanced",
  "recommended_response": "I've reviewed your current situation, and it sounds like we could really help. Are you free for a quick 15-minute sync this Tuesday?",
  "lead_status": "Hot"
}
```

---

### 2. Profile Analysis (POST)
Analyze an Instagram profile or bio to score lead potential.

*   **URL:** `/profile`
*   **Method:** `POST`
*   **Body (JSON):**
    *   `profile_url` (string, **Optional**): The URL of the profile.
    *   `bio_text` (string, **Optional**): The bio text of the user.
    *   *Note: At least one of these fields must be provided.*

#### Response Format (200 OK)
```json
{
  "lead_score": 92,
  "follower_quality": "high",
  "content_sentiment": "positive",
  "avatar_status": "Ideal Avatar",
  "detected_niche": "High-Ticket Scaling",
  "analysis_summary": "High-intent lead with consistent posting and professional branding."
}
```

---

### 3. Consultant Insights (POST)
Get deeper strategic insights based on profile data.

*   **URL:** `/insights`
*   **Method:** `POST`
*   **Body (JSON):**
    *   `profile_url` (string, **Optional**)
    *   `bio_text` (string, **Optional**)
    *   *Note: At least one of these fields must be provided.*

#### Response Format (200 OK)
```json
{
  "lead_type": "Agency Owner",
  "estimated_revenue": "7-figure",
  "consultant_tag": "High-Value Lead",
  "industry_specific_tagging": "Scaling / SaaS / Consulting",
  "recommendation": "Prioritize for direct outreach via setter."
}
```

---

### 4. Screenshot Verification (POST)
Generate a real-time screenshot of a URL (e.g., for lead proof or profile verification).

*   **URL:** `/screenshot`
*   **Method:** `POST`
*   **Body (JSON):**
    *   `url` (string, **Required**): The URL to screenshot.

#### Response Format (200 OK)
Returns a raw **binary stream** of a PNG image.
*   **Content-Type:** `image/png`

---

## Error Codes

The API uses standard HTTP response codes to indicate success or failure.

| Code | Status | Description |
| :--- | :--- | :--- |
| `200` | OK | The request was successful. |
| `400` | Bad Request | Missing or invalid parameters in the request body. |
| `401` | Unauthorized | Missing or invalid `x-api-key`. |
| `429` | Too Many Requests | The API usage quota for the provided API key has been exceeded. |
| `500` | Internal Server Error | An error occurred on the server while processing the request. |

---

## Rate Limits

IG DM Intel API uses a **quota-based** system rather than a time-window limit. Each API key is assigned a total number of requests it can make.

1.  **Usage Tracking**: Every successful request (excluding OPTIONS) increments the `requests_used` counter for your API key.
2.  **Exceeding Limits**: Once `requests_used` reaches `requests_limit`, the API will return a `429 Usage Limit Exceeded` error.
3.  **Upgrading Quota**: Quotas can be increased via subscription or one-time purchases through the main platform.

> [!TIP]
> You can check your current usage and remaining quota by logging into the dashboard.
