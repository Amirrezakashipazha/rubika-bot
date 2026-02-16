import { NextRequest, NextResponse } from "next/server";
import { sendRubikaMessage } from "@/lib/rubika";
import { fetchMenu } from "@/scripts/fetch-menu";

type LegacyMessage = {
  text?: string;
  object_guid?: string;
};

type RubikaUpdatePayload = {
  message?: LegacyMessage;
  update?: {
    chat_id?: string;
    new_message?: {
      text?: string;
      sender_id?: string;
      aux_data?: {
        button_id?: string;
      };
    };
  };
};

type GameItem = {
  id: number;
  title: string;
};

function normalizeIranPhoneNumber(input: string) {
  const cleaned = input.replace(/\s|-/g, "");
  const localPattern = /^09\d{9}$/;
  const intlPattern = /^\+989\d{9}$/;

  if (localPattern.test(cleaned)) {
    return cleaned;
  }
  if (intlPattern.test(cleaned)) {
    return `0${cleaned.slice(3)}`;
  }
  return null;
}

function extractIncoming(payload: RubikaUpdatePayload) {
  const text = payload.update?.new_message?.text?.trim() ?? payload.message?.text?.trim();
  const chatId = payload.update?.chat_id ?? payload.message?.object_guid;
  const buttonId = payload.update?.new_message?.aux_data?.button_id;
  return { text, chatId, buttonId };
}

function buildGameKeypad(games: GameItem[]) {
  const rows: Array<{ buttons: Array<{ id: string; type: "Simple"; button_text: string }> }> =
    [];
  for (let i = 0; i < games.length; i += 2) {
    const buttons: Array<{ id: string; type: "Simple"; button_text: string }> = [
      { id: `game_${games[i].id}`, type: "Simple", button_text: games[i].title },
    ];
    if (games[i + 1]) {
      buttons.push({
        id: `game_${games[i + 1].id}`,
        type: "Simple",
        button_text: games[i + 1].title,
      });
    }
    rows.push({ buttons });
  }
  return rows;
}

async function sendMenu(chatId: string) {
  const gameList = (await fetchMenu()) as GameItem[];
  if (!gameList?.length) {
    await sendRubikaMessage(chatId, "No games are available right now.");
    return;
  }

  await sendRubikaMessage(chatId, "Game list:", {
    chat_keypad_type: "New",
    chat_keypad: {
      rows: buildGameKeypad(gameList),
      resize_keyboard: true,
      one_time_keyboard: false,
    },
  });
}

async function sendSelectedGame(chatId: string, game: GameItem) {
  const gameUrl = `https://stage.gamebox.ir/t/game/${game.id}?shTitle=${encodeURIComponent(
    game.title
  )}`;
  await sendRubikaMessage(chatId, `You selected: ${game.title}\nPlay: ${gameUrl}`);
}

async function sendPhonePrompt(chatId: string) {
  await sendRubikaMessage(
    chatId,
    "Please send your mobile number.\nExample: 09123456789\nYou can also use: /phone 09123456789"
  );
}

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as RubikaUpdatePayload;
  const { text, chatId, buttonId } = extractIncoming(payload);

  if (!chatId) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  if (buttonId === "menu" || text === "/menu") {
    await sendMenu(chatId);
    return NextResponse.json({ ok: true });
  }

  if (buttonId === "help" || text === "/help") {
    await sendRubikaMessage(
      chatId,
      "Commands:\n/start\n/help\n/menu\n/game\n/phone\nSelect a game from /menu"
    );
    return NextResponse.json({ ok: true });
  }

  if (buttonId === "send_phone" || text === "/phone") {
    await sendPhonePrompt(chatId);
    return NextResponse.json({ ok: true });
  }

  if (text === "/start") {
    await sendRubikaMessage(
      chatId,
      "Welcome. Rubika bot is active.\nUse buttons below.",
      {
        chat_keypad_type: "New",
        chat_keypad: {
          rows: [
            {
              buttons: [
                { id: "menu", type: "Simple", button_text: "Game List" },
                { id: "help", type: "Simple", button_text: "Help" },
                { id: "send_phone", type: "Simple", button_text: "Send Mobile" },
              ],
            },
          ],
          resize_keyboard: true,
          one_time_keyboard: false,
        },
      }
    );
    return NextResponse.json({ ok: true });
  }

  if (text === "/game") {
    await sendRubikaMessage(chatId, "Use /menu and choose a game to play.");
    return NextResponse.json({ ok: true });
  }

  if (text?.startsWith("/phone ")) {
    const maybePhone = normalizeIranPhoneNumber(text.replace("/phone ", "").trim());
    if (!maybePhone) {
      await sendRubikaMessage(chatId, "Invalid number format. Use: 09123456789");
      return NextResponse.json({ ok: true });
    }
    await sendRubikaMessage(chatId, `Your mobile number was received: ${maybePhone}`);
    return NextResponse.json({ ok: true });
  }

  if (text) {
    const maybePhone = normalizeIranPhoneNumber(text);
    if (maybePhone) {
      await sendRubikaMessage(chatId, `Your mobile number was received: ${maybePhone}`);
      return NextResponse.json({ ok: true });
    }
  }

  if (buttonId?.startsWith("game_")) {
    const gameId = Number(buttonId.replace("game_", ""));
    const gameList = (await fetchMenu()) as GameItem[];
    const selectedGame = gameList.find((g) => g.id === gameId);
    if (selectedGame) {
      await sendSelectedGame(chatId, selectedGame);
    } else {
      await sendRubikaMessage(chatId, "Selected game was not found. Please try /menu again.");
    }
    return NextResponse.json({ ok: true });
  }

  if (text) {
    const gameList = (await fetchMenu()) as GameItem[];
    const selectedGame = gameList.find((g) => g.title === text);
    if (selectedGame) {
      await sendSelectedGame(chatId, selectedGame);
      return NextResponse.json({ ok: true });
    }
  }

  await sendRubikaMessage(chatId, "Use /menu to view games.");
  return NextResponse.json({ ok: true });
}
