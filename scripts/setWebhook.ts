export const setWebhook = async () => {
  const TOKEN = process.env.BALE_BOT_TOKEN!;

  const res = await fetch(`https://tapi.bale.ai/bot${TOKEN}/setWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: "https://bale-bot-wheat.vercel.app/api/bale"
    }),
  });

  console.log('response webhook',await res.json());
};
