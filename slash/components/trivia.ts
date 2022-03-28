import { ButtonStyle } from "discord-api-types/v10";
import { ActionRow, Button, Interaction } from "discord-workers";

export default async (
  int: Interaction,
  wait: (f: any) => void
): Promise<Response | void> => {
  console.log(JSON.stringify(int));
  if (int.message?.interaction?.name === "trivia") {
    const options = new ActionRow();
    for (const choice of int.message.components![0].components as any[]) {
      options.component(
        new Button()
          .customID(choice.custom_id)
          .label(choice.label)
          .disabled()
          .style(
            (int.data as any).custom_id === "correct"
              ? choice.custom_id === "correct"
                ? ButtonStyle.Success
                : ButtonStyle.Secondary
              : (int.data as any).custom_id === choice.custom_id
              ? ButtonStyle.Danger
              : choice.custom_id === "correct"
              ? ButtonStyle.Success
              : ButtonStyle.Secondary
          )
      );
    }

    wait(
      int.edit({
        content: int.message?.content,
        components: [options.toJSON()],
      })
    );

    return int.respond(6, {});
  }
};
