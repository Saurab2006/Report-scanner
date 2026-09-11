"use client";

import { createContext, useContext, useState } from "react";

const LangContext = createContext({
  lang: "en",
  setLang: () => {},
});

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window === "undefined") return "en";
    const saved = window.localStorage.getItem("reportscan_lang");
    return saved === "en" || saved === "ne" ? saved : "en";
  });

  const updateLang = (nextLang) => {
    setLang(nextLang);
    window.localStorage.setItem("reportscan_lang", nextLang);
  };

  return (
    <LangContext.Provider value={{ lang, setLang: updateLang }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
