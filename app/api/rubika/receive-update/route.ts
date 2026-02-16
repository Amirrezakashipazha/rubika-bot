import { apiRequest } from "@/lib/rubika";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  const payload = (await req.json()) as any;
  // console.log("RECEIVE_UPDATE_RAW:", JSON.stringify(payload));

  const update = payload.update ?? payload;
  // if (!update?.chat_id || !update?.new_message) return NextResponse.json({ ok: true });

  const chatId = update.chat_id as string;
  const msg = update.new_message ?? {};
  const text = typeof msg.text === "string" ? msg.text.trim() : "";

  // const phone = msg?.contact_message?.phone_number ?? null;

  // if (phone) {
  //   await apiRequest("sendMessage", {
  //     chat_id: chatId,
  //     text: `✅ phone: ${phone}`,
  //     chat_keypad_type: "Remove",
  //   });
  //   return NextResponse.json({ ok: true });
  // }

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
