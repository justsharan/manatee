use crate::Context;
use twilight_model::{
  gateway::payload::incoming::MemberRemove,
  guild::Member,
  id::Id,
};

pub async fn guild_member_add(ctx: Context, member: Member) -> Result<(), sqlx::Error> {
  let guild_id = member.guild_id.get().to_string();

  // Get database entry
  let guilds = sqlx::query!("SELECT autorole, member_log FROM guilds WHERE id = $1;", guild_id)
    .fetch_all(&ctx.pool)
    .await?;

  // Send member log if enabled
  if guilds[0].member_log.is_some() {
    let res = ctx.http.create_message(Id::new(guilds[0].member_log.as_ref().unwrap().parse::<u64>().unwrap()))
      .content(
        &format!(
          "📥 **{}#{}** ({}) has joined the server.\nAccount created: <t:{}>",
          member.user.name,
          member.user.discriminator().to_string(),
          member.user.id.get().to_string(),
          ((member.user.id.get() >> 22) + 1420070400000) / 1000
        )
      ).unwrap().exec().await;
    // Remove member_log from entry if unable to send messages to it
    if !res.is_ok() {
      sqlx::query!("UPDATE guilds SET member_log = NULL WHERE id = $1;", guild_id)
        .fetch(&ctx.pool);
    }
  }

  // Check if member is pending before assigning autorole
  if member.pending {
    return Ok(())
  }

  // Add autorole if enabled
  if guilds[0].autorole.is_some() {
    let res = ctx.http.add_guild_member_role(
      member.guild_id,
      member.user.id,
      Id::new(guilds[0].autorole.as_ref().unwrap().parse::<u64>().unwrap())
    ).exec().await;
    if !res.is_ok() {
     // Remove autorole from entry if unable to send messages to it
      if !res.is_ok() {
        sqlx::query!("UPDATE guilds SET autorole = NULL WHERE id = $1;", guild_id)
          .fetch(&ctx.pool);
      }
    }
  }

  Ok(())
}

pub async fn guild_member_remove(ctx: Context, payload: MemberRemove) -> Result<(), sqlx::Error> {
  let guild_id = payload.guild_id.get().to_string();

  // Get database entry
  let guilds = sqlx::query!("SELECT member_log FROM guilds WHERE id = $1;", guild_id)
    .fetch_all(&ctx.pool)
    .await?;

  // Send member log if enabled
  if guilds[0].member_log.is_some() {
    let content = match ctx.cache.member(payload.guild_id, payload.user.id) {
      Some(val) => format!(
        "📤 **{}#{}** ({}) has left the server.\nJoined: <t:{}>",
        payload.user.name,
        payload.user.discriminator().to_string(),
        payload.user.id.get().to_string(),
        val.joined_at().as_secs()
      ),
      None => format!(
        "📤 **{}#{}** ({}) has left the server.\nAccount created: <t:{}>",
        payload.user.name,
        payload.user.discriminator().to_string(),
        payload.user.id.get().to_string(),
        ((payload.user.id.get() >> 22) + 1420070400000) / 1000
      )
    };

    let res = ctx.http.create_message(Id::new(guilds[0].member_log.as_ref().unwrap().parse::<u64>().unwrap()))
      .content(content.as_str()).unwrap().exec().await;
    // Remove member_log from entry if unable to send messages to it
    if !res.is_ok() {
      sqlx::query!("UPDATE guilds SET member_log = NULL WHERE id = $1;", guild_id)
        .fetch(&ctx.pool);
    }
  }

  Ok(())
}
