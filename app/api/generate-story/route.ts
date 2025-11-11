import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AutobiographyData } from "@/lib/types";

const MODEL_NAME = "gemini-pro";

const buildPrompt = (data: AutobiographyData) => `
You are a gifted biographical writer. Craft a compelling autobiography chapter for the following individual.

Tone preference: ${data.writingStyle}.

Customization preferences:
- Title: ${data.customizations.title}
- Subtitle: ${data.customizations.subtitle}
- Favorite quote: ${data.customizations.quote}

Personal Information:
${JSON.stringify(data.personalInfo, null, 2)}

Childhood Memories:
${data.childhoodMemories}

Education Journey:
${data.educationJourney}

Career & Achievements:
${data.careerAchievements}

Family & Relationships:
${data.familyRelationships}

Life Challenges & Lessons:
${data.lifeChallenges}

Dreams, Beliefs & Future Goals:
${data.dreamsBeliefs}

Timeline Events:
${data.timeline
  .map(
    (event) =>
      `${event.year} - ${event.title}: ${event.description}. Notes: ${event.notes ?? "none"}. Image: ${event.imageUrl ?? "n/a"}`
  )
  .join("\n")}

Write in a way that feels cohesive, immersive, and faithful to the provided details. Include section headings that align with each stage of life, and close with an inspiring outlook toward the future. Keep the entire narrative under 1500 words.
`;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { data?: AutobiographyData };
    if (!body?.data) {
      return NextResponse.json(
        { error: "Missing autobiography data" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const client = new GoogleGenerativeAI(apiKey);
    const model = client.getGenerativeModel({ model: MODEL_NAME });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: buildPrompt(body.data) }]
        }
      ]
    });

    const story =
      result.response.text() ??
      "We couldn't generate a story at this time. Please try again later.";

    return NextResponse.json({ story });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate story" },
      { status: 500 }
    );
  }
}
