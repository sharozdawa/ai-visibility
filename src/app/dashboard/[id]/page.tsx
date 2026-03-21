"use client";

import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import VisibilityScore from "@/components/VisibilityScore";
import PlatformBreakdown from "@/components/PlatformBreakdown";
import VisibilityChart from "@/components/VisibilityChart";
import CompetitorTable from "@/components/CompetitorTable";
import QueryResults from "@/components/QueryResults";

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

interface Brand {
  id: string;
  name: string;
  domain: string | null;
  keywords: string[];
  checks: Check[];
  createdAt: string;
}

export default function BrandDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBrand = useCallback(async () => {
    try {
      const res = await fetch(`/api/brands/${id}`);
      if (res.ok) {
        const data = await res.json();
        setBrand(data);
      }
    } catch (error) {
      console.error("Failed to fetch brand:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBrand();
  }, [fetchBrand]);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleRunCheck = async () => {
    setIsChecking(true);
    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandId: id }),
      });

      if (res.ok) {
        const data = await res.json();
        showNotification(
          "success",
          `Checked ${data.queriesChecked} queries across ${data.platformsChecked} platforms!`
        );
        await fetchBrand();
      } else {
        showNotification("error", "Check failed. Please try again.");
      }
    } catch {
      showNotification("error", "Check failed. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete ${brand?.name}? This will remove all check history.`))
      return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/brands/${id}`, { method: "DELETE" });
      if (res.ok) {
        window.location.href = "/dashboard";
      } else {
        showNotification("error", "Failed to delete brand.");
        setIsDeleting(false);
      }
    } catch {
      showNotification("error", "Failed to delete brand.");
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded-lg bg-gray-800" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="h-64 rounded-xl bg-gray-800/50" />
            <div className="col-span-2 h-64 rounded-xl bg-gray-800/50" />
          </div>
          <div className="h-80 rounded-xl bg-gray-800/50" />
          <div className="h-64 rounded-xl bg-gray-800/50" />
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-white">Brand not found</h1>
        <p className="mt-2 text-gray-500">
          This brand may have been deleted.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const checks = brand.checks || [];
  const totalChecks = checks.length;
  const mentionedChecks = checks.filter((c) => c.mentioned).length;
  const visibilityScore =
    totalChecks > 0 ? Math.round((mentionedChecks / totalChecks) * 100) : 0;

  // Sentiment stats
  const positiveCount = checks.filter(
    (c) => c.sentiment === "positive"
  ).length;
  const neutralCount = checks.filter((c) => c.sentiment === "neutral").length;
  const negativeCount = checks.filter(
    (c) => c.sentiment === "negative"
  ).length;

  // Unique queries
  const uniqueQueries = new Set(checks.map((c) => c.query)).size;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed right-4 top-20 z-50 rounded-lg px-4 py-3 text-sm font-medium shadow-lg animate-fade-in ${
            notification.type === "success"
              ? "border border-green-800 bg-green-900/90 text-green-300"
              : "border border-red-800 bg-red-900/90 text-red-300"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Back + Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-300"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Back to Dashboard
        </Link>

        <div className="mt-4 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">{brand.name}</h1>
            {brand.domain && (
              <p className="mt-1 text-sm text-gray-500">{brand.domain}</p>
            )}
            {brand.keywords.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {brand.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-400 transition-colors hover:border-red-800 hover:bg-red-900/20 hover:text-red-400 disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
            <button
              onClick={handleRunCheck}
              disabled={isChecking}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-blue-500 hover:to-purple-500 disabled:opacity-50"
            >
              {isChecking ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
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
                  Checking...
                </>
              ) : (
                <>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
                    />
                  </svg>
                  Run New Check
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Stats overview */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Large visibility score */}
        <div className="flex items-center justify-center rounded-xl border border-gray-800 bg-gray-900/50 p-8 backdrop-blur-sm lg:row-span-2">
          <VisibilityScore score={visibilityScore} size="lg" />
        </div>

        {/* Quick stats */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 backdrop-blur-sm">
          <p className="text-xs font-medium text-gray-500">Total Checks</p>
          <p className="mt-1 text-3xl font-bold text-white">{totalChecks}</p>
          <p className="mt-1 text-xs text-gray-600">
            {uniqueQueries} unique queries
          </p>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 backdrop-blur-sm">
          <p className="text-xs font-medium text-gray-500">Mentions</p>
          <p className="mt-1 text-3xl font-bold text-green-400">
            {mentionedChecks}
          </p>
          <p className="mt-1 text-xs text-gray-600">
            {totalChecks > 0
              ? `${Math.round((mentionedChecks / totalChecks) * 100)}% mention rate`
              : "No checks yet"}
          </p>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 backdrop-blur-sm">
          <p className="text-xs font-medium text-gray-500">
            Dominant Sentiment
          </p>
          <p className="mt-1 text-3xl font-bold">
            {positiveCount >= neutralCount && positiveCount >= negativeCount ? (
              <span className="text-green-400">Positive</span>
            ) : negativeCount >= positiveCount &&
              negativeCount >= neutralCount ? (
              <span className="text-red-400">Negative</span>
            ) : (
              <span className="text-yellow-400">Neutral</span>
            )}
          </p>
          <div className="mt-2 flex gap-3 text-xs text-gray-600">
            <span className="text-green-500">{positiveCount} pos</span>
            <span className="text-yellow-500">{neutralCount} neu</span>
            <span className="text-red-500">{negativeCount} neg</span>
          </div>
        </div>

        {/* Unique competitors count */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 backdrop-blur-sm lg:col-span-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">
                Competitors Detected
              </p>
              <p className="mt-1 text-3xl font-bold text-purple-400">
                {
                  new Set(
                    checks
                      .flatMap((c) => c.competitors)
                      .filter(
                        (comp) =>
                          comp.toLowerCase() !== brand.name.toLowerCase()
                      )
                  ).size
                }
              </p>
            </div>
            <div className="flex flex-wrap gap-1">
              {Array.from(
                new Set(
                  checks
                    .flatMap((c) => c.competitors)
                    .filter(
                      (comp) =>
                        comp.toLowerCase() !== brand.name.toLowerCase()
                    )
                )
              )
                .slice(0, 6)
                .map((comp) => (
                  <span
                    key={comp}
                    className="rounded-full bg-gray-800 px-2.5 py-1 text-xs text-gray-400"
                  >
                    {comp}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Platform Breakdown */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-white">
          Platform Breakdown
        </h2>
        <PlatformBreakdown checks={checks} />
      </div>

      {/* Visibility Chart */}
      <div className="mb-8">
        <VisibilityChart checks={checks} />
      </div>

      {/* Competitor Table */}
      <div className="mb-8">
        <CompetitorTable checks={checks} brandName={brand.name} />
      </div>

      {/* Query Results */}
      <div className="mb-8">
        <QueryResults checks={checks} brandName={brand.name} />
      </div>
    </div>
  );
}
