"use client";

import type React from "react";
import { useState } from "react";
import { ArrowUpRight, ArrowUp, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { getRandomSuggestions, type Suggestion } from "@/lib/suggestions";
import { useMemeContext } from "@/hooks/useMemeContext";

type QualityMode = "performance" | "quality";

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading?: boolean;
  showProviders: boolean;
  onToggleProviders: () => void;
  mode: QualityMode;
  onModeChange: (mode: QualityMode) => void;
  suggestions: Suggestion[];
}

export function PromptInput({
  suggestions: initSuggestions,
  isLoading,
  onSubmit,
}: PromptInputProps) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>(initSuggestions);
  const { topText, bottomText, setTopText, setBottomText } = useMemeContext();

  const handleSubmit = () => {
    if (!isLoading && input.trim()) {
      onSubmit(input);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        onSubmit(input);
      }
    }
  };

  return (
    <div className="w-full mb-4 sm:mb-8">
      <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-3 sm:p-4">
        <div className="flex flex-col gap-2 sm:gap-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your prompt here"
            rows={3}
            className="text-sm sm:text-base bg-transparent border-none p-0 resize-none placeholder:text-slate-500 dark:placeholder:text-slate-400 text-slate-900 dark:text-slate-100 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={topText}
              onChange={(e) => setTopText(e.target.value)}
              placeholder="Top Text (optional)"
              className="flex-1 bg-transparent border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm"
            />
            <Input
              value={bottomText}
              onChange={(e) => setBottomText(e.target.value)}
              placeholder="Bottom Text (optional)"
              className="flex-1 bg-transparent border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-1 gap-2 sm:gap-0">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSuggestions(getRandomSuggestions())}
                className="text-slate-500 dark:text-slate-400 hover:opacity-70"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              {suggestions.slice(0, 5).map((suggestion, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="px-2 rounded-lg py-1 text-xs sm:text-sm text-slate-900 dark:text-slate-100 hover:opacity-70 group transition-opacity duration-200"
                  onClick={() => setInput(suggestion.prompt)}
                >
                  {suggestion.text.toLowerCase()}
                  <ArrowUpRight className="ml-1 h-3 w-3 text-slate-500 dark:text-slate-400 group-hover:opacity-70" />
                </Button>
              ))}
            </div>
            <div className="flex items-center w-full sm:w-auto">
              <Button
                onClick={handleSubmit}
                disabled={isLoading || !input.trim()}
                className="h-8 px-4 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center disabled:opacity-50 w-full sm:w-auto"
              >
                {isLoading ? (
                  <Spinner className="w-3 h-3" />
                ) : (
                  <>
                    Generate Meme
                    <ArrowUp className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
