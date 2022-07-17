use futures::StreamExt;
use sqlx::postgres::{ PgPool, PgPoolOptions };
use std::{ env, error::Error, sync::Arc };
use twilight_gateway::{ Intents, Shard };
use twilight_http::Client;
use twilight_cache_inmemory::InMemoryCache;

mod events;

type Context = Arc<ContextValue>;

pub struct ContextValue {
    cache: InMemoryCache,
    http: Client,
    pool: PgPool,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error + Send + Sync>> {
    let token = env::var("DISCORD_TOKEN")?;
    let intents = Intents::GUILDS | Intents::GUILD_MEMBERS | Intents::GUILD_MESSAGES;

    let (shard, mut events) = Shard::new(token.clone(), intents);
    let cache = InMemoryCache::new();
    let http = Client::new(token);
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&env::var("DATABASE_URL")?)
        .await?;

    shard.start().await?;
    println!("Started shard!");

    let ctx = Arc::new(ContextValue {
        cache,
        http,
        pool,
    });

    while let Some(event) = events.next().await {
        ctx.cache.update(&event);
        events::handle_events(Arc::clone(&ctx), event).await?
    }

    Ok(())
}
