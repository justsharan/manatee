use crate::Context;
use twilight_model::guild::Guild;

pub fn guild_create(_: Context, payload: Guild) {
  println!("Joined guild: {}", payload.id);
}