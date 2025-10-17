"use client";

import React from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ChevronDown, List, Search } from "lucide-react";

type FAQItem = {
  q: string;
  a: string;
  category?: string;
  id?: string;
};

type FAQCategory = {
  category: string;
  items: FAQItem[];
};

function slugify(str = "") {
  return String(str)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 120);
}

export default function FaqExplorer({ data = [] }: { data: FAQCategory[] }) {
  const [query, setQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState(
    data?.[0]?.category || ""
  );

  const categories = React.useMemo(
    () => data.map((c) => ({ label: c.category, count: c.items?.length || 0 })),
    [data]
  );

  const allItems = React.useMemo(() => {
    const out: FAQItem[] = [];
    data.forEach((cat) => {
      (cat.items || []).forEach((item: FAQItem) => {
        out.push({
          ...item,
          category: cat.category,
          id: `${slugify(cat.category)}-${slugify(item.q)}`,
        });
      });
    });
    return out;
  }, [data]);

  const visibleItems = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      const cat = data.find((c) => c.category === activeCategory);
      return (cat?.items || []).map((it: FAQItem) => ({
        ...it,
        id: `${slugify(activeCategory)}-${slugify(it.q)}`,
        category: activeCategory,
      }));
    }
    return allItems.filter(
      (it: FAQItem) =>
        it.q?.toLowerCase().includes(q) ||
        it.a?.toLowerCase().includes(q) ||
        it.category?.toLowerCase().includes(q)
    );
  }, [query, activeCategory, data, allItems]);

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 md:p-6 text-white">
      {/* Header */}
      <div className="flex items-start md:items-center gap-3 flex-col md:flex-row justify-between">
        <div className="text-lg font-semibold">FAQ Explorer</div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search FAQs..."
              className="pl-9"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-[230px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="hidden md:block space-y-2">
          {categories.map((c) => {
            const isActive = !query && c.label === activeCategory;
            return (
              <button
                key={c.label}
                onClick={() => setActiveCategory(c.label)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition
                  ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "hover:bg-white/5 text-white/85"
                  }`}
              >
                <span className="flex items-center gap-2">
                  <List className="w-4 h-4 opacity-80" />
                  {c.label}
                </span>
                <span className="bg-white/10 text-white text-xs px-2 py-1 rounded-md">
                  {c.count}
                </span>
              </button>
            );
          })}
        </aside>

        {/* Content */}
        <section>
          {visibleItems.length === 0 ? (
            <div className="text-sm text-white/60 border border-white/10 bg-white/5 rounded-lg p-4">
              No matches. Try different keywords.
            </div>
          ) : (
            <div className="space-y-3">
              {visibleItems.map((it) => (
                <details
                  key={it.id}
                  className="group rounded-lg border border-white/10 bg-white/5 p-3"
                >
                  <summary className="cursor-pointer flex justify-between items-center text-white/90 font-medium">
                    {it.q}
                    <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-2 text-white/75">{it.a}</p>
                </details>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
