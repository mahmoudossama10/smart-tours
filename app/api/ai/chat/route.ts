import { NextRequest } from "next/server";
import { askLLM } from "@/lib/ai/router";

export async function POST(req: NextRequest) {
  try {
    const { message, tourTitle } = await req.json();
    const reply = await askLLM({ message, tourTitle });
    return Response.json({ reply });
  } catch (e: any) {
    return new Response("Bad request", { status: 400 });
  }
}
