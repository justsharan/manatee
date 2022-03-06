use crate::Context;
use twilight_gateway::Event;

mod guild;

pub fn handle_events(ctx: Context, event: Event) {
  match event {
    Event::GuildCreate(guild_create) => guild::guild_create(ctx, guild_create.0),
    _ => println!("Unhandled event: {}", event.kind().name().unwrap_or("UNKNOWN")),
  }
}
