import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import Image from "next/image";
import Hero from "components/Hero";
import Layout from "components/Layout";
import styles from "./[id].module.css";

type Nullable<T> = T | null;

interface Guild {
  id: string;
  name: string;
  icon: Nullable<string>;
  owner: boolean;
  permissions: string;
  features: string[];
}

interface GuildData {
  id: string;
  autorole: Nullable<string>;
  mod_log: Nullable<string>;
  member_log: Nullable<string>;
  message_log: Nullable<string>;
}

type GuildProps = { guild: Guild; data: GuildData };

const normalizeFieldName = (name: string) =>
  name
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");

export default function Guild({
  guild,
  data,
  channels,
  roles,
}: GuildProps & any) {
  return (
    <Layout>
      <div className={styles.header}>
        <Image
          src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.jpg?size=256`}
          width="64"
          height="64"
          className="round"
        />
        <Hero>
          <p>Settings for</p>
          <h1>{guild.name}</h1>
        </Hero>
      </div>
      <section>
        <form
          className={styles.form}
          onSubmit={(evt: any) => {
            evt.preventDefault();
            const { elements: el } = evt.target;
            fetch(`${window.location.origin}/api/guild/${guild.id}`, {
              method: "POST",
              body: JSON.stringify(
                ["autorole", "member_log", "mod_log", "message_log"].reduce(
                  (acc, curr) => ({
                    ...acc,
                    [curr]: el.namedItem(curr).value || "NULL",
                  }),
                  {}
                )
              ),
            });
          }}
        >
          {Object.entries(data)
            .filter(([k]) => k !== "id")
            .map(([k, v]) =>
              k === "autorole" ? (
                <div key={k} className={styles.field}>
                  <label htmlFor={k}>{normalizeFieldName(k)}</label>
                  <select name={k} id={k}>
                    {roles.map((e) => (
                      <option value={e.id}>{e.name}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div key={k} className={styles.field}>
                  <label htmlFor={k}>{normalizeFieldName(k)}</label>
                  <select name={k} id={k}>
                    {channels.map((e) => (
                      <option value={e.id}>{e.name}</option>
                    ))}
                  </select>
                </div>
              )
            )}
          <button
            type="submit"
            className="manatee"
            style={{ flexBasis: "100%", width: "5em" }}
          >
            Save
          </button>
        </form>
      </section>
    </Layout>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session: any = await getSession(ctx);
  if (!session) return { notFound: true };

  const guild = session.guilds.find((g) => g.id === ctx.query.id);
  if (!guild) return { notFound: true };

  const guildData = await fetch(
    `${process.env.BASE_URL}/api/guild/${guild.id}`
  );
  if (!guildData.ok) {
    ctx.res.setHeader(
      "location",
      `https://discord.com/oauth2/authorize?client_id=643103079679393792&permissions=164752486&scope=applications.commands%20bot&guild_id=${guild.id}`
    );
    ctx.res.statusCode = 301;
    ctx.res.end();
    return {};
  }

  const channels = await fetch(
    `https://discord.com/api/v10/guilds/${guild.id}/channels`,
    {
      headers: {
        Authorization: `Bot ${process.env.BOT_TOKEN}`,
      },
    }
  );
  if (!channels.ok) {
    console.error(await channels.text());
    return { notFound: true };
  }

  const roles = await fetch(
    `https://discord.com/api/v10/guilds/${guild.id}/roles`,
    {
      headers: {
        Authorization: `Bot ${process.env.BOT_TOKEN}`,
      },
    }
  );
  if (!roles.ok) {
    console.error(await roles.text());
    return { notFound: true };
  }

  return {
    props: {
      guild,
      data: await guildData.json(),
      channels,
      roles,
    },
  };
}
