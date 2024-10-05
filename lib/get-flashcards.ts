import { generateObject } from "ai";
import { chromeai } from "chrome-ai";
import { z } from "zod";

export const Flashcard = z.object({
  question: z.string(),
  answer: z.string(),
  category: z.enum([
    "science",
    "math",
    "history",
    "literature",
    "art",
    "music",
    "technology",
    "sports",
  ]),
});

type Interest = z.infer<typeof Flashcard>["category"];

export async function getFlashcards(
  count: number,
  interests: readonly [Interest, ...Interest[]],
) {
  const { object } = await generateObject({
    model: chromeai("text"),
    schema: Flashcard.array().length(count),
    maxRetries: 5,
    prompt: `
      Generate an array of ${count} trivia questions for someone interested in ${interests.join(", ")}.
      Please respond with an array of objects, each containing a "question", "answer", and "category" property.
    `,
  });
  return object;
}
