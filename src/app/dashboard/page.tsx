"use client";

import { useState, useEffect, useCallback } from "react";
import BrandCard from "@/components/BrandCard";
import AddBrandModal from "@/components/AddBrandModal";
import EmptyState from "@/components/EmptyState";

interface Check {
  id: string;
  platform: string;
  mentioned: boolean;
  sentiment: string | null;
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

export default function DashboardPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkingBrandId, setCheckingBrandId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fetchBrands = useCallback(async () => {
    try {
      const res = await fetch("/api/brands");
      if (res.ok) {
        const data = await res.json();
        setBrands(data);
      }
    } catch (error) {
      console.error("Failed to fetch brands:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddBrand = async (brand: {
    name: string;
    domain: string;
    keywords: string[];
  }) => {
    const res = await fetch("/api/brands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(brand),
    });

    if (!res.ok) throw new Error("Failed to add brand");

    showNotification("success", `${brand.name} added successfully!`);
    await fetchBrands();
  };

  const handleCheckNow = async (brandId: string) => {
    setCheckingBrandId(brandId);
    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandId }),
      });

      if (res.ok) {
        const data = await res.json();
        showNotification(
          "success",
          `Checked ${data.queriesChecked} queries across ${data.platformsChecked} platforms!`
        );
        await fetchBrands();
      } else {
        showNotification("error", "Check failed. Please try again.");
      }
    } catch {
      showNotification("error", "Check failed. Please try again.");
    } finally {
      setCheckingBrandId(null);
    }
  };

  // Aggregate stats
  const totalChecks = brands.reduce((sum, b) => sum + b.checks.length, 0);
  const totalMentions = brands.reduce(
    (sum, b) => sum + b.checks.filter((c) => c.mentioned).length,
    0
  );
  const avgVisibility =
    totalChecks > 0 ? Math.round((totalMentions / totalChecks) * 100) : 0;

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

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Your Brands</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and monitor your brand visibility across AI platforms
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/10 transition-all hover:from-blue-500 hover:to-purple-500 hover:shadow-blue-500/20"
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
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add Brand
        </button>
      </div>

      {/* Stats bar */}
      {brands.length > 0 && totalChecks > 0 && (
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            {
              label: "Brands Tracked",
              value: brands.length,
              color: "text-blue-400",
            },
            {
              label: "Total Checks",
              value: totalChecks,
              color: "text-purple-400",
            },
            {
              label: "Total Mentions",
              value: totalMentions,
              color: "text-green-400",
            },
            {
              label: "Avg Visibility",
              value: `${avgVisibility}%`,
              color: "text-amber-400",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 backdrop-blur-sm"
            >
              <p className="text-xs text-gray-500">{stat.label}</p>
              <p className={`mt-1 text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-xl border border-gray-800 bg-gray-900/50"
            />
          ))}
        </div>
      ) : brands.length === 0 ? (
        <EmptyState onAddBrand={() => setIsModalOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <BrandCard
              key={brand.id}
              brand={brand}
              onCheckNow={handleCheckNow}
              isChecking={checkingBrandId === brand.id}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <AddBrandModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddBrand}
      />
    </div>
  );
}
