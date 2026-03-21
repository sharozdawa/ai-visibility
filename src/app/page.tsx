import Link from "next/link";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute right-1/4 top-32 h-96 w-96 rounded-full bg-purple-500/5 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        <div className="animate-fade-in text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-800 bg-gray-900/50 px-4 py-1.5 text-sm text-gray-400 backdrop-blur-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Free &amp; Open Source
          </div>

          {/* Heading */}
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Track Your Brand&apos;s{" "}
            <span className="gradient-text">AI Visibility</span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in-delay-1 mx-auto mt-6 max-w-2xl text-lg text-gray-400 sm:text-xl">
            Monitor how ChatGPT, Perplexity, Claude, and Gemini mention your
            brand. Understand your AI search presence and stay ahead of
            competitors.
          </p>

          {/* Stats */}
          <div className="animate-fade-in-delay-2 mt-10 flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              <span>
                <strong className="text-white">4</strong> AI Platforms
              </span>
            </div>
            <div className="h-4 w-px bg-gray-800" />
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔍</span>
              <span>
                <strong className="text-white">10</strong> Query Templates
              </span>
            </div>
            <div className="h-4 w-px bg-gray-800" />
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <span>
                <strong className="text-white">Free</strong> &amp; Open Source
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="animate-fade-in-delay-3 mt-10 flex items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:from-blue-500 hover:to-purple-500 hover:shadow-blue-500/30 hover:scale-105"
            >
              Get Started
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
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
            <a
              href="https://github.com/anthropics/ai-visibility"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-700 px-8 py-3.5 text-sm font-semibold text-gray-300 transition-all hover:border-gray-600 hover:bg-gray-900/50 hover:text-white"
            >
              <svg
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Star on GitHub
            </a>
          </div>
        </div>

        {/* Platform logos row */}
        <div className="animate-fade-in-delay-3 mx-auto mt-20 flex max-w-lg items-center justify-center gap-12">
          {[
            { name: "ChatGPT", icon: "🤖", color: "#10a37f" },
            { name: "Perplexity", icon: "🔍", color: "#20b2aa" },
            { name: "Claude", icon: "🧠", color: "#d97706" },
            { name: "Gemini", icon: "✨", color: "#4285f4" },
          ].map((p) => (
            <div key={p.name} className="flex flex-col items-center gap-2">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-xl border border-gray-800 bg-gray-900/50 text-2xl transition-all hover:scale-110"
                style={{
                  boxShadow: `0 0 20px ${p.color}15`,
                }}
              >
                {p.icon}
              </div>
              <span className="text-xs text-gray-500">{p.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative border-t border-gray-800/50">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Everything you need to track{" "}
              <span className="gradient-text">AI visibility</span>
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Comprehensive monitoring across all major AI platforms
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Real-time Monitoring",
                description:
                  "Check how AI platforms respond to queries about your brand right now. Track changes over time.",
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                    />
                  </svg>
                ),
                color: "from-blue-500 to-cyan-500",
              },
              {
                title: "Competitor Analysis",
                description:
                  "See which competitors are mentioned alongside your brand. Understand your competitive positioning.",
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                    />
                  </svg>
                ),
                color: "from-purple-500 to-pink-500",
              },
              {
                title: "Sentiment Tracking",
                description:
                  "Understand the tone of AI responses about your brand. Track positive, neutral, and negative mentions.",
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                    />
                  </svg>
                ),
                color: "from-green-500 to-emerald-500",
              },
              {
                title: "Multi-Platform",
                description:
                  "Monitor ChatGPT, Perplexity, Claude, and Gemini all in one place. Compare visibility across platforms.",
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-1.243 1.007-2.25 2.25-2.25h13.5z"
                    />
                  </svg>
                ),
                color: "from-orange-500 to-amber-500",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/30 p-6 backdrop-blur-sm transition-all duration-300 hover:border-gray-700 hover:bg-gray-900/50"
              >
                {/* Gradient top border */}
                <div
                  className={`absolute left-0 top-0 h-0.5 w-full bg-gradient-to-r ${feature.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />

                <div
                  className={`mb-4 inline-flex rounded-lg bg-gradient-to-br ${feature.color} p-2.5 text-white`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-base font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-gray-800/50">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              How it works
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Three simple steps to start tracking your AI visibility
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Add Your Brand",
                description:
                  "Enter your brand name, domain, and relevant keywords to track.",
              },
              {
                step: "2",
                title: "Run Visibility Checks",
                description:
                  "We query AI platforms with relevant questions and analyze responses.",
              },
              {
                step: "3",
                title: "Track & Optimize",
                description:
                  "Monitor your visibility score, sentiment, and competitive position over time.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-lg font-bold text-white">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-gray-800/50">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-900/50 p-12 text-center">
            {/* Background gradient blobs */}
            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

            <div className="relative">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Ready to track your AI visibility?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-gray-400">
                Stop guessing how AI sees your brand. Start tracking today --
                it&apos;s free and open source.
              </p>
              <Link
                href="/dashboard"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:from-blue-500 hover:to-purple-500 hover:shadow-blue-500/30 hover:scale-105"
              >
                Start Tracking Now
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
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-gray-600">
              Built by{" "}
              <a
                href="https://github.com/anthropics"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-white"
              >
                Sharoz Dawa
              </a>
            </p>
            <a
              href="https://github.com/anthropics/ai-visibility"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-gray-600 transition-colors hover:text-gray-400"
            >
              <svg
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
