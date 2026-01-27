import { apiHeader, fetchMenu } from "@/scripts/fetch-menu";
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
    const text = message.text || "";

    // 1️⃣ Handle contact sharing
    if (message.contact) {
        const phoneNumber = message.contact.phone_number;
        await apiRequest("sendMessage", {
            chat_id: chatId,
            text: `Got your number 👍\nPhone: ${phoneNumber}`,
        });
        return NextResponse.json({ ok: true });
    }

    // 2️⃣ Handle /start
    if (text === "/start") {
        await apiRequest("sendMessage", {
            chat_id: chatId,
            text: "Bale bot is alive 🚀",
        });
    }

    // 3️⃣ Handle /phone
    else if (text === "/phone") {
        await apiRequest("sendMessage", {
            chat_id: chatId,
            text: "Share your phone number:",
            reply_markup: {
                keyboard: [[{ text: "Send phone", request_contact: true }]],
                one_time_keyboard: true,
                resize_keyboard: true,
            },
        });
    }

    // 4️⃣ Handle /menu
    else if (text === "/menu") {
        try {
            const menu = await fetchMenu();
            const homeWidget = menu?.data
                ?.filter(it => it.group === "page__game__main")?.[0]
                ?.widgets.find(w => w.blueprint_unique_name === "wb__square__game__vertical");

            const sourceUrl = homeWidget?.schema_data?.source_url;
            if (!sourceUrl) {
                await apiRequest("sendMessage", {
                    chatId,
                    text: "No games available right now 😢",
                });
                return NextResponse.json({ ok: true });
            }

            const api = await fetch(sourceUrl, { method: "GET", headers: apiHeader });
            const data = await api.json();
            const gameList = data.data?.results || [];

            if (!gameList.length) {
                await apiRequest("sendMessage", {
                    chatId,
                    text: "No games available right now 😢",
                });
                return NextResponse.json({ ok: true });
            }

            // Build keyboard dynamically (2 games per row)
            const keyboard: { text: string }[][] = [];
            for (let i = 0; i < gameList.length; i += 2) {
                const row = [
                    { text: gameList[i].title || `Game ${i + 1}` },
                    gameList[i + 1] ? { text: gameList[i + 1].title } : undefined,
                ].filter(Boolean) as { text: string }[];
                keyboard.push(row);
            }

            await apiRequest("sendMessage", {
                chatId,
                text: "لیست بازی ها 🚀",
                reply_markup: {
                    keyboard,
                    one_time_keyboard: true,
                    resize_keyboard: true,
                },
            });
        } catch (err) {
            console.error(err);
            await apiRequest("sendMessage", {
                chatId,
                text: "Error fetching games 😢",
            });
        }
    }

    // 5️⃣ Handle user selecting a game
    else {
        await apiRequest("sendMessage", {
            chatId,
            text: `You selected: ${text} 🎮`,
        });
    }

    return NextResponse.json({ ok: true });
}
