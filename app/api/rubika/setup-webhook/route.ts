import { NextRequest, NextResponse } from "next/server";

const TOKEN = process.env.RUBIKA_BOT_TOKEN!;
const BASE_URL = `https://botapi.rubika.ir/v3/${TOKEN}`;


export async function GET(request: NextRequest) {
  try {

    const api = await fetch(`${BASE_URL}/updateBotEndpoints`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "url": "https://rubika-bot-one.vercel.app/api/rubika/receive-update",
        "type": "GetSelectionItem"
      })
    });

    const res = await api.json()

    return NextResponse.json(res);

  } catch (error) {
    return NextResponse.json({ ok: false, error: error });
  }
}
