'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser } from "@/context/user";
import config from "@/config";

const Header = () => {
  const { profile } = useUser();

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
          <Link href="#pricing" className="text-foreground hover:text-primary transition-colors">
            Pricing
          </Link>
          {profile?.name ? (
            <Link href="/settings">
              <Button variant="outline" size="sm">
                {profile.name}
              </Button>
            </Link>
          ) : (
            <Link href="/signin">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
          )}
        </nav>

        <Button variant="outline" size="sm" className="md:hidden">
          Menu
        </Button>
      </div>
    </header>
  );
};

export default Header;
