import {
  ButtonStyle,
  CommandContext,
  CommandOptionType,
  ComponentType,
  SlashCommand,
  SlashCreator,
} from "slash-create";
import fetch from "node-fetch";

interface TriviaQuestion {
  category: string;
  type: "multiple" | "boolean";
  difficulty: "easy" | "medium" | "hard";
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export default class extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: "trivia",
      description: "See how good you are at trivia!",
      options: [
        {
          name: "category",
          description: "The category that you'd like questions from.",
          type: CommandOptionType.STRING,
          choices: [
            { name: "General Knowledge", value: "9" },
            { name: "Entertainment", value: "10" },
            { name: "Science & Nature", value: "17" },
            { name: "Science: Computers", value: "18" },
            { name: "Science: Mathematics", value: "19" },
            { name: "Mythology", value: "20" },
            { name: "Sports", value: "21" },
            { name: "Geography", value: "22" },
            { name: "History", value: "23" },
            { name: "Politics", value: "24" },
            { name: "Art", value: "25" },
            { name: "Celebrities", value: "26" },
            { name: "Animals", value: "27" },
            { name: "Vehicles", value: "28" },
            { name: "Science: Gadgets", value: "30" },
            { name: "Anime and Manga", value: "31" },
          ],
        },
        {
          name: "difficulty",
          description: "How hard you'd like the questions to be",
          type: CommandOptionType.STRING,
          choices: [
            { name: "Easy", value: "easy" },
            { name: "Medium", value: "medium" },
            { name: "Hard", value: "hard" },
          ],
        },
      ],
    });
  }

  async run(ctx: CommandContext) {
    // Create querystring params for request
    const params = new URLSearchParams({ amount: "1", encode: "url3986" });
    if (ctx.options.category) params.set("category", ctx.options.category);
    if (ctx.options.difficulty)
      params.set("difficulty", ctx.options.difficulty);

    console.log(`https://opentdb.com/api.php?${params.toString()}`);

    // Retrieve question from database
    const response = await fetch(
      `https://opentdb.com/api.php?${params.toString()}`
    );
    const body = (await response.json()) as { results: [TriviaQuestion] };
    console.log([
      {
        type: ComponentType.ACTION_ROW,
        components: [
          body.results[0].correct_answer,
          ...body.results[0].incorrect_answers,
        ]
          // Randomize order
          .sort(() => Math.random() - 0.5)
          // Create button for answer choice
          .map((choice: string) => ({
            type: ComponentType.BUTTON,
            style: ButtonStyle.PRIMARY,
            custom_id: String(choice === body.results[0].correct_answer),
            label: decodeURIComponent(choice),
          })),
      },
    ]);

    // Send question to user
    return ctx.send(decodeURIComponent(body.results[0].question), {
      components: [
        {
          type: ComponentType.ACTION_ROW,
          components: [
            body.results[0].correct_answer,
            ...body.results[0].incorrect_answers,
          ]
            // Randomize order
            .sort(() => Math.random() - 0.5)
            // Create button for answer choice
            .map((choice: string) => ({
              type: ComponentType.BUTTON,
              style: ButtonStyle.PRIMARY,
              custom_id: String(choice === body.results[0].correct_answer),
              label: decodeURIComponent(choice),
            })),
        },
      ],
    });
  }
}
