"use client";

import Link from "next/link";
import VisibilityScore from "./VisibilityScore";
import { AI_PLATFORMS } from "@/lib/platforms";

interface Check {
  id: string;
  platform: string;
  mentioned: boolean;
  sentiment: string | null;
  checkedAt: string;
}

interface BrandCardProps {
  brand: {
    id: string;
    name: string;
    domain: string | null;
    keywords: string[];
    checks: Check[];
  };
  onCheckNow: (brandId: string) => void;
  isChecking: boolean;
}

export default function BrandCard({
  brand,
  onCheckNow,
  isChecking,
}: BrandCardProps) {
  const checks = brand.checks || [];

  // Calculate overall visibility score
  const totalChecks = checks.length;
  const mentionedChecks = checks.filter((c) => c.mentioned).length;
  const visibilityScore =
    totalChecks > 0 ? Math.round((mentionedChecks / totalChecks) * 100) : 0;

  // Platform breakdown
  const platformStats = AI_PLATFORMS.map((platform) => {
    const platformChecks = checks.filter((c) => c.platform === platform.id);
    const mentioned = platformChecks.filter((c) => c.mentioned).length;
    const rate =
      platformChecks.length > 0
        ? Math.round((mentioned / platformChecks.length) * 100)
        : 0;
    return { ...platform, rate, total: platformChecks.length };
  });

  // Last checked
  const lastCheck = checks.length > 0 ? new Date(checks[0].checkedAt) : null;
  const lastCheckedText = lastCheck
    ? formatTimeAgo(lastCheck)
    : "Never checked";

  // Mini sparkline data (last 7 check batches)
  const sparklineData = getSparklineData(checks);

  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-gray-700 hover:bg-gray-900/80 hover:shadow-lg hover:shadow-blue-500/5">
      {/* Subtle gradient overlay on hover */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative">
        {/* Top row: Name + Score */}
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold text-white">
              {brand.name}
            </h3>
            {brand.domain && (
              <p className="mt-0.5 truncate text-sm text-gray-500">
                {brand.domain}
              </p>
            )}
          </div>
          <div className="ml-4 flex-shrink-0">
            <VisibilityScore score={visibilityScore} size="sm" label="" />
          </div>
        </div>

        {/* Keywords */}
        {brand.keywords.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {brand.keywords.slice(0, 3).map((kw) => (
              <span
                key={kw}
                className="rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-400"
              >
                {kw}
              </span>
            ))}
            {brand.keywords.length > 3 && (
              <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-500">
                +{brand.keywords.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Sparkline */}
        {sparklineData.length > 1 && (
          <div className="mt-4">
            <MiniSparkline data={sparklineData} />
          </div>
        )}

        {/* Platform badges */}
        <div className="mt-4 flex gap-2">
          {platformStats.map((p) => (
            <div
              key={p.id}
              className="flex flex-1 flex-col items-center rounded-lg bg-gray-800/50 px-2 py-2"
            >
              <span className="text-xs">{p.icon}</span>
              <span
                className="mt-0.5 text-xs font-semibold"
                style={{ color: p.total > 0 ? p.color : "#6b7280" }}
              >
                {p.total > 0 ? `${p.rate}%` : "--"}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-gray-500">{lastCheckedText}</span>
          <div className="flex gap-2">
            <Link
              href={`/dashboard/${brand.id}`}
              className="rounded-lg bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
            >
              Details
            </Link>
            <button
              onClick={() => onCheckNow(brand.id)}
              disabled={isChecking}
              className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-1.5 text-xs font-medium text-white transition-all hover:from-blue-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isChecking ? (
                <span className="flex items-center gap-1.5">
                  <svg
                    className="h-3 w-3 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Checking
                </span>
              ) : (
                "Check Now"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniSparkline({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const width = 200;
  const height = 32;
  const padding = 2;

  const points = data.map((value, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y =
      height - padding - ((value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const areaPoints = [
    `${padding},${height - padding}`,
    ...points,
    `${width - padding},${height - padding}`,
  ].join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-8 w-full"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#sparkGrad)" />
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke="#3b82f6"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getSparklineData(checks: Check[]): number[] {
  if (checks.length === 0) return [];

  // Group checks by hour buckets and compute visibility per bucket
  const buckets = new Map<string, { mentioned: number; total: number }>();
  for (const check of checks) {
    const date = new Date(check.checkedAt);
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
    const bucket = buckets.get(key) || { mentioned: 0, total: 0 };
    bucket.total++;
    if (check.mentioned) bucket.mentioned++;
    buckets.set(key, bucket);
  }

  const values = Array.from(buckets.values()).map((b) =>
    Math.round((b.mentioned / b.total) * 100)
  );
  return values.slice(-7);
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}
