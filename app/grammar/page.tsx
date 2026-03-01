import { Metadata } from "next";
import { getSEOTags } from "@/lib/seo";
import GrammarClient from "./GrammarClient";

export const metadata: Metadata = getSEOTags({
  title: "100 Japanese Grammar Structures | bunpo100",
  description:
    "Learn the most common Japanese grammar structures, ordered by frequency. Track your progress as you master each pattern.",
  canonicalUrlRelative: "/grammar",
});

export default function GrammarPage() {
  return <GrammarClient />;
}
