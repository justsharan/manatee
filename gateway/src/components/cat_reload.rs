use std::error::Error;
use twilight_http::client::InteractionClient;
use twilight_model::{
  application::{
    component::{ ActionRow, Button, button::ButtonStyle, Component },
    interaction::MessageComponentInteraction,
  },
  channel::ReactionType,
  http::{
    attachment::Attachment,
    interaction::{
      InteractionResponse,
      InteractionResponseType,
      InteractionResponseData,
    },
  },
};

#[allow(unused_must_use)]
pub async fn execute(ctx: InteractionClient<'_>, int: MessageComponentInteraction) -> Result<(), Box<dyn Error>> {
  // Get cat image
  let img = crate::commands::get_cat().await?;

  // Update message with new cat image
  ctx.create_response(
    int.id,
    int.token.as_str(),
    &InteractionResponse {
      kind: InteractionResponseType::UpdateMessage,
      data: Some(InteractionResponseData {
        allowed_mentions: None,
          attachments: Some(vec![
            Attachment::from_bytes("cat.jpg".to_string(), img, 1),
          ]),
          custom_id: None,
          choices: None,
          components: Some(vec![
            Component::ActionRow(ActionRow{
              components: vec![
                Component::Button(Button{
                  custom_id: Some(String::from("cat_reload")),
                  disabled: false,
                  emoji: Some(ReactionType::Unicode{ name: String::from("🐱") }),
                  label: Some(String::from("New Cat!")),
                  style: ButtonStyle::Secondary,
                  url: None,
                }),
              ]
            }),
          ]),
          content: None,
          embeds: None,
          flags: None,
          title: None,
          tts: None,
      }),
    }
  ).exec().await;
  
  Ok(())
}
