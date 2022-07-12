use twilight_model::application::interaction::ApplicationCommand;
use twilight_http::client::InteractionClient;

mod cat;

pub use cat::get_cat;

pub async fn handle_command(ctx: InteractionClient<'_>, int: ApplicationCommand) {
  match int.data.name.as_str() {
    "cat" => cat::execute(ctx, int).await.unwrap(),
    _ => println!("Unrecognized command"),
  };
}
