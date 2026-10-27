"use client";

import { useState, useRef, useEffect } from "react";
import { useLang } from "@/lib/lang-context";

type Message = {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
};

// Lightweight markdown renderer: **bold**, *italic*, `code`, bullet lists, numbered lists
function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];

    if (raw.trim() === "") {
      nodes.push(<div key={key++} className="h-1.5" />);
      continue;
    }

    const bulletMatch = raw.match(/^[\s]*[-*\u2022]\s+(.+)/);
    if (bulletMatch) {
      nodes.push(
        <div key={key++} className="flex items-start gap-1.5 pl-1">
          <span className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
          <span>{inlineMarkdown(bulletMatch[1], key++)}</span>
        </div>
      );
      continue;
    }

    const numMatch = raw.match(/^[\s]*(\d+)\.\s+(.+)/);
    if (numMatch) {
      nodes.push(
        <div key={key++} className="flex items-start gap-1.5 pl-1">
          <span className="shrink-0 font-bold text-amber-600">{numMatch[1]}.</span>
          <span>{inlineMarkdown(numMatch[2], key++)}</span>
        </div>
      );
      continue;
    }

    nodes.push(<div key={key++}>{inlineMarkdown(raw, key++)}</div>);
  }

  return nodes;
}

function inlineMarkdown(text: string, baseKey: number): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={baseKey + i} className="font-semibold">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={baseKey + i}>{part.slice(1, -1)}</em>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code key={baseKey + i} className="rounded bg-stone-100 px-1 font-mono text-[11px] text-amber-700">
              {part.slice(1, -1)}
            </code>
          );
        }
        return <span key={baseKey + i}>{part}</span>;
      })}
    </>
  );
}

export function ChatWidget() {
  const { t } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(0);

  useEffect(() => {
    queueMicrotask(() => {
      setMessages([
        {
          id: "w-1",
          sender: "bot",
          text: `${t.concierge.welcomeMsg}\n\n${t.concierge.welcomePrompt}`,
          time: "Just now",
        },
      ]);
    });
  }, [t]);

  const quickQuestions = ["Txotx Season", "Menu & Price", "Book a table", "Opening Hours"];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    messageIdRef.current += 1;
    const userMsg: Message = {
      id: `u-${messageIdRef.current}-${Date.now()}`,
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    try {
      const historyPayload = messages
        .filter((m) => m.id !== "w-1")
        .map((m) => ({ role: m.sender === "user" ? "user" : "model", content: m.text }));

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${apiUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: historyPayload }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: "b-" + Date.now(),
            sender: "bot",
            text: data.reply,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        setIsTyping(false);
        return;
      }
    } catch {
      // fall through to local fallback
    }

    // Local fallback
    setTimeout(() => {
      const lower = text.toLowerCase();
      let replyText =
        "Thank you for contacting Reservas Iturrieta! You can submit the online table form or reach us via Telegram @IturrietaBookingBot.";

      if (lower.includes("txotx") || lower.includes("season") || lower.includes("barrel")) {
        replyText =
          "**Txotx Season** runs from January to May, where fresh natural cider is tasted straight from giant oak barrels (*kupelas*).\n\nThe rest of the year, bottled house cider is served.";
      } else if (lower.includes("price") || lower.includes("menu") || lower.includes("cost")) {
        replyText =
          "**Menu & Pricing:**\n- Adults: EUR 45 per person\n- Children (under 12): EUR 22 per person\n\nIncludes: cod omelette, fried cod, charcoal txuleta steak, Idiazabal cheese, walnuts, and unlimited cider.";
      } else if (lower.includes("telegram") || lower.includes("bot")) {
        replyText =
          "You can chat and book directly with our automated Telegram assistant at **@IturrietaBookingBot**.";
      } else if (lower.includes("book") || lower.includes("reserve") || lower.includes("table")) {
        replyText =
          "I would love to help you book a table! Please share:\n1. Your **name**\n2. **Phone** (with country code)\n3. Preferred **date**\n4. Preferred **time** (13:00 to 15:30)\n5. Number of **adults** and **children** (under 12)";
      } else if (lower.includes("hour") || lower.includes("open")) {
        replyText =
          "We open for **lunch service Friday through Sunday**, from **13:00 to 16:00**.\n\nLast seating is at 15:30.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: "b-" + Date.now(),
          sender: "bot",
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setIsTyping(false);
    }, 400);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating launcher */}
      {!isOpen && (
        <button
          id="chat-reservas-toggle"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3.5 rounded-full bg-stone-900/95 backdrop-blur-md border border-stone-700/60 pl-4 pr-3.5 py-2.5 text-white shadow-2xl transition-all duration-300 hover:scale-[1.03] hover:bg-stone-900 hover:border-stone-500 active:scale-95"
          aria-label="Chat with Reserve AI"
        >
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-xs" />
          </span>
          <div className="flex flex-col text-left">
            <span className="text-[13px] font-semibold tracking-tight text-white">Chat with Reserve AI</span>
            <span className="text-[10px] text-stone-400 font-normal">Book tables &amp; instant answers</span>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white group-hover:bg-amber-600 transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="flex h-[560px] w-[92vw] max-w-[400px] flex-col overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-2xl">

          {/* Header */}
          <div className="flex items-center justify-between bg-stone-900 px-5 py-3.5 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-500/30 font-bold text-sm text-amber-400 shadow-inner select-none">
                AI
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-base text-white leading-tight">Reserve AI</p>
                  <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-stone-400">Sidreria Iturrieta Concierge</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-xl p-1.5 text-stone-400 hover:bg-stone-800 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Telegram banner */}
          <div className="flex items-center justify-between bg-amber-50/70 border-b border-amber-100/70 px-4 py-2 text-[11px]">
            <span className="text-amber-950 font-medium">Telegram instant booking:</span>
            <a
              href="https://t.me/IturrietaBookingBot"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-amber-800 hover:text-amber-900 hover:underline"
            >
              @IturrietaBookingBot →
            </a>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-stone-50/50 text-[13px]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-xs leading-relaxed ${
                    m.sender === "user"
                      ? "bg-stone-900 text-white rounded-br-xs"
                      : "bg-white border border-stone-200/90 text-stone-900 rounded-bl-xs"
                  }`}
                >
                  {m.sender === "bot" ? (
                    <div className="space-y-0.5">{renderMarkdown(m.text)}</div>
                  ) : (
                    <p className="whitespace-pre-line">{m.text}</p>
                  )}
                </div>
                <span className="text-[10px] text-stone-400 mt-1 px-1">{m.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 bg-white border border-stone-200 px-3.5 py-2.5 w-fit rounded-2xl rounded-bl-xs shadow-xs">
                <span className="h-2 w-2 rounded-full bg-amber-600 animate-bounce" />
                <span className="h-2 w-2 rounded-full bg-amber-600 animate-bounce [animation-delay:0.2s]" />
                <span className="h-2 w-2 rounded-full bg-amber-600 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick chips */}
          <div className="border-t border-stone-100 bg-white px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="shrink-0 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-[11px] font-medium text-stone-700 hover:border-amber-600 hover:text-amber-700 hover:bg-amber-50/50 transition-all"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="border-t border-stone-200 bg-white p-3 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={t.concierge.inputPlaceholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded-xl border border-stone-200 bg-stone-50/80 px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 outline-none focus:border-amber-600 focus:bg-white focus:ring-1 focus:ring-amber-600 transition"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-600 text-white disabled:opacity-40 transition hover:bg-amber-700 active:scale-95 shadow-xs"
              aria-label="Send message"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
