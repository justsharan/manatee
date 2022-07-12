use twilight_http::client::InteractionClient;
use twilight_model::application::interaction::MessageComponentInteraction;

mod cat_reload;

pub async fn handle_components(ctx: InteractionClient<'_>, int: MessageComponentInteraction) {
  if int.data.custom_id.as_str() == "cat_reload" {
    cat_reload::execute(ctx, int).await.unwrap()
  }
}
