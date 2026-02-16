import { NextRequest, NextResponse } from "next/server";
import { Update } from "@/model/main.model";

const TOKEN = process.env.RUBIKA_BOT_TOKEN!;
const BASE_URL = `https://botapi.rubika.ir/v3/${TOKEN}`;

async function apiRequest(method: string, body: unknown) {
  const res = await fetch(`${BASE_URL}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function POST(req: NextRequest) {
  try {

    const payload = await req.json();
    console.log("payload : ", payload)

    const update: Update = payload.update;
    if (!update) return NextResponse.json({ ok: true });

    const message = update.new_message;
    const chatId = update.chat_id;
    const text = message.text || "";


    if (text === "/help") {
      await apiRequest("sendMessage", {
        chat_id: chatId,
        text: "راهنما",
      });
      return NextResponse.json({ ok: true });
    }


    if (text === "/open") {
      await apiRequest("sendMessage", {
        chat_id: chatId,
        text: "Open the app:",
        inline_keypad: {
          rows: [
            {
              buttons: [
                {
                  id: "open_ext",
                  type: "Link",
                  button_text: "Open App",
                  url: "https://www.google.com",
                },
              ],
            },
          ],
        },
      });
    }


    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("receive-update error:", error);
    return NextResponse.json({ ok: true, error: "temporary_failure" });
  }
}
