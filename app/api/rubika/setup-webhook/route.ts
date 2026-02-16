import { NextRequest, NextResponse } from "next/server";
import { callRubikaApi, setRubikaCommands } from "@/lib/rubika";

type EndpointType = "ReceiveUpdate";

function buildEndpoints(baseUrl: string) {
  const normalized = baseUrl.replace(/\/+$/, "");
  return {
    type: "ReceiveUpdate" as EndpointType,
    url: `${normalized}/api/rubika/receive-update`,
  };
}

async function registerWebhook(baseUrl: string) {
  const endpoint = buildEndpoints(baseUrl);
  const [updateEndpointResponse, commandsResponse] =
    await Promise.all([
      callRubikaApi("updateBotEndpoints", {
        url: endpoint.url,
        type: endpoint.type,
      }),
      setRubikaCommands([
        { command: "start", description: "Start bot" },
        { command: "help", description: "Show help" },
        { command: "menu", description: "Show game list" },
        { command: "game", description: "Start game app" },
        { command: "phone", description: "Send mobile number" },
      ]),
    ]);
  return { updateEndpointResponse, commandsResponse };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { baseUrl?: string };
    const baseUrl = body.baseUrl || process.env.RUBIKA_WEBHOOK_BASE_URL;

    if (!baseUrl) {
      return NextResponse.json(
        { ok: false, error: "Missing baseUrl or RUBIKA_WEBHOOK_BASE_URL" },
        { status: 400 }
      );
    }

    const data = await registerWebhook(baseUrl);
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const baseUrlFromQuery = request.nextUrl.searchParams.get("baseUrl");
  const baseUrl = baseUrlFromQuery || process.env.RUBIKA_WEBHOOK_BASE_URL;

  if (!baseUrl) {
    return NextResponse.json(
      { ok: false, error: "Missing baseUrl query param or RUBIKA_WEBHOOK_BASE_URL" },
      { status: 400 }
    );
  }

  try {
    const data = await registerWebhook(baseUrl);
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 }
    );
  }
}
