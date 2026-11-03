"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLanguage, LANGUAGES } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-pink-200/90 bg-white/90 px-3 py-1.5 text-xs font-black text-slate-800 shadow-sm backdrop-blur-md hover:bg-white hover:border-pink-400 hover:shadow-md transition-all cursor-pointer whitespace-nowrap"
        aria-label="Change language"
      >
        <div className="h-4 w-6 rounded-[3px] overflow-hidden border border-slate-300 shadow-xs flex-shrink-0 flex items-center justify-center bg-slate-100">
          <img
            src={currentOption.flagImg}
            alt={currentOption.name}
            className="h-full w-full object-cover"
          />
        </div>
        <span className="font-black text-xs text-[#1E1035] tracking-wide">
          {currentOption.name}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-pink-600" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-1.5 w-44 origin-top-right rounded-2xl border border-pink-200/90 bg-white/95 p-1.5 shadow-2xl backdrop-blur-xl z-50"
          >
            {LANGUAGES.map((opt) => {
              const isSelected = opt.code === language;
              return (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => {
                    setLanguage(opt.code);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs font-bold transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-pink-50 text-pink-700 font-black border border-pink-200"
                      : "text-slate-700 hover:bg-slate-50 hover:text-pink-600"
                  }`}
                >
                  <div className="h-4 w-6 rounded-[3px] overflow-hidden border border-slate-300 shadow-xs flex-shrink-0 flex items-center justify-center bg-slate-100">
                    <img
                      src={opt.flagImg}
                      alt={opt.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-xs font-black text-[#1E1035] tracking-wide">
                    {opt.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    ({opt.nativeName})
                  </span>
                  {isSelected && <span className="ml-auto text-pink-600 text-sm font-black">✓</span>}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
