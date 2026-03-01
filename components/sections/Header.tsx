'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import config from "@/config";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link
            className="flex items-center gap-2 shrink-0"
            href="/"
            title={`${config.appName} homepage`}
          >
            <span className="font-bold text-2xl text-accent">
              {config.appName}
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/grammar">
            <Button variant="outline" size="sm">
              Grammar
            </Button>
          </Link>
        </nav>

        <Link href="/grammar" className="md:hidden">
          <Button variant="outline" size="sm">
            Grammar
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
