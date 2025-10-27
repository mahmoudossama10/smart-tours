import OpenAI from "openai";

const SYS = `You are Smart Tours’ AI concierge.
- Be concise, friendly, and helpful.
- Suggest Egypt itineraries, pyramids tips, Nile cruise essentials.
- For medical/legal/visa specifics, say you'll connect to a human.
- Prices in USD unless told otherwise.`;

export async function askLLM({
  message,
  tourTitle,
}: {
  message: string;
  tourTitle?: string;
}) {
  const forceMock =
    process.env.AI_FORCE_MOCK === "true" ||
    process.env.NEXT_PUBLIC_FAKE_MODE === "true";
  const key = process.env.OPENAI_API_KEY;

  const mock = () =>
    `Thanks for your interest in "${tourTitle ?? "our tours"}"! We’re in demo mode. Bring comfy shoes, a hat, sunscreen, water, and a camera. We include hotel pickup, a certified guide, and flexible timings. Want me to hold 2 seats for tomorrow at 9am?`;

  // Do NOT instantiate OpenAI unless we have a key and not forcing mock
  if (forceMock || !key) return mock();

  try {
    const client = new OpenAI({ apiKey: key });
    const r = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.6,
      messages: [
        { role: "system", content: SYS },
        { role: "user", content: `${message}${tourTitle ? `\nTour: ${tourTitle}` : ""}` },
      ],
    });
    return r.choices?.[0]?.message?.content ?? mock();
  } catch (err) {
    console.error("OPENAI_ERROR", err);
    return mock(); // graceful fallback on 401/429/etc
  }
}
