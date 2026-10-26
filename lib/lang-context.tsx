"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
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

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("iturrieta-lang") as Lang | null;
    if (saved && DICTIONARIES[saved]) {
      setLangState(saved);
    }
  }, []);

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
