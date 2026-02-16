import { NextResponse } from "next/server";

const TOKEN = process.env.RUBIKA_BOT_TOKEN!;
const BASE_URL = `https://botapi.rubika.ir/v3/${TOKEN}`;
const DEFAULT_BASE = process.env.RUBIKA_WEBHOOK_BASE_URL!;

type EndpointType = "ReceiveUpdate" | "ReceiveInlineMessage";

async function registerEndpoint(url: string, type: EndpointType) {
  const res = await fetch(`${BASE_URL}/updateBotEndpoints`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, type }),
  });
  return res.json();
}

export async function GET() {
  if (!DEFAULT_BASE) return NextResponse.json({ ok: false, error: "RUBIKA_WEBHOOK_BASE_URL missing" });

  const receiveUpdateUrl = `${DEFAULT_BASE}/api/rubika/receive-update`;
  const receiveInlineUrl = `${DEFAULT_BASE}/api/rubika/receive-inline`;

  const results = await Promise.all([
    registerEndpoint(receiveUpdateUrl, "ReceiveUpdate"),
    registerEndpoint(receiveInlineUrl, "ReceiveInlineMessage"),
  ]);

  return NextResponse.json({
    ok: true,
    receiveUpdateUrl,
    receiveInlineUrl,
    results,
  });
}
