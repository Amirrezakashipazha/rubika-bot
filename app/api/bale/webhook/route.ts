import { NextResponse } from "next/server";


const TOKEN = process.env.BALE_BOT_TOKEN!;
const BASE_URL = `https://tapi.bale.ai/bot${TOKEN}`;



export async function GET() {

    try {

        const api = await fetch(`${BASE_URL}/setWebhook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "url": "https://bale-bot-wheat.vercel.app/api/bale"
            })
        });

        const res = await api.json()

        if (res.ok) {
            return NextResponse.json({ ok: true, data: res });
        }

        return NextResponse.json({ ok: false, error: res });

    } catch (error) {
        return NextResponse.json({ ok: false, error: error });
    }

}
