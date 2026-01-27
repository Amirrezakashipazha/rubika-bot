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
    if (!message) return NextResponse.json({ ok: true });

    const chatId = message.chat.id;
    const text = message.text || "";

    console.log('text is : ', text)

    // 1️⃣ Handle contact sharing
    if (message.contact) {
        const phoneNumber = message.contact.phone_number;
        await apiRequest("sendMessage", {
            chat_id: chatId,
            text: `Got your number 👍\nPhone: ${phoneNumber}`,
        });
        return NextResponse.json({ ok: true });
    }

    // 2️⃣ /start command
    if (text === "/start") {
        await apiRequest("sendMessage", {
            chat_id: chatId,
            text: "Bale bot is alive 🚀",
        });
    }

    // 3️⃣ /phone command
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

    // 4️⃣ /menu command
    else if (text === "/menu") {
        try {
            const gameList = await fetchMenu(); // your static game list

            if (!gameList || !gameList.length) {
                await apiRequest("sendMessage", {
                    chat_id: chatId,
                    text: "No games available right now 😢",
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

    // 5️⃣ User selects a game
    else {
        console.log('is in 5️⃣ User selects a game')

        const gameList = await fetchMenu();
        const selectedGame = gameList.find(g => g.title === text);

        console.log("selectedGame : ", selectedGame)

        if (selectedGame) {
            // await apiRequest("sendMessage", {
            //     chat_id: chatId,
            //     text: `شما ${selectedGame.title} را انتخاب کردید 🎮`,
            // });
            try {
                await apiRequest("sendMessage", {
                    chat_id: chatId,
                    text: `شما ${selectedGame.title} را انتخاب کردید 🎮`,
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "بازی کن ▶️",
                                    web_app: {
                                        url: `https://stage.gamebox.ir/t/game/${selectedGame.id}?shTitle=${selectedGame.title}`,
                                    },
                                },
                            ],
                        ],
                    },
                });
            } catch (error) {
                console.log('web app error : ', error)
            }
        } else {
            await apiRequest("sendMessage", {
                chat_id: chatId,
                text: `You said: ${text}`,
            });
        }
    }

    return NextResponse.json({ ok: true });
}
