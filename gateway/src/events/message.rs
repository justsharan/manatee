use std::time::SystemTime;

use crate::Context;
use twilight_model::{
  gateway::payload::incoming::MessageDelete,
  id::Id,
};

pub async fn message_delete(ctx: Context, payload: MessageDelete) -> Result<(), sqlx::Error> {  
  let guild_id = payload.guild_id.unwrap().to_string();

  // Get database entry
  let guilds = sqlx::query!("SELECT message_log FROM guilds WHERE id = $1;", guild_id)
    .fetch_all(&ctx.pool)
    .await?;
  
  // Send message log if enabled
  if guilds[0].message_log.is_some() {
    let content = match ctx.cache.message(payload.id) {
      Some(val) => format!(
        "❌ **{}**'s message in <#{}> was deleted.\n>{}\nDeleted at:<t:{}>",
        match ctx.cache.user(val.author()) {
          Some(usr) => format!("{}#{}", usr.name, usr.discriminator),
          None => val.author().to_string(),
        },
        payload.channel_id,
        val.content(),
        SystemTime::now()
          .duration_since(SystemTime::UNIX_EPOCH)
          .unwrap()
          .as_secs()
      ),
      None => format!("❌ {} was deleted in <#{}>.", payload.id, payload.channel_id),
    };

    let res = ctx.http.create_message(Id::new(guilds[0].message_log.as_ref().unwrap().parse::<u64>().unwrap()))
      .content(content.as_str()).unwrap().exec().await;
    // Remove message_log from entry if unable to send messages to it
    if !res.is_ok() {
      sqlx::query!("UPDATE guilds SET message_log = NULL where id = $1;", guild_id)
        .fetch(&ctx.pool);
    }
  }

  Ok(())
}
