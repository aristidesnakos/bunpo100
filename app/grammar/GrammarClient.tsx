"use client";

import { useState, useMemo } from "react";
import { useGrammarProgress } from "@/hooks/useGrammarProgress";
import {
  GRAMMAR_STRUCTURES,
  type GrammarEntry,
} from "@/lib/constants/grammar-structures";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search, Check } from "lucide-react";

const TOTAL = GRAMMAR_STRUCTURES.length;

export default function GrammarClient() {
  const { isLoaded, learnedCount, toggleLearned, isLearned } =
    useGrammarProgress();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unlearned" | "learned">("all");

  const progressPercent = Math.round((learnedCount / TOTAL) * 100);

  const filtered = useMemo(() => {
    let entries = GRAMMAR_STRUCTURES;

    if (filter === "unlearned") {
      entries = entries.filter((e) => !isLearned(e.id));
    } else if (filter === "learned") {
      entries = entries.filter((e) => isLearned(e.id));
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      entries = entries.filter(
        (e) =>
          e.structure.toLowerCase().includes(q) ||
          e.structureTranslation.toLowerCase().includes(q) ||
          e.example.toLowerCase().includes(q) ||
          e.exampleTranslation.toLowerCase().includes(q) ||
          (e.notes && e.notes.toLowerCase().includes(q))
      );
    }

    return entries;
  }, [search, filter, isLearned]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="h-8 bg-muted rounded animate-pulse w-64 mb-4" />
          <div className="h-3 bg-muted rounded animate-pulse w-full mb-8" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded animate-pulse mb-3" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Japanese Grammar Structures
          </h1>
          <p className="text-gray-500 mb-4">
            Ordered by frequency. Tap to reveal examples. Check off what
            you&apos;ve learned.
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-500 whitespace-nowrap">
              {learnedCount}/{TOTAL}
            </span>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search grammar or English..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-1">
            {(["all", "unlearned", "learned"] as const).map((mode) => (
              <Button
                key={mode}
                variant={filter === mode ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(mode)}
                className="capitalize"
              >
                {mode}
              </Button>
            ))}
          </div>
        </div>

        {/* Result count when filtering */}
        {(search || filter !== "all") && (
          <p className="text-sm text-gray-500 mb-4">
            Showing {filtered.length} of {TOTAL} structures
          </p>
        )}

        {/* Grammar list */}
        <Accordion type="multiple" className="space-y-2">
          {filtered.map((entry) => (
            <GrammarCard
              key={entry.id}
              entry={entry}
              learned={isLearned(entry.id)}
              onToggle={() => toggleLearned(entry.id)}
            />
          ))}
        </Accordion>

        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-12">
            No grammar structures match your search.
          </p>
        )}
      </div>
    </div>
  );
}

function GrammarCard({
  entry,
  learned,
  onToggle,
}: {
  entry: GrammarEntry;
  learned: boolean;
  onToggle: () => void;
}) {
  return (
    <AccordionItem
      value={`grammar-${entry.id}`}
      className={cn(
        "rounded-lg border border-b-0 px-4 transition-colors",
        learned ? "border-emerald-200 bg-emerald-50/50" : "border-border bg-card"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Learned toggle */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={cn(
            "mt-4 h-7 w-7 shrink-0 rounded-full flex items-center justify-center transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            learned
              ? "bg-emerald-500 text-white hover:bg-emerald-600"
              : "border-2 border-gray-300 hover:border-gray-400"
          )}
          aria-label={learned ? "Mark as unlearned" : "Mark as learned"}
        >
          {learned && <Check className="h-4 w-4" />}
        </button>

        <AccordionTrigger className="flex-1 hover:no-underline py-4">
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-mono w-7 shrink-0">
                {entry.id}
              </span>
              <span className="font-medium">{entry.structure}</span>
              {entry.notes && (
                <Badge variant="secondary" className="text-xs shrink-0">
                  {entry.notes}
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1 ml-9">
              {entry.structureTranslation}
            </p>
          </div>
        </AccordionTrigger>
      </div>

      <AccordionContent className="pl-10 pb-4">
        <div className="bg-muted/50 rounded-md p-3 space-y-1">
          <p className="text-sm font-medium">{entry.example}</p>
          <p className="text-sm text-gray-500 italic">
            {entry.exampleTranslation}
          </p>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
