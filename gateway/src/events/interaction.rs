use crate::Context;
use twilight_model::application::interaction::{
  Interaction,
};

pub async fn interaction_create(ctx: Context, payload: Interaction) -> Result<(), sqlx::Error> {
  let int_client = ctx.http.interaction(payload.application_id());
  match payload {
    Interaction::ApplicationCommand(cmd) => crate::commands::handle_command(int_client, *cmd).await,
    Interaction::MessageComponent(component) => crate::components::handle_components(int_client, *component).await,
    _ => {
      println!("Unhandled interaction");
    },
  };
  Ok(())
}
