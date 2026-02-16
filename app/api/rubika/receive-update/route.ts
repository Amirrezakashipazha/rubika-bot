import { NextRequest, NextResponse } from "next/server";

const TOKEN = process.env.RUBIKA_BOT_TOKEN!;
const BASE_URL = `https://botapi.rubika.ir/v3/${TOKEN}`;

async function apiRequest(method: string, body: unknown) {
  const res = await fetch(`${BASE_URL}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json().catch(() => null);
}

export async function POST(req: NextRequest) {
  const payload = (await req.json()) as any;
  console.log("RECEIVE_UPDATE_RAW:", JSON.stringify(payload));

  const update = payload.update ?? payload;
  if (!update?.chat_id || !update?.new_message) return NextResponse.json({ ok: true });

  const chatId = update.chat_id as string;
  const msg = update.new_message ?? {};
  const text = typeof msg.text === "string" ? msg.text.trim() : "";

  const phone = msg?.contact_message?.phone_number ?? null;

  if (phone) {
    await apiRequest("sendMessage", {
      chat_id: chatId,
      text: `✅ phone: ${phone}`,
      chat_keypad_type: "Remove",
    });
    return NextResponse.json({ ok: true });
  }

  if (text === "/start" || text === "/contact") {
    await apiRequest("sendMessage", {
      chat_id: chatId,
      text: "Send your phone:",
      inline_keypad: {
        rows: [
          {
            buttons: [
              {
                id: "share_phone",
                type: "AskMyPhoneNumber",
                button_text: "ارسال شماره موبایل",
              },
            ],
          },
        ],
        
      },
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}
