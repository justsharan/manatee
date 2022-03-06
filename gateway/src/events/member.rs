use crate::Context;
use twilight_model::guild::Member;
use twilight_model::id::Id;

pub async fn guild_member_add(ctx: Context, member: Member) -> Result<(), sqlx::Error> {
  println!("Member joined: {}", member.user.id);

  if member.pending {
    return Ok(())
  }

  let guilds = sqlx::query!("SELECT autorole FROM guilds WHERE id = $1;", member.guild_id.get().to_string())
    .fetch_all(&ctx.pool)
    .await?;

  if guilds[0].autorole.is_some() {
    ctx.http.add_guild_member_role(
      member.guild_id,
      member.user.id,
      Id::new(guilds[0].autorole.clone().unwrap().parse::<u64>().unwrap())
    ).exec().await;
  }

  Ok(())
}
