"use client";
import { useState } from "react";

export default function ChatDrawer({ tourTitle }: { tourTitle: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{role: "user"|"assistant", content: string}[]>([
    { role: "assistant", content: `Hi! Ask me anything about "${tourTitle}" or Egypt travel.` }
  ]);
  const [input, setInput] = useState("");

  async function send() {
    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, agent: "planner" }),
    });
    const data = await res.json();
    setMessages(prev => [...prev, { role: "user", content: input }, { role: "assistant", content: data.reply }]);
    setInput("");
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="border px-4 py-2 rounded-xl">Chat</button>
      {open && (
        <div className="fixed inset-0 bg-black/20 flex justify-end">
          <div className="bg-white w-full max-w-md h-full p-4 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">AI Concierge</h3>
              <button onClick={() => setOpen(false)}>✕</button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "assistant" ? "bg-gray-100 p-2 rounded" : "text-right"}>
                  <p>{m.content}</p>
                </div>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about availability on Friday..." className="flex-1 border rounded px-3 py-2"/>
              <button onClick={send} className="bg-black text-white px-4 py-2 rounded">Send</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
