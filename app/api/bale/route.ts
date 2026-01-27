import { NextRequest,NextResponse } from "next/server";

const TOKEN = process.env.BALE_BOT_TOKEN!;
const BASE_URL = `https://tapi.bale.ai/bot${TOKEN}`;


async function apiRequest(method: string, body: unknown) {
  const res = await fetch(`${BASE_URL}/${method}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function POST(req: NextRequest) {
  const update = await req.json();

  // Bale sends updates in same shape as Telegram (update.message, etc.)
  const message = update.message;
  if (!message) {
    return NextResponse.json({ ok: true });
  }

  const chatId = message.chat.id;
  const text = message.text || "";

  // simple command
  if (text === "/start") {
    await apiRequest("sendMessage", {
      chat_id: chatId,
      text: "Bale bot is alive 🚀",
    });
  } else {
    // echo
    await apiRequest("sendMessage", {
      chat_id: chatId,
      text: `You said: ${text}`,
    });
  }

  return NextResponse.json({ ok: true });
}
