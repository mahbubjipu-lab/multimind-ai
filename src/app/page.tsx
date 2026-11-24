
"use client";

import { useState } from "react";

const models = [
  "NVIDIA Nemotron",
  "Baidu ERNIE",
  "Liquid LFM",
  "Recursive Flint",
  "Dots 3 Note"
];

type Result = {
  model: string;
  success: boolean;
  answer: string;
  error?: string;
};

export default function Home() {
  const [question, setQuestion] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);

  async function askAI() {
    if (!question.trim() || loading) return;

    setLoading(true);
    setResults([]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }

      setResults(data.results || []);
    } catch (error) {
      setResults([{
        model: "System",
        success: false,
        answer: error instanceof Error
          ? error.message
          : "Something went wrong"
      }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        <header className="text-center py-10">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">
            MultiMind AI
          </h1>
          <p className="text-slate-400 mt-3">
            Five AI Models. One Question.
          </p>
        </header>

        <section className="panel p-5 md:p-7">
          <h2 className="text-xl font-semibold mb-4">
            Ask Your Question
          </h2>

          <textarea
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="আপনার প্রশ্ন এখানে লিখুন..."
            rows={5}
            maxLength={8000}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white resize-y"
          />

          <div className="flex flex-wrap justify-between items-center gap-3 mt-4">
            <span className="text-sm text-slate-400">
              5 AI Models Selected
            </span>

            <button
              onClick={askAI}
              disabled={loading || !question.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 px-7 py-3 rounded-xl font-semibold"
            >
              {loading ? "AI Working..." : "✨ Ask All 5 AI"}
            </button>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold mb-5">
            AI Model Responses
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {models.map((model, index) => {
              const result = results.find(
                item => item.model ===
                  (process.env.NEXT_PUBLIC_UNUSED || "")
              );

              const answer = results[index];

              return (
                <article key={model} className="panel p-5">
                  <h3 className="font-semibold text-indigo-300 mb-3">
                    {model}
                  </h3>

                  <div className="text-sm text-slate-300 whitespace-pre-wrap break-words">
                    {loading
                      ? "Waiting for AI response..."
                      : answer
                        ? answer.success
                          ? answer.answer
                          : answer.error || "Request failed"
                        : "আপনার প্রশ্নের উত্তরের জন্য অপেক্ষা করছে..."}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <footer className="text-center text-slate-500 text-sm py-12">
          MultiMind AI • Powered by OpenRouter
        </footer>

      </div>
    </main>
  );
}
