"use client";

import { AI_PLATFORMS } from "@/lib/platforms";

interface Check {
  id: string;
  platform: string;
  mentioned: boolean;
  competitors: string[];
}

interface CompetitorTableProps {
  checks: Check[];
  brandName: string;
}

interface CompetitorData {
  name: string;
  count: number;
  platforms: Set<string>;
}

export default function CompetitorTable({
  checks,
  brandName,
}: CompetitorTableProps) {
  // Aggregate competitor data
  const competitorMap = new Map<string, CompetitorData>();

  for (const check of checks) {
    for (const comp of check.competitors) {
      if (comp.toLowerCase() === brandName.toLowerCase()) continue;
      const existing = competitorMap.get(comp) || {
        name: comp,
        count: 0,
        platforms: new Set<string>(),
      };
      existing.count++;
      existing.platforms.add(check.platform);
      competitorMap.set(comp, existing);
    }
  }

  const competitors = Array.from(competitorMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  if (competitors.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border border-gray-800 bg-gray-900/50">
        <p className="text-sm text-gray-500">
          No competitor data yet. Run a check to discover competitors.
        </p>
      </div>
    );
  }

  const maxCount = Math.max(...competitors.map((c) => c.count));

  // Brand's own mention count
  const brandMentions = checks.filter((c) => c.mentioned).length;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <div className="p-6 pb-4">
        <h3 className="text-sm font-medium text-gray-400">
          Competitor Analysis
        </h3>
        <p className="mt-1 text-xs text-gray-600">
          Other brands mentioned in AI responses alongside {brandName}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-t border-gray-800">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Brand
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Mentions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Platforms
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                vs {brandName}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {/* Your brand row */}
            <tr className="bg-blue-500/5">
              <td className="whitespace-nowrap px-6 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="text-sm font-semibold text-blue-400">
                    {brandName}
                  </span>
                  <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-medium text-blue-400">
                    YOU
                  </span>
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-3">
                <span className="text-sm font-medium text-white">
                  {brandMentions}
                </span>
              </td>
              <td className="px-6 py-3">
                <div className="flex gap-1">
                  {AI_PLATFORMS.map((p) => {
                    const hasPlatform = checks.some(
                      (c) => c.platform === p.id && c.mentioned
                    );
                    return (
                      <span
                        key={p.id}
                        className={`text-xs ${hasPlatform ? "" : "opacity-20"}`}
                        title={p.name}
                      >
                        {p.icon}
                      </span>
                    );
                  })}
                </div>
              </td>
              <td className="px-6 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-800">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-500"
                      style={{
                        width: `${maxCount > 0 ? (brandMentions / Math.max(maxCount, brandMentions)) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </td>
            </tr>

            {/* Competitor rows */}
            {competitors.map((comp) => (
              <tr
                key={comp.name}
                className="transition-colors hover:bg-gray-800/30"
              >
                <td className="whitespace-nowrap px-6 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-gray-500" />
                    <span className="text-sm text-gray-300">{comp.name}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-3">
                  <span className="text-sm text-gray-400">{comp.count}</span>
                </td>
                <td className="px-6 py-3">
                  <div className="flex gap-1">
                    {AI_PLATFORMS.map((p) => (
                      <span
                        key={p.id}
                        className={`text-xs ${comp.platforms.has(p.id) ? "" : "opacity-20"}`}
                        title={p.name}
                      >
                        {p.icon}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-800">
                      <div
                        className="h-full rounded-full bg-gray-500 transition-all duration-500"
                        style={{
                          width: `${(comp.count / Math.max(maxCount, brandMentions)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
