# HERMES — Serverless Telegram Bot + WASM Agent

**Full-stack, local-first, policy-gated AI agent with Telegram bot sync.**

🚀 **Status:** Ready to deploy

---

## Quick Deploy (5 minutes)

### 1. Clone & Install

```bash
git clone https://github.com/silentnoisehun/hermes-pwa
cd hermes-pwa
npm install
```

### 2. CloudFlare Workers Bot

```bash
cd ../hermes-bot
npm install
wrangler login

wrangler secret put TELEGRAM_TOKEN
wrangler secret put BOT_SECRET

wrangler deploy
```

**Bot URL:** `https://hermes-bot.<your-subdomain>.workers.dev`

### 3. Configure Telegram Webhook

```bash
curl -X POST https://api.telegram.org/bot<TOKEN>/setWebhook \
  -H 'Content-Type: application/json' \
  -d '{
    "url": "https://hermes-bot.<your-subdomain>.workers.dev/webhook",
    "secret_token": "<your_secret>"
  }'
```

### 4. Update PWA Bot URL

Edit `docs/index.html`:

```javascript
private botUrl: string = 'https://hermes-bot.<your-subdomain>.workers.dev';
```

```bash
git add docs/index.html
git commit -m "Config: bot URL"
git push
```

### 5. Enable GitHub Pages

Settings → Pages → Source: `main` branch, `/docs` folder

**Live:** https://silentnoisehun.github.io/hermes-pwa/

---

## Architecture

```
┌─ Telegram User ─┐
│                 │
└─────────┬───────┘
          │ (Telegram Bot API)
          ▼
┌──────────────────────────────────────────┐
│  CloudFlare Workers (Bot Backend)        │
│                                          │
│  POST /webhook                           │
│    ├─ /start                             │
│    ├─ /recall <query>                    │
│    ├─ /store <text>                      │
│    └─ /status                            │
│                                          │
│  [Durable Object: MemoryStore]           │
└──────────────────────────────────────────┘
          │ (JSON memory)
          ▼
┌──────────────────────────────────────────┐
│  GitHub Pages PWA (Browser)              │
│                                          │
│  /hermes-pwa/                            │
│    ├─ index.html (Chat UI)               │
│    ├─ manifest.json (PWA metadata)       │
│    ├─ sw.js (Service Worker)             │
│    └─ localStorage (Offline cache)       │
└──────────────────────────────────────────┘
```

---

## Commands

| Command | Description |
|---------|-------------|
| `/start` | Show help |
| `/recall <query>` | Search memory |
| `/store <text>` | Save to memory |
| `/status` | Memory stats |
| Any message | Auto-store |

---

## Offline

- **PWA:** Caches locally, syncs on reconnect
- **Bot:** Stores in Durable Objects
- **Status:** Shows online/offline state

---

## Documentation

- [Bot Backend](./hermes-bot/README.md)
- [PWA Frontend](./pwa/README.md)
- [Sync Protocol](./SYNC.md)

---

## License

MIT

---

**By:** Máté R — Silent Noise

**HERMES — Browser-only · WASM Agent · Sandboxed Tools · Explicit Control**
