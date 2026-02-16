This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Rubika Bot

This project now includes a Rubika bot implementation using the official Bot API webhook model.

### Environment variables

Add these to `.env`:

```bash
RUBIKA_BOT_TOKEN=your-rubika-bot-token
RUBIKA_WEBHOOK_BASE_URL=https://your-public-domain
```

### Routes

- `POST /api/rubika/receive-update`: main bot updates (`/start`, `/help`, `/menu`, `/game`, `/phone`) and game selection via `fetchMenu()`
- `POST /api/rubika/receive-inline`: inline update receiver
- `GET /api/rubika/setup-webhook`: register webhook endpoints
- `POST /api/rubika/setup-webhook` with JSON body `{ "baseUrl": "https://your-domain" }`: register webhook endpoints

### Setup

1. Deploy this app to a public HTTPS URL.
2. Set `RUBIKA_BOT_TOKEN` and `RUBIKA_WEBHOOK_BASE_URL`.
3. Open:

```text
https://your-domain/api/rubika/setup-webhook
```

That calls `updateBotEndpoints` and registers:

- `ReceiveUpdate -> /api/rubika/receive-update`
- `ReceiveInlineMessage -> /api/rubika/receive-inline`

### Buttons

After `/start`, the bot shows keypad buttons:

- `Game List`: fetches data from `fetchMenu()` and shows selectable games
- `Help`: prints command guide
- `Send Mobile`: asks user to send mobile number

Accepted mobile formats:

- `09123456789`
- `+989123456789`
