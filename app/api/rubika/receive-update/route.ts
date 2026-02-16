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

const GAME_APP_URL = "https://stage.gamebox.ir/game";
const MAX_MENU_GAMES = 12;

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

function normalizeCommand(text?: string) {
  if (!text?.startsWith("/")) {
    return null;
  }

  const firstToken = text.split(/\s+/)[0];
  return firstToken.toLowerCase().split("@")[0];
}

function sanitizeGameList(input: unknown): GameItem[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    .map((item) => ({
      id: Number(item.id),
      title: String(item.title ?? "").trim(),
    }))
    .filter((item) => Number.isFinite(item.id) && item.id > 0 && item.title.length > 0);
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
  const gameList = sanitizeGameList(await fetchMenu());
  if (!gameList?.length) {
    await sendRubikaMessage(chatId, "No games are available right now.");
    return;
  }

  const limitedGames = gameList.slice(0, MAX_MENU_GAMES);

  try {
    await sendRubikaMessage(chatId, "Game list:", {
      chat_keypad_type: "New",
      chat_keypad: {
        rows: buildGameKeypad(limitedGames),
        resize_keyboard: true,
        one_time_keyboard: false,
      },
    });
  } catch (error) {
    console.error("sendMenu keypad failed, using text fallback:", error);
    const fallbackList = limitedGames
      .map((game, index) => `${index + 1}. ${game.title}`)
      .join("\n");
    await sendRubikaMessage(
      chatId,
      `Game list:\n${fallbackList}\n\nPlease tap /menu again if keypad does not appear.`
    );
  }
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

async function sendStartGame(chatId: string) {
  await sendRubikaMessage(chatId, `Start game:\n${GAME_APP_URL}`);
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as RubikaUpdatePayload;
    const { text, chatId, buttonId } = extractIncoming(payload);
    const command = normalizeCommand(text);

    if (!chatId) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    if (buttonId === "menu" || command === "/menu") {
      await sendMenu(chatId);
      return NextResponse.json({ ok: true });
    }

    if (buttonId === "help" || command === "/help") {
      await sendRubikaMessage(
        chatId,
        "Commands:\n/start\n/menu\n/game\n/help\n/phone"
      );
      return NextResponse.json({ ok: true });
    }

    if (buttonId === "start_game" || command === "/game") {
      await sendStartGame(chatId);
      return NextResponse.json({ ok: true });
    }

    if (buttonId === "send_phone" || command === "/phone") {
      await sendPhonePrompt(chatId);
      return NextResponse.json({ ok: true });
    }

    if (command === "/start") {
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
                  { id: "start_game", type: "Simple", button_text: "Start Game" },
                ],
              },
              {
                buttons: [
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
      const gameList = sanitizeGameList(await fetchMenu());
      const selectedGame = gameList.find((g) => g.id === gameId);
      if (selectedGame) {
        await sendSelectedGame(chatId, selectedGame);
      } else {
        await sendRubikaMessage(chatId, "Selected game was not found. Please try /menu again.");
      }
      return NextResponse.json({ ok: true });
    }

    if (text) {
      const gameList = sanitizeGameList(await fetchMenu());
      const selectedGame = gameList.find((g) => g.title === text);
      if (selectedGame) {
        await sendSelectedGame(chatId, selectedGame);
        return NextResponse.json({ ok: true });
      }
    }

    await sendRubikaMessage(chatId, "Use /menu to view games.");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("receive-update error:", error);
    return NextResponse.json({ ok: true, error: "temporary_failure" });
  }
}
