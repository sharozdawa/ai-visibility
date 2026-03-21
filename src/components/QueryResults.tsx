"use client";

import { useState } from "react";
import { AI_PLATFORMS } from "@/lib/platforms";

interface Check {
  id: string;
  query: string;
  platform: string;
  mentioned: boolean;
  position: number | null;
  context: string | null;
  fullResponse: string | null;
  sentiment: string | null;
  competitors: string[];
  checkedAt: string;
}

interface QueryResultsProps {
  checks: Check[];
  brandName: string;
}

export default function QueryResults({
  checks,
  brandName,
}: QueryResultsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterPlatform, setFilterPlatform] = useState<string>("all");

  // Group by query
  const queryGroups = new Map<string, Check[]>();
  for (const check of checks) {
    const existing = queryGroups.get(check.query) || [];
    existing.push(check);
    queryGroups.set(check.query, existing);
  }

  const filteredGroups = Array.from(queryGroups.entries()).filter(
    ([, groupChecks]) =>
      filterPlatform === "all" ||
      groupChecks.some((c) => c.platform === filterPlatform)
  );

  if (checks.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border border-gray-800 bg-gray-900/50">
        <p className="text-sm text-gray-500">
          No query results yet. Run a check to see detailed results.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <div className="flex items-center justify-between p-6 pb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-400">Query Results</h3>
          <p className="mt-1 text-xs text-gray-600">
            {queryGroups.size} queries across {AI_PLATFORMS.length} platforms
          </p>
        </div>
        {/* Platform filter */}
        <div className="flex gap-1">
          <button
            onClick={() => setFilterPlatform("all")}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              filterPlatform === "all"
                ? "bg-gray-700 text-white"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            All
          </button>
          {AI_PLATFORMS.map((p) => (
            <button
              key={p.id}
              onClick={() => setFilterPlatform(p.id)}
              className={`rounded-lg px-2 py-1 text-xs transition-colors ${
                filterPlatform === p.id
                  ? "bg-gray-700 text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
              title={p.name}
            >
              {p.icon}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-gray-800/50">
        {filteredGroups.map(([query, groupChecks]) => {
          const mentionedPlatforms = groupChecks.filter((c) => c.mentioned);

          return (
            <div key={query} className="group">
              {/* Query header */}
              <div className="px-6 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-200">
                      &ldquo;{query}&rdquo;
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      {/* Platform mention indicators */}
                      <div className="flex gap-1.5">
                        {AI_PLATFORMS.map((platform) => {
                          const check = groupChecks.find(
                            (c) => c.platform === platform.id
                          );
                          if (!check) return null;
                          return (
                            <span
                              key={platform.id}
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] ${
                                check.mentioned
                                  ? "bg-green-500/10 text-green-400"
                                  : "bg-gray-800 text-gray-600"
                              }`}
                              title={`${platform.name}: ${check.mentioned ? "Mentioned" : "Not mentioned"}`}
                            >
                              {platform.icon}
                              {check.mentioned ? "Yes" : "No"}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-gray-800 px-2 py-0.5 text-[10px] text-gray-400">
                      {mentionedPlatforms.length}/{groupChecks.length} platforms
                    </span>
                    <button
                      onClick={() =>
                        setExpandedId(expandedId === query ? null : query)
                      }
                      className="rounded-lg p-1 text-gray-500 transition-colors hover:bg-gray-800 hover:text-gray-300"
                    >
                      <svg
                        className={`h-4 w-4 transition-transform duration-200 ${expandedId === query ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              {expandedId === query && (
                <div className="border-t border-gray-800/50 bg-gray-950/30 px-6 py-4">
                  <div className="space-y-4">
                    {groupChecks
                      .filter(
                        (c) =>
                          filterPlatform === "all" ||
                          c.platform === filterPlatform
                      )
                      .map((check) => {
                        const platform = AI_PLATFORMS.find(
                          (p) => p.id === check.platform
                        );
                        return (
                          <div
                            key={check.id}
                            className="rounded-lg border border-gray-800 bg-gray-900/50 p-4"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span>{platform?.icon}</span>
                                <span className="text-sm font-medium text-gray-300">
                                  {platform?.name}
                                </span>
                                {check.mentioned ? (
                                  <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-400">
                                    Mentioned
                                    {check.position
                                      ? ` (#${check.position})`
                                      : ""}
                                  </span>
                                ) : (
                                  <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-400">
                                    Not Mentioned
                                  </span>
                                )}
                              </div>
                              {check.sentiment && (
                                <SentimentBadge sentiment={check.sentiment} />
                              )}
                            </div>

                            {/* AI Response */}
                            {check.fullResponse && (
                              <div className="mt-3 rounded-lg bg-gray-950/50 p-3">
                                <p className="text-xs leading-relaxed text-gray-400">
                                  <HighlightBrand
                                    text={check.fullResponse}
                                    brand={brandName}
                                  />
                                </p>
                              </div>
                            )}

                            {/* Competitors mentioned */}
                            {check.competitors.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                <span className="text-[10px] text-gray-600">
                                  Also mentioned:
                                </span>
                                {check.competitors.map((comp) => (
                                  <span
                                    key={comp}
                                    className="rounded bg-gray-800 px-1.5 py-0.5 text-[10px] text-gray-500"
                                  >
                                    {comp}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SentimentBadge({ sentiment }: { sentiment: string }) {
  const styles: Record<string, string> = {
    positive: "bg-green-500/10 text-green-400",
    neutral: "bg-yellow-500/10 text-yellow-400",
    negative: "bg-red-500/10 text-red-400",
  };

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${styles[sentiment] || styles.neutral}`}
    >
      {sentiment}
    </span>
  );
}

function HighlightBrand({
  text,
  brand,
}: {
  text: string;
  brand: string;
}) {
  if (!brand) return <>{text}</>;

  const regex = new RegExp(`(${brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span
            key={i}
            className="rounded bg-blue-500/20 px-0.5 font-semibold text-blue-300"
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
