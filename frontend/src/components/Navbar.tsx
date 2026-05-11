"use client";

import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";
import Logo from "@shared/ui/Logo";

export function Navbar() {
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="font-mono text-2xl font-bold text-emerald-500 transition-colors group-hover:text-emerald-400">
              $
            </span>
            <span className="text-[20px] font-semibold tracking-tight text-foreground">
              Spend
              <span className="text-emerald-500 transition-colors group-hover:text-emerald-400">
                Smart
              </span>
            </span>
          </div>
          {/* <Logo /> */}
        </Link>

        {/* Dark mode toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          aria-label="Toggle theme"
          className="size-8 rounded-md text-muted-foreground hover:text-foreground"
        >
          {theme === "dark" ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
        </Button>
      </div>
    </header>
  );
}
