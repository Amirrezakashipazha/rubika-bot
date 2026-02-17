import { apiRequest } from "@/lib/rubika";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const payload = (await req.json()) as any;

    console.log("RECEIVE_INLINE_RAW:", JSON.stringify(payload));

    const inline = payload.inline_message

    const text = inline.text
    const chatId = inline.chat_id

    const buttonId = inline?.aux_data?.button_id ?? null;
    const messageId = inline?.message_id ?? null;


    if (buttonId && buttonId === "share_phone" && messageId && text) {
        await apiRequest("sendMessage", {
            // message_id: messageId,
            chat_id: chatId,
            text: `✅ شماره موبایل دریافت شد: ${text}`,
            chat_keypad_type: "Remove",
        });
        return NextResponse.json({ ok: true });
    }

    if (buttonId && buttonId === "games_selection" && messageId && text) {
        await apiRequest("sendMessage", {
            // message_id: messageId,
            chat_id: chatId,
            text: `✅ را انتخاب کردید ${text} شما `,
            chat_keypad_type: "Remove",
        });
        return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
}

export async function HEAD() {
    return new NextResponse(null, { status: 200 });
}
