use crate::Context;
use twilight_gateway::Event;

mod guild;
mod interaction;
mod member;

pub async fn handle_events(ctx: Context, event: Event) -> Result<(), sqlx::Error> {
  match event {
    Event::GuildCreate(guild_create) => guild::guild_create(ctx, guild_create.0).await,
    Event::GuildDelete(guild_delete) => guild::guild_delete(ctx, guild_delete).await,
    Event::MemberAdd(member_add) => member::guild_member_add(ctx, member_add.0).await,
    Event::MemberRemove(member_remove) => member::guild_member_remove(ctx, member_remove).await,
    Event::InteractionCreate(interaction_create) => interaction::interaction_create(ctx, interaction_create.0).await,
    _ => {
      println!("Unhandled event: {}", event.kind().name().unwrap_or("UNKNOWN"));
      Ok(())
    },
  }
}
