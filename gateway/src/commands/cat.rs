use serde::{ Deserialize, Serialize };
use std::error::Error;
use twilight_http::client::InteractionClient;
use twilight_model::{
  application::interaction::ApplicationCommand,
  http::interaction::{
    InteractionResponse,
    InteractionResponseType,
    InteractionResponseData
  },
};

#[derive(Serialize, Deserialize)]
struct CatInfo {
  pub breeds: Vec<String>,
  pub id: String,
  pub url: String,
  pub width: i8,
  pub height: i8,
}

#[allow(unused_must_use)]
pub async fn execute(ctx: InteractionClient<'_>, int: ApplicationCommand) -> Result<(), Box<dyn Error>> {
  // Get cat URL from API
  let resp: Vec<CatInfo> = reqwest::get("https://api.thecatapi.com/v1/images/search")
    .await?
    .json()
    .await?;

  // Send cat URL as response
  ctx.create_response(
    int.id,
    int.token.as_str(),
    &InteractionResponse {
      kind: InteractionResponseType::ChannelMessageWithSource,
      data: Some(InteractionResponseData {
        allowed_mentions: None,
        attachments: None,
        custom_id: None,
        choices: None,
        components: None,
        content: Some(resp[0].url.clone()),
        embeds: None,
        flags: None,
        title: None,
        tts: None,
      }),
  });

  Ok(())
}
