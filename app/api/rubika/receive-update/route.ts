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

    const update: Update = payload.update;
    if (!update) return NextResponse.json({ ok: true });

    const message = update.new_message;
    const chatId = update.chat_id;
    const text = message.text || "";
    const contact = message.contact;

    console.log("chatId:", chatId);
    console.log("text:", text);

    // Handle contact payload sent via keyboard button.
    if (contact?.phone_number) {
      // If the platform provides contact user_id, validate ownership.
      if (contact.user_id && contact.user_id !== message.sender_id) {
        await apiRequest("sendMessage", {
          chat_id: chatId,
          text: "لطفا فقط شماره موبایل خودتان را ارسال کنید.",
        });
        return NextResponse.json({ ok: true });
      }

      await apiRequest("sendMessage", {
        chat_id: chatId,
        text: `شماره موبایل شما دریافت شد: ${contact.phone_number}`,
        reply_markup: {
          remove_keyboard: true,
        },
      });
      return NextResponse.json({ ok: true });
    }

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
        text: "لطفا شماره موبایل خود را با دکمه زیر ارسال کنید:",
        reply_markup: {
          keyboard: [[{ text: "ارسال شماره موبایل", request_contact: true }]],
          one_time_keyboard: true,
          resize_keyboard: true,
        },
      });
      return NextResponse.json({ ok: true });
    }

    // Reject plain text numbers and require contact-sharing button.
    if (/^[+]?[\d\s\-()]{8,}$/.test(text)) {
      await apiRequest("sendMessage", {
        chat_id: chatId,
        text: "برای امنیت بیشتر، لطفا شماره را با دکمه «ارسال شماره موبایل» بفرستید.",
      });
      return NextResponse.json({ ok: true });
    }

    if (text === "/location") {
      await apiRequest("sendLocation", {
        chat_id: chatId,
        text: "موقعیت مکانی خود را بفرستید",
      });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("receive-update error:", error);
    return NextResponse.json({ ok: true, error: "temporary_failure" });
  }
}
