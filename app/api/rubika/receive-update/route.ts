import { apiRequest } from "@/lib/rubika";
import { fetchMenu } from "@/scripts/fetch-menu";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  const payload = (await req.json()) as any;

  const update = payload.update ?? payload;

  const chatId = update.chat_id as string;
  const msg = update.new_message ?? {};
  const text = typeof msg.text === "string" ? msg.text.trim() : "";


  if (text === "/start" || text === "/contact") {
    await apiRequest("sendMessage", {
      chat_id: chatId,
      text: "لطفا شماره موبایل خود را بفرستید:",
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

  if (text === "/games") {
    const gameList = await fetchMenu()
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
                  get_type: "Local",
                  is_multi_selection: false,
                  columns_count: "1",
                  items: gameList.map((g: any) => ({
                    text: `${g.id}*${g.title}`,
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
