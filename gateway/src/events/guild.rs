use crate::Context;
use twilight_model::guild::Guild;
use twilight_model::gateway::payload::incoming::GuildDelete;

pub async fn guild_create(ctx: Context, payload: Guild) -> Result<(), sqlx::Error> {
  println!("Guild Create: {}", payload.id);
  sqlx::query!("INSERT INTO guilds (id) VALUES ($1) ON CONFLICT DO NOTHING;", payload.id.get().to_string())
    .execute(&ctx.pool)
    .await?;
  Ok(())
}

pub async fn guild_delete(ctx: Context, payload: GuildDelete) -> Result<(), sqlx::Error> {
  println!("Guild Delete: {}", payload.id);
  sqlx::query!("DELETE FROM guilds WHERE id = $1;", payload.id.get().to_string())
    .execute(&ctx.pool)
    .await?;
  Ok(())
}
