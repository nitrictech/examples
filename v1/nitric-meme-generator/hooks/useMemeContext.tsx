"use client";

import type React from "react";
import { createContext, useState, useContext } from "react";

interface MemeContextType {
  topText: string;
  bottomText: string;
  setTopText: (text: string) => void;
  setBottomText: (text: string) => void;
}

const MemeContext = createContext<MemeContextType | undefined>(undefined);

export function MemeProvider({ children }: { children: React.ReactNode }) {
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");

  return (
    <MemeContext.Provider
      value={{ topText, bottomText, setTopText, setBottomText }}
    >
      {children}
    </MemeContext.Provider>
  );
}

export function useMemeContext() {
  const context = useContext(MemeContext);
  if (context === undefined) {
    throw new Error("useMemeContext must be used within a MemeProvider");
  }
  return context;
}
