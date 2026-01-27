import { fetchMenu } from "@/scripts/fetch-menu";
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

async function sendGameList(chatId: number) {
    const gameList = await fetchMenu();

    if (!gameList || !gameList.length) {
        await apiRequest("sendMessage", {
            chat_id: chatId,
            text: "بازی در حال حاضر موجود نیست 😢",
        });
        return;
    }

    // Build inline keyboard dynamically (2 games per row)
    const keyboard: { text: string; callback_data: string }[][] = [];
    for (let i = 0; i < gameList.length; i += 2) {
        const row = [
            { text: gameList[i].title, callback_data: `GAME_SELECTED_${gameList[i].title}` },
            gameList[i + 1] ? { text: gameList[i + 1].title, callback_data: `GAME_SELECTED_${gameList[i + 1].title}` } : undefined,
        ].filter(Boolean) as { text: string; callback_data: string }[];
        keyboard.push(row);
    }

    await apiRequest("sendMessage", {
        chat_id: chatId,
        text: "لیست بازی ها 🚀",
        reply_markup: { inline_keyboard: keyboard },
    });
}

export async function POST(req: NextRequest) {
    const update = await req.json();
    const message = update.message;

    // 1️⃣ Handle callback queries (inline keyboard)
    if (update.callback_query) {
        const data = update.callback_query.data;
        const chatId = update.callback_query.message.chat.id;

        if (data.includes("GAME_SELECTED_")) {
            const gameTitle = data.replace("GAME_SELECTED_", "");
            const gameList = await fetchMenu();
            const selectedGame = gameList.find(g => g.title === gameTitle);

            if (selectedGame) {
                await apiRequest("sendMessage", {
                    chat_id: chatId,
                    text: "شروع بازی 🎮",
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "بازی کن ▶️",
                                    web_app: {
                                        url: `https://stage.gamebox.ir/t/game/${selectedGame.id}?shTitle=${encodeURIComponent(selectedGame.title)}`,
                                    },
                                },
                            ],
                        ],
                    },
                });
            }
        }

        return NextResponse.json({ ok: true });
    }

    if (!message) return NextResponse.json({ ok: true });

    const chatId = message.chat.id;
    const text = message.text || "";

    // 2️⃣ Handle contact sharing
    if (message.contact) {
        const phoneNumber = message.contact.phone_number;
        await apiRequest("sendMessage", {
            chat_id: chatId,
            text: `شماره موبایل دریافتی: ${phoneNumber}`,
        });
        return NextResponse.json({ ok: true });
    }

    // 3️⃣ Handle text messages and commands
    switch (text) {
        case "/start":
            await apiRequest("sendMessage", {
                chatId,
                text: "شروع ربات 🚀",
                reply_markup: {
                    keyboard: [
                        ["🎮 بازی کن", "📜 لیست بازی‌ها"],
                        ["📞 احراز هویت", "ℹ️ راهنما"],
                    ],
                    resize_keyboard: true,
                },
            });
            break;

        case "/phone":
        case "📞 احراز هویت":
            await apiRequest("sendMessage", {
                chatId,
                text: "لطفا شماره موبایل خود را بفرستید:",
                reply_markup: {
                    keyboard: [[{ text: "ارسال شماره موبایل", request_contact: true }]],
                    one_time_keyboard: true,
                    resize_keyboard: true,
                },
            });
            break;

        case "🎮 بازی کن":
            await apiRequest("sendMessage", {
                chatId,
                text: " بازی کن 🎮",
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "بازی کن ▶️",
                                web_app: { url: `https://stage.gamebox.ir/game` },
                            },
                        ],
                    ],
                },
            });
            break;

        case "ℹ️ راهنما":
            await apiRequest("sendMessage", {
                chatId,
                text: "راهنما",
            });
            break;

        case "📜 لیست بازی‌ها":
            try {
                await sendGameList(chatId);
            } catch (err) {
                console.error(err);
                await apiRequest("sendMessage", {
                    chatId,
                    text: "Error fetching games 😢",
                });
            }
            break;

        default:
            // Optional: handle unknown messages
            await apiRequest("sendMessage", {
                chatId,
                text: "متوجه نشدم 😅 لطفا یکی از گزینه‌ها را انتخاب کنید.",
            });
    }

    return NextResponse.json({ ok: true });
}
