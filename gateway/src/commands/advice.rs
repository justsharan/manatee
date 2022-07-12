use serde::{ Deserialize, Serialize };
use std::error::Error;
use twilight_http::client::InteractionClient;
use twilight_model::{
  application::interaction::ApplicationCommand,
  http::interaction::{
    InteractionResponse,
    InteractionResponseType,
    InteractionResponseData
  }
};

#[derive(Deserialize, Serialize)]
struct Advice {
  pub slip: Slip,
}

#[derive(Deserialize, Serialize)]
struct Slip {
  id: i16,
  advice: String,
}

#[allow(unused_must_use)]
pub async fn execute(ctx: InteractionClient<'_>, int: ApplicationCommand) -> Result<(), Box<dyn Error>> {
  // Get advice from API
  let resp: Advice = reqwest::get("https://api.adviceslip.com/advice")
    .await?
    .json()
    .await?;

  // Respond with advice
  ctx.create_response(
    int.id,
    int.token.as_str(),
    &InteractionResponse{
      kind: InteractionResponseType::ChannelMessageWithSource,
      data: Some(InteractionResponseData {
        allowed_mentions: None,
        attachments: None,
        custom_id: None,
        choices: None,
        components: None,
        content: Some(resp.slip.advice),
        embeds: None,
        flags: None,
        title: None,
        tts: None,
      })
    }
  ).exec().await;

  Ok(())
}
