import { NextRequest, NextResponse } from "next/server";

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
    const payload = (await req.json()) as Record<string, any>;

    const update = payload.update;
    const inlineMessage = payload.inline_message;

    console.log("inlineMessage : ", inlineMessage);

    if (!update) return NextResponse.json({ ok: true });

    const message = update.new_message;
    const chatId = update.chat_id;
    const text = (message?.text || "").trim();

    console.log("message : ", message)

    if (text === "/help") {
      await apiRequest("sendMessage", {
        chat_id: chatId,
        text: "راهنما",
      });
      return NextResponse.json({ ok: true });
    }

    if (text === "/contact") {
      await apiRequest("sendMessage", {
        chat_id: chatId,
        text: "دریافت شماره تماس:",
        chat_keypad: {
          rows: [
            {
              buttons: [
                {
                  id: "my_contact",
                  type: "AskMyPhoneNumber",
                  button_text: "شماره موبایل من",
                },
              ],
            },
          ],
        },
        chat_keypad_type: "New",
      });
      return NextResponse.json({ ok: true });
    }

    if (text === "/location") {
      await apiRequest("sendMessage", {
        chat_id: chatId,
        text: "دریافت لوکیشن:",
        chat_keypad: {
          rows: [
            {
              buttons: [
                {
                  id: "my_location",
                  type: "AskMyLocation",
                  button_text: "لوکیشن من",
                },
              ],
            },
          ],
        },
        chat_keypad_type: "New",
      });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error("receive-update error:", error);
    return NextResponse.json({ ok: true, error: "temporary_failure" });
  }
}
