import { NextRequest, NextResponse } from "next/server";

const TOKEN = process.env.BALE_BOT_TOKEN!;
const BASE_URL = `https://tapi.bale.ai/bot${TOKEN}`;

async function apiRequest(method: string, body: unknown) {
    const res = await fetch(`${BASE_URL}/${method}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    return res.json();
}

export async function POST(req: NextRequest) {
    const update = await req.json();
    const message = update.message;
    if (!message) return NextResponse.json({ ok: true });

    const chatId = message.chat.id;

    // Check if user sent contact
    if (message.contact) {
        const phoneNumber = message.contact.phone_number;
        await apiRequest("sendMessage", {
            chat_id: chatId,
            text: `Got your number 👍\nPhone: ${phoneNumber}`,
        });
        return NextResponse.json({ ok: true });
    }

    const text = message.text || "";

    if (text === "/start") {
        await apiRequest("sendMessage", {
            chat_id: chatId,
            text: "Bale bot is alive 🚀",
        });
    } else if (text === "/phone") {
        // ask for phone
        await apiRequest("sendMessage", {
            chat_id: chatId,
            text: "Share your phone number:",
            reply_markup: {
                keyboard: [
                    [
                        { text: "Send phone", request_contact: true },
                    ],
                ],
                one_time_keyboard: true,
                resize_keyboard: true,
            },
        });
    } else {
        await apiRequest("sendMessage", {
            chat_id: chatId,
            text: `You said: ${text}`,
        });
    }

    return NextResponse.json({ ok: true });
}
