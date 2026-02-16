const RUBIKA_BOT_TOKEN = process.env.RUBIKA_BOT_TOKEN;
const RUBIKA_API_BASE_URL =
  process.env.RUBIKA_API_BASE_URL || "https://botapi.rubika.ir/v3";

type JsonObject = Record<string, unknown>;
type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];

export type RubikaButton = {
  id: string;
  type: "Simple";
  button_text: string;
};

export type RubikaKeypad = {
  rows: Array<{ buttons: RubikaButton[] }>;
  resize_keyboard?: boolean;
  one_time_keyboard?: boolean;
};

export async function callRubikaApi<T = JsonObject>(
  method: string,
  payload: JsonObject
): Promise<T> {
  if (!RUBIKA_BOT_TOKEN) {
    throw new Error("RUBIKA_BOT_TOKEN is not set");
  }

  const url = `${RUBIKA_API_BASE_URL}/${RUBIKA_BOT_TOKEN}/${method}`;
  const maxAttempts = 3;
  let lastError: unknown = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as T;

      if (!response.ok) {
        throw new Error(`Rubika API error (${response.status}): ${JSON.stringify(data)}`);
      }

      const dataRecord = data as Record<string, JsonValue>;
      if (typeof dataRecord.status === "string" && dataRecord.status !== "OK") {
        throw new Error(`Rubika API returned non-OK status: ${JSON.stringify(data)}`);
      }

      return data;
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
      }
    }
  }

  throw new Error(
    `Rubika API request failed after ${maxAttempts} attempts (${method}): ${String(lastError)}`
  );
}

export async function sendRubikaMessage(
  chatId: string,
  text: string,
  options?: {
    inline_keypad?: RubikaKeypad;
    chat_keypad?: RubikaKeypad;
    chat_keypad_type?: "None" | "New" | "Remove";
  }
) {
  return callRubikaApi("sendMessage", {
    chat_id: chatId,
    text,
    ...options,
  });
}

export async function sendRubikaPoll(chatId: string, question: string, options: string[]) {
  return callRubikaApi("sendPoll", {
    chat_id: chatId,
    question,
    options,
  });
}

export async function sendRubikaLocation(
  chatId: string,
  latitude: string,
  longitude: string
) {
  return callRubikaApi("sendLocation", {
    chat_id: chatId,
    latitude,
    longitude,
  });
}

export async function sendRubikaFile(chatId: string, fileId: string) {
  return callRubikaApi("sendFile", {
    chat_id: chatId,
    file_id: fileId,
  });
}

export async function setRubikaCommands(
  botCommands: Array<{ command: string; description: string }>
) {
  return callRubikaApi("setCommands", { bot_commands: botCommands });
}
