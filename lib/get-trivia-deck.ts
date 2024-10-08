import { generateObject } from "ai";
import { chromeai } from "chrome-ai";
import _ from "lodash";
import { z } from "zod";
import { Category, Key } from "./constants";

const Trivia = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
  category: z.nativeEnum(Category),
  date: z.string(),
});

export type Trivia = z.infer<typeof Trivia>;

class LocalStorage<T> {
  constructor(
    private key: Key,
    private schema: z.ZodDefault<z.ZodType<T>>,
  ) {}

  get value() {
    const data = localStorage.getItem(this.key);
    return data
      ? this.schema.parse(JSON.parse(data))
      : (this.value = this.schema._def.defaultValue());
  }

  set value(value: T) {
    localStorage.setItem(this.key, JSON.stringify(value));
  }
}

const date = new Date().toLocaleDateString();

async function getTrivia(category: Category): Promise<Trivia> {
  const { object: trivia } = await generateObject({
    model: chromeai("text", { temperature: 0.8 }),
    frequencyPenalty: 1,
    schema: Trivia.pick({ question: true, answer: true }),
    prompt: `
      Generate a trivia question for the category: "${category}".
      Please respond with an object containing a "question" and "answer" property.
    `,
  });
  return { id: crypto.randomUUID(), date, category, ...trivia };
}

export async function getCards(count: number, interests: Category[]) {
  const deck = new LocalStorage(Key.DECK, Trivia.array().default([]));
  const categories = _.map(Array(count), () => _.sample(interests));
  const existingCards = deck.value.filter((card) => card.date === date);

  if (existingCards.length >= count) {
    return existingCards.slice(0, count);
  }

  return Array.fromAsync(categories, async (category) => {
    if (!category) {
      throw new Error("missing category");
    }
    let trivia = await getTrivia(category);
    while (
      deck.value.some(
        (card) =>
          _.isEqual(
            _.deburr(_.toLower(_.trim(card.answer))).replace(/[^a-z0-9]/g, ""),
            _.deburr(_.toLower(_.trim(trivia.answer))).replace(
              /[^a-z0-9]/g,
              "",
            ),
          ) && card.date === trivia.date,
      )
    ) {
      trivia = await getTrivia(category);
    }
    deck.value = deck.value.concat(trivia);
    return trivia;
  });
}
