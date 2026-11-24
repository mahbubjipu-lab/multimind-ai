
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const API_URL =
  "https://openrouter.ai/api/v1/chat/completions";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;

    const models = (
      process.env.OPENROUTER_MODELS || ""
    )
      .split(",")
      .map((model) => model.trim())
      .filter(Boolean);

    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenRouter API key missing" },
        { status: 500 }
      );
    }

    if (models.length !== 5) {
      return NextResponse.json(
        { error: "Please configure exactly 5 models" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const question = body.question;

    if (
      typeof question !== "string" ||
      !question.trim() ||
      question.length > 8000
    ) {
      return NextResponse.json(
        { error: "Invalid question" },
        { status: 400 }
      );
    }

    const results = await Promise.all(
      models.map(async (model) => {
        try {
          const response = await fetch(API_URL, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
              "X-Title": "MultiMind AI"
            },
            body: JSON.stringify({
              model,
              messages: [
                {
                  role: "system",
                  content:
                    "You are a helpful AI assistant. Reply in the user's language."
                },
                {
                  role: "user",
                  content: question.trim()
                }
              ]
            }),
            signal: AbortSignal.timeout(90000)
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data.error?.message ||
              `API Error ${response.status}`
            );
          }

          return {
            model,
            success: true,
            answer:
              data.choices?.[0]?.message?.content ||
              "No response received"
          };

        } catch (error) {
          return {
            model,
            success: false,
            answer: "",
            error:
              error instanceof Error
                ? error.message
                : "AI request failed"
          };
        }
      })
    );

    return NextResponse.json({ results });

  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
