import {
  ButtonStyle,
  CommandContext,
  CommandOptionType,
  ComponentActionRow,
  ComponentButton,
  ComponentContext,
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

    creator.registerGlobalComponent("true", (interact) => {
      // Retrieve list of previous buttons
      const previousButtons = (
        interact.message.components as ComponentActionRow[]
      )[0].components as ComponentButton[];
      // Edit the button colors in the parent message
      interact.editParent({
        components: [
          {
            type: ComponentType.ACTION_ROW,
            components: previousButtons.map((b) => ({
              ...b,
              // Disable all answers
              disabled: true,
              // Correct answer is green, others are normal
              style:
                b.custom_id === "true"
                  ? ButtonStyle.SUCCESS
                  : ButtonStyle.SECONDARY,
            })),
          },
        ],
      });
    });

    const falseResponse = (interact: ComponentContext): void => {
      // Retrieve list of previous buttons
      const previousButtons = (
        interact.message.components as ComponentActionRow[]
      )[0].components as ComponentButton[];
      // Edit the button colors in the parent message
      interact.editParent({
        components: [
          {
            type: ComponentType.ACTION_ROW,
            components: previousButtons.map((b) => ({
              ...b,
              // Disable all answers
              disabled: true,
              // Chosen incorrect answer is red
              // Correct answer is green
              // Other answers are normal
              style:
                b.custom_id === interact.customID
                  ? ButtonStyle.DESTRUCTIVE
                  : b.custom_id === "correct"
                  ? ButtonStyle.SUCCESS
                  : ButtonStyle.SECONDARY,
            })),
          },
        ],
      });
    };

    creator.registerGlobalComponent("0", falseResponse);
    creator.registerGlobalComponent("1", falseResponse);
    creator.registerGlobalComponent("2", falseResponse);
    creator.registerGlobalComponent("3", falseResponse);
  }

  async run(ctx: CommandContext) {
    // Create querystring params for request
    const params = new URLSearchParams({ amount: "1", encode: "url3986" });
    if (ctx.options.category) params.set("category", ctx.options.category);
    if (ctx.options.difficulty)
      params.set("difficulty", ctx.options.difficulty);

    // Retrieve question from database
    const response = await fetch(
      `https://opentdb.com/api.php?${params.toString()}`
    );
    const body: { results: [TriviaQuestion] } = await response.json();

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
            .map((choice: string, i: number) => ({
              type: ComponentType.BUTTON,
              style: ButtonStyle.SECONDARY,
              custom_id:
                choice === body.results[0].correct_answer
                  ? "correct"
                  : String(i),
              label: decodeURIComponent(choice),
            })),
        },
      ],
    });
  }
}
