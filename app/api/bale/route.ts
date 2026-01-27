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

export async function POST(req: NextRequest) {
    const update = await req.json();
    const message = update.message;
    const callbackQuery = update.callback_query


    if (!message) return NextResponse.json({ ok: true });

    const chatId = message.chat.id;
    const text = message.text || "";

    // 1️⃣ Handle contact sharing
    if (message.contact) {
        const phoneNumber = message.contact.phone_number;
        await apiRequest("sendMessage", {
            chat_id: chatId,
            text: `شماره موبایل دریافتی: ${phoneNumber}`,
        });
        return NextResponse.json({ ok: true });
    }

    if (callbackQuery === "menu") {
        try {
            const gameList = await fetchMenu(); // your static game list

            if (!gameList || !gameList.length) {
                await apiRequest("sendMessage", {
                    chat_id: chatId,
                    text: "بازی در حال حاضر موجود نیست 😢",
                });
                return NextResponse.json({ ok: true });
            }

            // Build keyboard dynamically (2 games per row)
            const keyboard: { text: string }[][] = [];
            for (let i = 0; i < gameList.length; i += 2) {
                const row = [
                    { text: gameList[i].title },
                    gameList[i + 1] ? { text: gameList[i + 1].title } : undefined,
                ].filter(Boolean) as { text: string }[];
                keyboard.push(row);
            }

            await apiRequest("sendMessage", {
                chat_id: chatId,
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
                chat_id: chatId,
                text: "Error fetching games 😢",
            });
        }
    } else if (callbackQuery === "help") {
        await apiRequest("sendMessage", {
            chat_id: chatId,
            text: "راهنما",
        });
    }
    // 2️⃣ /start command
    if (text === "/start") {
        await apiRequest("sendMessage", {
            chat_id: chatId,
            text: "شروع ربات 🚀",
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "راهنما",
                            callback_data: "help"
                        },
                        {
                            text: "لیست بازی ها",
                            callback_data: "menu"
                        }
                    ]
                ],
            },
        });
    }

    // 2️⃣ /start command
    if (text === "/help") {
        await apiRequest("sendMessage", {
            chat_id: chatId,
            text: "راهنما",
        });
    }

    // 3️⃣ /phone command
    else if (text === "/phone") {
        await apiRequest("sendMessage", {
            chat_id: chatId,
            text: "لطفا شماره موبایل خود را بفرستید:",
            reply_markup: {
                keyboard: [[{ text: "ارسال شماره موبایل", request_contact: true }]],
                one_time_keyboard: true,
                resize_keyboard: true,
            },
        });
    } else if (text === "/game") {
        await apiRequest("sendMessage", {
            chat_id: chatId,
            text: "شروع بازی کردن 🚀",
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "بازی کن ▶️",
                            web_app: {
                                url: `https://stage.gamebox.ir/game`,
                            },
                        },
                    ],
                ]
            },
        });
        await apiRequest("sendMessage", {
            chat_id: chatId,
            text: "لیست بازی ها 🚀",


        });
    }
    // 4️⃣ /menu command
    else if (text === "/menu") {
        try {
            const gameList = await fetchMenu(); // your static game list

            if (!gameList || !gameList.length) {
                await apiRequest("sendMessage", {
                    chat_id: chatId,
                    text: "بازی در حال حاضر موجود نیست 😢",
                });
                return NextResponse.json({ ok: true });
            }

            // Build keyboard dynamically (2 games per row)
            const keyboard: { text: string }[][] = [];
            for (let i = 0; i < gameList.length; i += 2) {
                const row = [
                    { text: gameList[i].title },
                    gameList[i + 1] ? { text: gameList[i + 1].title } : undefined,
                ].filter(Boolean) as { text: string }[];
                keyboard.push(row);
            }

            await apiRequest("sendMessage", {
                chat_id: chatId,
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
                chat_id: chatId,
                text: "Error fetching games 😢",
            });
        }
    }

    else {
        const gameList = await fetchMenu();
        const selectedGame = gameList.find(g => g.title === text);

        if (selectedGame) {
            await apiRequest("sendMessage", {
                chat_id: chatId,
                text: `شما ${selectedGame.title} را انتخاب کردید 🎮`,
            });

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
