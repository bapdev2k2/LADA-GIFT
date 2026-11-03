"use client";

import React, { useState } from "react";
import { Phone, MessageCircle, X } from "lucide-react";

export default function FloatingContact() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-auto">
      {/* Expanded contact options */}
      <div
        className={`flex flex-col items-end gap-2.5 transition-all duration-300 ${
          isExpanded
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {/* Facebook link */}
        <a
          href="https://byvn.net/JNem"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-white text-[#1877F2] shadow-lg border border-blue-100 hover:bg-blue-50 transition-all hover:scale-105"
        >
          <span className="text-xs font-bold text-slate-800 group-hover:text-[#1877F2] transition-colors">
            Facebook LADA GIFT
          </span>
          <div className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-md">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </div>
        </a>

        {/* Zalo link */}
        <a
          href="https://zalo.me/0366831128"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-white text-[#0068FF] shadow-lg border border-blue-100 hover:bg-blue-50 transition-all hover:scale-105"
        >
          <span className="text-xs font-bold text-slate-800 group-hover:text-[#0068FF] transition-colors">
            Chat Zalo: 0366 831 128
          </span>
          <div className="w-8 h-8 rounded-full bg-[#0068FF] text-white font-black text-xs flex items-center justify-center shadow-md">
            Zalo
          </div>
        </a>

        {/* Hotline Call link */}
        <a
          href="tel:0366831128"
          className="group flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-white text-emerald-600 shadow-lg border border-emerald-100 hover:bg-emerald-50 transition-all hover:scale-105"
        >
          <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
            Hotline: 0366 831 128
          </span>
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
            <Phone className="w-4 h-4" />
          </div>
        </a>
      </div>

      {/* Main floating trigger button */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label="Liên hệ LADA GIFT"
        className="relative w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white shadow-xl shadow-pink-500/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all focus:outline-none"
      >
        {/* Pulsing ring */}
        <span className="absolute -inset-1 rounded-full bg-pink-400 opacity-40 animate-ping pointer-events-none" />

        {isExpanded ? (
          <X className="w-6 h-6 transition-transform rotate-0" />
        ) : (
          <MessageCircle className="w-6 h-6 transition-transform" />
        )}
      </button>
    </div>
  );
}
