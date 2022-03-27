import { CommandInteraction, Embed } from "discord-workers";

const formatDef = (def: string): string =>
  def.replace(/\[(.*?)\]/g, (term) => {
    const sliced = term.slice(1, -1);
    return `[${sliced}](https://www.urbandictionary.com/define.php?term=${encodeURIComponent(
      sliced
    )})`;
  });

export default async (
  int: CommandInteraction<{ term: string }>
): Promise<Response> => {
  const fetchURL = new URL("https://api.urbandictionary.com/v0/define");
  fetchURL.searchParams.set("term", int.options.term!);

  const res = await fetch(fetchURL.href);
  const body: any = await res.json();

  if (!body.list.length) {
    return int.send({
      content: "I couldn't find that term in Urban Dictionary.",
      flags: 64,
    });
  }

  const [entry] = body.list;
  return int.send(
    new Embed()
      .title(entry.word)
      .URL(entry.permalink)
      .author(entry.author)
      .description(formatDef(entry.definition))
      .footer(`👍 ${entry.thumbs_up} 👎 ${entry.thumbs_down}`)
      .timestamp(entry.written_on)
      .toMessage()
  );
};
