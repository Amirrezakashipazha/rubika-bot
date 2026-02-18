import { apiRequest, GAME_APP_URL } from "@/lib/rubika";
import { NextRequest, NextResponse } from "next/server";
import router from "next/navigation"

export async function POST(req: NextRequest) {
    const payload = (await req.json()) as any;


    const inline = payload.inline_message
    const phone = inline.text
    const text = inline.text.split("*")?.[1]
    const id = inline.text.split("*")?.[0]

    const chatId = inline.chat_id

    const buttonId = inline?.aux_data?.button_id ?? null;
    const messageId = inline?.message_id ?? null;


    if (buttonId && buttonId === "share_phone" && messageId && phone) {
        await apiRequest("sendMessage", {
            // message_id: messageId,
            chat_id: chatId,
            text: `✅ شماره موبایل دریافت شد: ${phone}`,
            chat_keypad_type: "Remove",
        });
        return NextResponse.json({ ok: true });
    }


    if (buttonId && buttonId === "games_selection" && messageId && text) {

        await apiRequest("sendMessage", {
            chat_id: chatId,
            text: ` \n https://stage.gamebox.ir/t/game/${id}?shTitle=${text} شما ${text} را انتخاب کردید ✅`,
            chat_keypad_type: "Remove",
        });
        return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
}

export async function HEAD() {
    return new NextResponse(null, { status: 200 });
}
