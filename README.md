# Zero-Knowledge Secret Sharer

Share a secret through a one-time link. The text is encrypted in your browser with AES (crypto-js) before it is sent, and the key is kept in the link's `#fragment`, so the server only ever stores ciphertext. The secret is deleted once it has been read.

**Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Supabase.

## Run it

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase values
npm run dev
```

Set `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` and optionally `NEXT_PUBLIC_APP_URL`. Secrets are stored in a `secrets` table with an `encrypted_text` column.

> Note: the repo contains two copies of the app (`app/` and `src/app/`). Only one is used by Next.js, and the other should be removed.
