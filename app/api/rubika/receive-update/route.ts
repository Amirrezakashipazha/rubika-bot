import { NextRequest, NextResponse } from "next/server";
import { sendRubikaMessage } from "@/lib/rubika";
import { fetchMenu } from "@/scripts/fetch-menu";


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

    const update = await req.json();
    const message = update.message;

    console.log("message : ",message)

    if (!message) return NextResponse.json({ ok: true });

    const chatId = message.chat.id;
    const text = message.text || "";

    console.log("chatId : ",chatId)
    console.log("text : ",text)

    // 1️⃣ Handle contact sharing
    // if (message.contact) {
    //   const phoneNumber = message.contact.phone_number;
    //   await apiRequest("sendMessage", {
    //     chat_id: chatId,
    //     text: `شماره موبایل دریافتی: ${phoneNumber}`,
    //   });
    //   return NextResponse.json({ ok: true });
    // } 

    if (text === "/help") {
      await apiRequest("sendMessage", {
        chat_id: chatId,
        text: "راهنما",
      });
    }


    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("receive-update error:", error);
    return NextResponse.json({ ok: true, error: "temporary_failure" });
  }
}
