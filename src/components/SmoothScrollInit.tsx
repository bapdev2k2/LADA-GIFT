"use client";

import { useEffect } from "react";
import { smoothScrollTo } from "@/lib/smoothScroll";

export default function SmoothScrollInit() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (target && target.hash && target.hash.startsWith("#")) {
        const id = target.hash.slice(1);
        const element = document.getElementById(id);
        if (element) {
          e.preventDefault();
          smoothScrollTo(target.hash, 85, 700);
        }
      }
    };

    document.addEventListener("click", handleClick, { passive: false });
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
