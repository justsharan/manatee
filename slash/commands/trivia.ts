import { ActionRow, Button, CommandInteraction, Embed } from "discord-workers";

export default async (int: CommandInteraction): Promise<Response> => {
  const fetchURL = new URL("https://opentdb.com/api.php");
  fetchURL.searchParams.set("amount", "1");
  fetchURL.searchParams.set("encode", "url3986");
  if (int.options.category)
    fetchURL.searchParams.set("category", int.options.category);
  if (int.options.difficulty)
    fetchURL.searchParams.set("difficulty", int.options.difficulty);

  const res = await fetch(fetchURL.href);
  const body: any = await res.json();

  const [question] = body.results;
  const options = new ActionRow();

  [question.correct_answer, ...question.incorrect_answers]
    .sort(() => Math.random() - 0.5)
    .forEach((choice, i) =>
      options.component(
        new Button()
          .style(2)
          .customID(choice === question.correct_answer ? "correct" : String(i))
          .label(decodeURIComponent(choice))
      )
    );

  return int.send({
    content: question.question,
    components: [options.toJSON()],
  });
};
