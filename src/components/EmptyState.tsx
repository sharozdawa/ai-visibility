"use client";

interface EmptyStateProps {
  onAddBrand: () => void;
}

export default function EmptyState({ onAddBrand }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      {/* Abstract illustration */}
      <div className="relative mb-8">
        {/* Outer glow ring */}
        <div className="absolute -inset-8 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-2xl" />

        {/* Main illustration container */}
        <div className="relative flex h-40 w-40 items-center justify-center">
          {/* Orbital rings */}
          <div className="absolute inset-0 animate-[spin_20s_linear_infinite] rounded-full border border-dashed border-gray-700" />
          <div className="absolute inset-3 animate-[spin_15s_linear_infinite_reverse] rounded-full border border-dashed border-gray-800" />
          <div className="absolute inset-6 animate-[spin_10s_linear_infinite] rounded-full border border-dashed border-gray-800/50" />

          {/* Center icon */}
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg">
            <svg
              className="h-10 w-10 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.577 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.577-3.007-9.963-7.178z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>

          {/* Floating platform dots */}
          <div
            className="absolute left-0 top-1/2 h-3 w-3 -translate-y-1/2 animate-pulse rounded-full"
            style={{ backgroundColor: "#10a37f" }}
            title="ChatGPT"
          />
          <div
            className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 animate-pulse rounded-full"
            style={{ backgroundColor: "#20b2aa", animationDelay: "0.5s" }}
            title="Perplexity"
          />
          <div
            className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 animate-pulse rounded-full"
            style={{ backgroundColor: "#d97706", animationDelay: "1s" }}
            title="Claude"
          />
          <div
            className="absolute bottom-0 left-1/2 h-3 w-3 -translate-x-1/2 animate-pulse rounded-full"
            style={{ backgroundColor: "#4285f4", animationDelay: "1.5s" }}
            title="Gemini"
          />
        </div>
      </div>

      {/* Text */}
      <h2 className="text-xl font-semibold text-white">
        No brands tracked yet
      </h2>
      <p className="mt-2 max-w-sm text-center text-sm text-gray-500">
        Add your first brand to start tracking how AI platforms like ChatGPT,
        Perplexity, Claude, and Gemini mention it.
      </p>

      {/* CTA */}
      <button
        onClick={onAddBrand}
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:from-blue-500 hover:to-purple-500 hover:shadow-blue-500/30"
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
        Add Your First Brand
      </button>
    </div>
  );
}
