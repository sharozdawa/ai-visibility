"use client";

import { useEffect, useState } from "react";

interface VisibilityScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
  label?: string;
}

export default function VisibilityScore({
  score,
  size = "lg",
  label = "AI Visibility Score",
}: VisibilityScoreProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const duration = 1200;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [score]);

  const dimensions = {
    sm: { size: 80, stroke: 6, fontSize: "text-lg", labelSize: "text-[10px]" },
    md: {
      size: 120,
      stroke: 8,
      fontSize: "text-3xl",
      labelSize: "text-xs",
    },
    lg: {
      size: 180,
      stroke: 10,
      fontSize: "text-5xl",
      labelSize: "text-sm",
    },
  };

  const d = dimensions[size];
  const radius = (d.size - d.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = mounted ? (animatedScore / 100) * circumference : 0;
  const offset = circumference - progress;

  // Color based on score
  const getColor = (s: number) => {
    if (s >= 60) return { stroke: "#22c55e", glow: "rgba(34, 197, 94, 0.3)" };
    if (s >= 30) return { stroke: "#eab308", glow: "rgba(234, 179, 8, 0.3)" };
    return { stroke: "#ef4444", glow: "rgba(239, 68, 68, 0.3)" };
  };

  const color = getColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: d.size, height: d.size }}>
        <svg
          width={d.size}
          height={d.size}
          className="-rotate-90"
          style={{
            filter: `drop-shadow(0 0 ${size === "lg" ? "20px" : "10px"} ${color.glow})`,
          }}
        >
          {/* Background circle */}
          <circle
            cx={d.size / 2}
            cy={d.size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={d.stroke}
          />
          {/* Progress circle */}
          <circle
            cx={d.size / 2}
            cy={d.size / 2}
            r={radius}
            fill="none"
            stroke={color.stroke}
            strokeWidth={d.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Score number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${d.fontSize} font-bold text-white`}>
            {animatedScore}
          </span>
          {size === "lg" && (
            <span className="text-xs text-gray-400">/ 100</span>
          )}
        </div>
      </div>
      {label && (
        <span
          className={`${d.labelSize} font-medium text-gray-400`}
        >
          {label}
        </span>
      )}
    </div>
  );
}
