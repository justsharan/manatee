use crate::Context;
use twilight_gateway::Event;

mod guild;

pub async fn handle_events(ctx: Context, event: Event) -> Result<(), sqlx::Error> {
  match event {
    Event::GuildCreate(guild_create) => guild::guild_create(ctx, guild_create.0).await,
    Event::GuildDelete(guild_delete) => guild::guild_delete(ctx, *guild_delete).await,
    _ => {
      println!("Unhandled event: {}", event.kind().name().unwrap_or("UNKNOWN"));
      Ok(())
    },
  }
}
