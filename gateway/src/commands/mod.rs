use twilight_http::client::InteractionClient;
use twilight_model::application::interaction::ApplicationCommand;

mod cat;

pub async fn handle_command(int_client: InteractionClient<'_>, int: ApplicationCommand) {
  match int.data.name.as_str() {
    "cat" => cat::execute(int_client, int).await.unwrap(),
    _ => println!("Unknown command")
  }
}
