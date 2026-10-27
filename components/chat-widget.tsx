"use client";

import { useState, useRef, useEffect } from "react";
import { useLang } from "@/lib/lang-context";

type Message = {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
  action?: {
    type: "link" | "scroll";
    target: string;
    label: string;
  };
};

export function ChatWidget() {
  const { t } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(0);

  // Initialize welcome messages
  useEffect(() => {
    queueMicrotask(() => {
      setMessages([
        {
          id: "w-1",
          sender: "bot",
          text: t.concierge.welcomeMsg,
          time: "Just now",
        },
        {
          id: "w-2",
          sender: "bot",
          text: t.concierge.welcomePrompt,
          time: "Just now",
        },
      ]);
    });
  }, [t]);

  const quickQuestions = [
    "Txotx Season",
    "Menu & Price (€45)",
    "Book a table",
    "Telegram Bot",
    "Opening Hours",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
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
      // Build conversation history for Gemini AI backend
      const historyPayload = messages
        .filter((m) => m.id !== "w-1" && m.id !== "w-2")
        .map((m) => ({
          role: m.sender === "user" ? "user" : "model",
          content: m.text,
        }));

      const res = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const botMsg: Message = {
          id: "b-" + Date.now(),
          sender: "bot",
          text: data.reply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          action: data.booking_created
            ? {
                type: "scroll",
                target: "#request",
                label: "View Reservation Details",
              }
            : undefined,
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
        return;
      }
    } catch {
      // Fallback response if local backend is temporarily resting
    }

    // Smart Local Fallback
    setTimeout(() => {
      const lower = text.toLowerCase();
      let replyText =
        "Thank you for contacting Reservas Iturrieta! You can submit the online table form or reach us via Telegram @IturrietaBookingBot.";
      let action: Message["action"] = undefined;

      if (lower.includes("txotx") || lower.includes("season") || lower.includes("barrel") || lower.includes("kupela")) {
        replyText =
          "Txotx season runs from January to May, where fresh natural cider is tasted straight from giant oak barrels (kupelas). The rest of the year, bottled house cider is served.";
      } else if (lower.includes("price") || lower.includes("menu") || lower.includes("45") || lower.includes("cost") || lower.includes("food")) {
        replyText =
          "The traditional Sagardotegi menu is €45 per guest (includes cod omelet, fried cod with peppers, charcoal-grilled txuleta steak, Idiazabal cheese, walnuts, and unlimited cellar cider).";
      } else if (lower.includes("telegram") || lower.includes("bot")) {
        replyText =
          "You can chat and book directly with our automated Telegram assistant (@IturrietaBookingBot).";
        action = {
          type: "link",
          target: "https://t.me/IturrietaBookingBot",
          label: "Open Telegram Bot",
        };
      } else if (lower.includes("book") || lower.includes("reserve") || lower.includes("table")) {
        replyText =
          "You can reserve instantly using our online table form below.";
        action = {
          type: "scroll",
          target: "#request",
          label: "Go to Reservation Form",
        };
      } else if (lower.includes("hour") || lower.includes("time") || lower.includes("day") || lower.includes("when")) {
        replyText =
          "We open for lunch service Friday through Sunday, from 13:00 to 16:00.";
      }

      const botMsg: Message = {
        id: "b-" + Date.now(),
        sender: "bot",
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        action,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 400);
  };

  const executeAction = (action: NonNullable<Message["action"]>) => {
    if (action.type === "scroll") {
      setIsOpen(false);
      const el = document.querySelector(action.target);
      el?.scrollIntoView({ behavior: "smooth" });
    } else if (action.type === "link") {
      window.open(action.target, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          id="chat-reservas-toggle"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 rounded-full bg-white border border-stone-200/90 px-5 py-3.5 text-stone-900 shadow-xl transition-all duration-300 hover:border-gold hover:shadow-2xl hover:-translate-y-1 active:scale-95"
          aria-label={t.concierge.buttonLabel}
        >
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
          </span>

          <span className="font-serif text-base font-bold tracking-wide text-stone-900">
            {t.concierge.buttonLabel}
          </span>

          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#faefe4] text-gold group-hover:bg-gold group-hover:text-white transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        </button>
      )}

      {/* Interactive Chat Window */}
      {isOpen && (
        <div className="flex h-[530px] w-[92vw] max-w-[390px] flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-2xl transition-all">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-100 bg-[#fbf9f5] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 text-gold font-serif font-bold text-sm">
                RI
              </div>
              <div>
                <p className="font-serif text-lg font-bold text-stone-900 leading-tight">
                  {t.concierge.title}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{t.concierge.status}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="rounded-xl p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-800 transition-colors"
              aria-label="Close chat"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Telegram prompt */}
          <div className="flex items-center justify-between bg-stone-50 px-4 py-2.5 text-xs border-b border-stone-100">
            <span className="text-stone-600 font-medium">{t.concierge.telegramBanner}</span>
            <a
              href="https://t.me/IturrietaBookingBot"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-gold hover:underline flex items-center gap-1"
            >
              @IturrietaBookingBot →
            </a>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-stone-50/40 to-white text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-2xs leading-relaxed ${
                    m.sender === "user"
                      ? "bg-forest-900 text-white rounded-br-xs"
                      : "bg-white border border-stone-200/80 text-stone-800 rounded-bl-xs"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>

                {m.action && (
                  <button
                    onClick={() => executeAction(m.action!)}
                    className="mt-1.5 inline-flex items-center gap-1 rounded-lg bg-gold/10 border border-gold/30 px-3 py-1 text-[11px] font-bold text-gold hover:bg-gold hover:text-white transition-all shadow-2xs"
                  >
                    <span>{m.action.label}</span>
                    <span>→</span>
                  </button>
                )}

                <span className="text-[10px] text-stone-400 mt-1 px-1">{m.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 bg-white border border-stone-200/80 w-fit px-3 py-2 rounded-2xl rounded-bl-xs shadow-2xs">
                <span className="h-1.5 w-1.5 rounded-full bg-gold animate-bounce" />
                <span className="h-1.5 w-1.5 rounded-full bg-gold animate-bounce [animation-delay:0.2s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-gold animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick chip buttons */}
          <div className="border-t border-stone-100 bg-[#fbf9f5] px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="shrink-0 rounded-full border border-stone-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-stone-600 hover:border-gold hover:text-gold transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="border-t border-stone-200 bg-white p-3 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={t.concierge.inputPlaceholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-xs text-stone-800 placeholder-stone-400 outline-none focus:border-gold focus:bg-white transition"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-gold text-white disabled:opacity-40 transition hover:bg-gold-bright"
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
