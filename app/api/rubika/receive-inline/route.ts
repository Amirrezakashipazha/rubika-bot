import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const payload = (await req.json()) as any;
  console.log("RECEIVE_INLINE_RAW:", JSON.stringify(payload));

  const inline = payload.inline_message ?? payload;
  if (!inline?.chat_id || !inline?.message_id) return NextResponse.json({ ok: true });

  const buttonId = inline?.aux_data?.button_id ?? null;
  const messageId = inline?.message_id ?? null;

  if (buttonId && messageId) {
    return NextResponse.json({
      message_id: messageId,
      inline_keypad: { rows: [] },
    });
  }

  return NextResponse.json({ ok: true });
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}
