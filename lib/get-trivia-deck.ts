import { generateObject } from "ai";
import { chromeai } from "chrome-ai";
import _ from "lodash";
import { z } from "zod";
import type { Category } from "./constants";

async function getTrivia(category: Category) {
  const { object: trivia } = await generateObject({
    model: chromeai("text", { temperature: 0.8 }),
    schema: z.object({
      question: z.string(),
      answer: z.string(),
    }),
    prompt: `
      Generate a trivia question for the category: "${category}".
      Please respond an object with a "question" and "answer" property.
    `,
  });
  return { ...trivia, category };
}

export async function getTriviaDeck(count: number, interests: Category[]) {
  const categories = _.map(Array(count), () => _.sample(interests));
  return Array.fromAsync(categories, (c) => c && getTrivia(c));
}
