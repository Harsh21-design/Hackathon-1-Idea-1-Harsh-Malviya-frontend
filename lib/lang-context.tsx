"use client";

import React, { createContext, useContext, useState } from "react";
import { DICTIONARIES, type Dictionary, type Lang } from "./translations";

type LangContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dictionary;
};

const LangContext = createContext<LangContextType>({
  lang: "en",
  setLang: () => {},
  t: DICTIONARIES.en,
});

function readSavedLang(): Lang {
  if (typeof window === "undefined") return "en";
  const saved = localStorage.getItem("iturrieta-lang") as Lang | null;
  return saved && DICTIONARIES[saved] ? saved : "en";
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readSavedLang);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem("iturrieta-lang", newLang);
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t: DICTIONARIES[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
