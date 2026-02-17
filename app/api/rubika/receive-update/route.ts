import { apiRequest } from "@/lib/rubika";
import { fetchMenu } from "@/scripts/fetch-menu";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  const payload = (await req.json()) as any;
  // console.log("RECEIVE_UPDATE_RAW:", JSON.stringify(payload));

  const update = payload.update ?? payload;
  // if (!update?.chat_id || !update?.new_message) return NextResponse.json({ ok: true });

  const chatId = update.chat_id as string;
  const msg = update.new_message ?? {};
  const text = typeof msg.text === "string" ? msg.text.trim() : "";
  console.log(text)

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

  console.log(text)
  if (text === "/games") {
    const gameList = await fetchMenu()
    console.log(gameList)
    await apiRequest("sendMessage", {
      chat_id: chatId,
      text: "لیست بازی‌ها 🚀",
      inline_keypad: {
        rows: [
          {
            buttons: [
              {
                id: "games_selection",
                type: "Selection",
                button_text: "انتخاب بازی",
                button_selection: {
                  selection_id: "games_v1",
                  title: "Games",
                  search_type: "None",
                  get_type:"Local",
                  is_multi_selection: false,
                  columns_count: "1",
                  items: gameList.map((g: any) => ({
                    text: g.title,
                    image_url: g.icon,
                    type: "TextImgThu",
                  })),
                },
              },
            ],
          },
        ],
      },
    });

    return NextResponse.json({ ok: true });
  }
}


export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}
