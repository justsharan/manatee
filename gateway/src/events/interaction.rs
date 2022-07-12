use crate::Context;
use twilight_model::application::interaction::{
  Interaction,
};

pub async fn interaction_create(ctx: Context, payload: Interaction) -> Result<(), sqlx::Error> {
  match payload {
    Interaction::ApplicationCommand(cmd) => {
      let int_client = ctx.http.interaction(cmd.application_id);
      crate::commands::handle_command(int_client, *cmd).await;
    },
    _ => {
      println!("Unhandled interaction");
    },
  };
  Ok(())
}
