"use client";

import { useState, useRef, useEffect } from "react";

interface AddBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (brand: {
    name: string;
    domain: string;
    keywords: string[];
  }) => Promise<void>;
}

export default function AddBrandModal({
  isOpen,
  onClose,
  onAdd,
}: AddBrandModalProps) {
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      nameRef.current?.focus();
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  const handleAddKeyword = () => {
    const trimmed = keywordInput.trim();
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords([...keywords, trimmed]);
      setKeywordInput("");
    }
  };

  const handleKeywordKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const removeKeyword = (kw: string) => {
    setKeywords(keywords.filter((k) => k !== kw));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Brand name is required");
      return;
    }

    setIsLoading(true);
    try {
      // If there's text in the keyword input, add it
      const finalKeywords = keywordInput.trim()
        ? [...keywords, keywordInput.trim()]
        : keywords;
      await onAdd({ name: name.trim(), domain: domain.trim(), keywords: finalKeywords });
      setName("");
      setDomain("");
      setKeywords([]);
      setKeywordInput("");
      onClose();
    } catch {
      setError("Failed to add brand. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md animate-in zoom-in-95 fade-in duration-200">
        <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl">
          {/* Header */}
          <div className="border-b border-gray-800 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Add New Brand
              </h2>
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-gray-500 transition-colors hover:bg-gray-800 hover:text-gray-300"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Track how AI platforms mention your brand
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              {/* Brand Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">
                  Brand Name <span className="text-red-400">*</span>
                </label>
                <input
                  ref={nameRef}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Vercel"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Domain */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">
                  Domain
                  <span className="ml-1 text-xs text-gray-500">
                    (optional)
                  </span>
                </label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="e.g., vercel.com"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Keywords */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">
                  Keywords
                  <span className="ml-1 text-xs text-gray-500">
                    (press Enter or comma to add)
                  </span>
                </label>
                <div className="flex flex-wrap gap-1.5 rounded-lg border border-gray-700 bg-gray-800 p-2">
                  {keywords.map((kw) => (
                    <span
                      key={kw}
                      className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-2 py-1 text-xs text-blue-400"
                    >
                      {kw}
                      <button
                        type="button"
                        onClick={() => removeKeyword(kw)}
                        className="ml-0.5 text-blue-400/60 hover:text-blue-300"
                      >
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={handleKeywordKeyDown}
                    onBlur={handleAddKeyword}
                    placeholder={
                      keywords.length === 0
                        ? "e.g., hosting, deployment, frontend"
                        : "Add more..."
                    }
                    className="min-w-[120px] flex-1 bg-transparent py-1 text-sm text-white placeholder-gray-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !name.trim()}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:from-blue-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
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
                    Adding...
                  </>
                ) : (
                  "Add Brand"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
