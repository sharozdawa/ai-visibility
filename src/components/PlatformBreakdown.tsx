"use client";

import { AI_PLATFORMS } from "@/lib/platforms";

interface Check {
  id: string;
  query: string;
  platform: string;
  mentioned: boolean;
  sentiment: string | null;
  checkedAt: string;
}

interface PlatformBreakdownProps {
  checks: Check[];
}

export default function PlatformBreakdown({ checks }: PlatformBreakdownProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {AI_PLATFORMS.map((platform) => {
        const platformChecks = checks.filter(
          (c) => c.platform === platform.id
        );
        const totalChecks = platformChecks.length;
        const mentionedCount = platformChecks.filter(
          (c) => c.mentioned
        ).length;
        const mentionRate =
          totalChecks > 0
            ? Math.round((mentionedCount / totalChecks) * 100)
            : 0;

        // Sentiment breakdown
        const positive = platformChecks.filter(
          (c) => c.sentiment === "positive"
        ).length;
        const neutral = platformChecks.filter(
          (c) => c.sentiment === "neutral"
        ).length;
        const negative = platformChecks.filter(
          (c) => c.sentiment === "negative"
        ).length;
        const sentimentTotal = positive + neutral + negative || 1;

        // Top queries where brand appears
        const topQueries = platformChecks
          .filter((c) => c.mentioned)
          .slice(0, 3)
          .map((c) => c.query);

        return (
          <div
            key={platform.id}
            className="group relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 p-5 backdrop-blur-sm transition-all duration-300 hover:border-gray-700"
          >
            {/* Platform color accent */}
            <div
              className="absolute left-0 top-0 h-1 w-full opacity-60"
              style={{ backgroundColor: platform.color }}
            />

            {/* Header */}
            <div className="flex items-center gap-3">
              <span className="text-2xl">{platform.icon}</span>
              <div>
                <h3 className="font-semibold text-white">{platform.name}</h3>
                <p className="text-xs text-gray-500">{platform.company}</p>
              </div>
            </div>

            {/* Mention Rate */}
            <div className="mt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-gray-400">Mention Rate</span>
                <span
                  className="text-2xl font-bold"
                  style={{ color: platform.color }}
                >
                  {mentionRate}%
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-800">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${mentionRate}%`,
                    backgroundColor: platform.color,
                  }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-600">
                {mentionedCount} of {totalChecks} queries
              </p>
            </div>

            {/* Sentiment Breakdown */}
            {totalChecks > 0 && (
              <div className="mt-4">
                <span className="text-xs font-medium text-gray-400">
                  Sentiment
                </span>
                <div className="mt-1.5 flex h-2 gap-0.5 overflow-hidden rounded-full">
                  {positive > 0 && (
                    <div
                      className="rounded-full bg-green-500"
                      style={{
                        width: `${(positive / sentimentTotal) * 100}%`,
                      }}
                    />
                  )}
                  {neutral > 0 && (
                    <div
                      className="rounded-full bg-yellow-500"
                      style={{
                        width: `${(neutral / sentimentTotal) * 100}%`,
                      }}
                    />
                  )}
                  {negative > 0 && (
                    <div
                      className="rounded-full bg-red-500"
                      style={{
                        width: `${(negative / sentimentTotal) * 100}%`,
                      }}
                    />
                  )}
                </div>
                <div className="mt-1 flex justify-between text-[10px] text-gray-500">
                  <span className="text-green-400">{positive} pos</span>
                  <span className="text-yellow-400">{neutral} neu</span>
                  <span className="text-red-400">{negative} neg</span>
                </div>
              </div>
            )}

            {/* Top Queries */}
            {topQueries.length > 0 && (
              <div className="mt-4">
                <span className="text-xs font-medium text-gray-400">
                  Top Mentions
                </span>
                <div className="mt-1.5 space-y-1">
                  {topQueries.map((q, i) => (
                    <p
                      key={i}
                      className="truncate text-xs text-gray-500"
                      title={q}
                    >
                      &ldquo;{q}&rdquo;
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {totalChecks === 0 && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">No data yet</p>
                <p className="text-xs text-gray-700">
                  Run a check to see results
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
