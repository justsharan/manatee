# Manatee (WIP)

This is the codebase for a future, distributed version of Manatee, a bot serving over 900+ communities on Discord.

### What's wrong with the original?

The currently running version of the bot was designed all the way back in 2019, and uses what was the "classic" design at the time. Since then, Discord has seen a lot of changes such as the introduction of community servers, membership screening, slash commands, autocomplete, localization, etc, none of which the current bot utilizes.

### How is this different?

This repository is broken down into 3 parts:

#### Dashboard

This contains the new web dashboard for Manatee. The dashboard is built with React and Next.js, and allows you to log in with your Discord account and manage your preferences for the bot from a simple user interface, instead of finding your way through complicated config commands.

Here's some screenshots of the upcoming dashboard:

![Manatee's Web Dashboard](https://justsharan.xyz/i/naaxj.png)

#### Gateway

Low-level service written in Rust which listens to incoming gateway events and handles any logging (message logs, member logs, mod logs), autorole, and other opt-in features that require the bot to respond to gateway events.

I'm only slowly starting to work on this now, and my knowledge of rust is, uh, rusty ;)

#### Slash

Server-side API that handles Manatee's slash commands over HTTPS (as opposed to gateway). This is currently written in TypeScript and hosted on Vercel. However, I'm planning on porting this over to Cloudflare Workers as Vercel has a ~10 second limit on lambda run time, and it will not let the bot send additional follow-ups to interactions.
