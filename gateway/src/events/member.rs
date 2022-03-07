use crate::Context;
use twilight_model::{
  guild::Member,
  id::Id
};

pub async fn guild_member_add(ctx: Context, member: Member) -> Result<(), sqlx::Error> {
  println!("Member joined: {}", member.user.id);

  let guilds = sqlx::query!("SELECT autorole, member_log FROM guilds WHERE id = $1;", member.guild_id.get().to_string())
    .fetch_all(&ctx.pool)
    .await?;

  // Send member log if enabled
  if guilds[0].member_log.is_some() {
    ctx.http.create_message(Id::new(guilds[0].member_log.as_ref().unwrap().parse::<u64>().unwrap()))
      .content(
        &format!(
          "📥 **{}#{}** ({}) has joined the server.\nAccount created: <t:{}>",
          member.user.name,
          member.user.discriminator().to_string(),
          member.user.id.get().to_string(),
          ((member.user.id.get() >> 22) + 1420070400000) / 1000
        )
      ).unwrap().exec().await.unwrap();
  }

  // Check if member is pending before assigning autorole
  if member.pending {
    return Ok(())
  }

  // Add autorole if enabled
  if guilds[0].autorole.is_some() {
    ctx.http.add_guild_member_role(
      member.guild_id,
      member.user.id,
      Id::new(guilds[0].autorole.as_ref().unwrap().parse::<u64>().unwrap())
    ).exec().await.unwrap();
  }

  Ok(())
}
