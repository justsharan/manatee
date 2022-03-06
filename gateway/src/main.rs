use futures::StreamExt;
use sqlx::postgres::{ PgPool, PgPoolOptions };
use std::{ env, error::Error, sync::Arc };
use twilight_gateway::{ Intents, Shard };

mod events;

type Context = Arc<ContextValue>;

pub struct ContextValue {
    pool: PgPool,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error + Send + Sync>> {
    let token = env::var("DISCORD_TOKEN")?;
    let (shard, mut events) = Shard::new(token, Intents::GUILDS | Intents::GUILD_MESSAGES);
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&env::var("DATABASE_URL")?)
        .await?;

    shard.start().await?;
    println!("Started shard!");

    let ctx = Arc::new(ContextValue {
        pool,
    });

    while let Some(event) = events.next().await {
        events::handle_events(Arc::clone(&ctx), event);
    }

    Ok(())
}
