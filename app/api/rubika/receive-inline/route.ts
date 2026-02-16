import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await request.json();

  // Inline updates are accepted to keep webhook registration valid.
  // Add inline response logic here when needed.
  return NextResponse.json({ ok: true });
}
