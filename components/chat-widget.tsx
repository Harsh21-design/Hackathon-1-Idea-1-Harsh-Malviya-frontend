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

  // Initialize or update welcome messages when language changes
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

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    messageIdRef.current += 1;
    const userMsg: Message = {
      id: `u-${messageIdRef.current}`,
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const lower = text.toLowerCase();
      let replyText =
        "Thank you for contacting Sidrería Iturrieta! For custom requests or reservations, you can submit the table request form or reach out at info@iturrieta.eus.";
      let action: Message["action"] = undefined;

      if (lower.includes("txotx") || lower.includes("season") || lower.includes("barrel") || lower.includes("kupela")) {
        replyText =
          "Txotx season runs from January to May, where fresh natural cider is tasted straight from giant oak barrels (kupelas). The rest of the year, bottled house cider is served.";
      } else if (lower.includes("price") || lower.includes("menu") || lower.includes("45") || lower.includes("cost") || lower.includes("food")) {
        replyText =
          "The traditional Sagardotegi menu is €45 per guest (includes cod omelet, fried cod with peppers, charcoal-grilled txuleta steak, Idiazabal cheese, walnuts, and unlimited cellar cider). The children's menu is €16.";
      } else if (lower.includes("telegram") || lower.includes("bot")) {
        replyText =
          "You can book directly using our automated Telegram bot (@IturrietaBookingBot). It syncs in real-time with our reservation desk.";
        action = {
          type: "link",
          target: "https://t.me/IturrietaBookingBot",
          label: "Open Telegram Bot",
        };
      } else if (lower.includes("book") || lower.includes("reserve") || lower.includes("table")) {
        replyText =
          "You can request a table using our online form below. Each reservation is confirmed directly by our family team.";
        action = {
          type: "scroll",
          target: "#request",
          label: "Go to Reservation Form",
        };
      } else if (lower.includes("hour") || lower.includes("time") || lower.includes("day") || lower.includes("when")) {
        replyText =
          "We open for lunch service Thursday through Sunday, from 13:00 to 16:00.";
      } else if (lower.includes("location") || lower.includes("address") || lower.includes("where") || lower.includes("aramaio")) {
        replyText =
          "We are located at Arraga auzoa, 2, 01169 Aramaio, Álava — approximately 30 minutes from Vitoria-Gasteiz in the scenic green valley.";
        action = {
          type: "scroll",
          target: "#visit",
          label: "View Location Details",
        };
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
    }, 500);
  };

  const executeAction = (action: NonNullable<Message["action"]>) => {
    if (action.type === "scroll") {
      setIsOpen(false);
      const el = document.querySelector(action.target);
      el?.scrollIntoView({ behavior: "smooth" });
    } else if (action.type === "link") {
      window.open(action.target, "_blank");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          id="chat-concierge-toggle"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 rounded-full bg-white border border-stone-200/90 px-5 py-3.5 text-stone-900 shadow-xl transition-all duration-300 hover:border-gold hover:shadow-2xl hover:-translate-y-1 active:scale-95"
          aria-label={t.concierge.buttonLabel}
        >
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-gold" />
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

      {/* Interactive Concierge Window */}
      {isOpen && (
        <div className="flex h-[530px] w-[92vw] max-w-[390px] flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-2xl transition-all">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-100 bg-[#fbf9f5] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-white font-serif font-bold text-base shadow-xs">
                I
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
              aria-label="Close concierge"
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
              className="text-gold font-bold hover:underline"
            >
              @IturrietaBookingBot
            </a>
          </div>

          {/* Messages Container */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-stone-50/50 p-4 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 leading-relaxed ${
                    m.sender === "user"
                      ? "rounded-tr-xs bg-gold text-white font-medium shadow-xs"
                      : "rounded-tl-xs border border-stone-200 bg-white text-stone-800 shadow-xs"
                  }`}
                >
                  <p>{m.text}</p>
                  {m.action && (
                    <button
                      onClick={() => executeAction(m.action!)}
                      className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-[#faefe4] px-3 py-1.5 text-[11px] font-bold text-gold hover:bg-gold hover:text-white transition-colors"
                    >
                      <span>{m.action.label}</span>
                      <span>→</span>
                    </button>
                  )}
                </div>
                <span className="mt-1 text-[9px] text-stone-400">{m.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-2 text-[11px] text-stone-500">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold [animation-delay:0.2s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold [animation-delay:0.4s]" />
                <span className="ml-1">Typing answer...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick interactive questions */}
          <div className="flex gap-2 overflow-x-auto border-t border-stone-100 bg-white px-3 py-2.5 no-scrollbar">
            {quickQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="shrink-0 rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-[11px] font-semibold text-stone-700 hover:border-gold hover:bg-[#faefe4] hover:text-gold transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 border-t border-stone-100 bg-white p-3"
          >
            <input
              type="text"
              placeholder={t.concierge.inputPlaceholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-xs text-stone-800 outline-none focus:border-gold focus:bg-white"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold text-white transition-all hover:bg-gold-bright disabled:opacity-40"
              aria-label="Send message"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
