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

export default function Guild({ guild, data }: GuildProps) {
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
            .map(([k, v]) => (
              <div key={k} className={styles.field}>
                <label htmlFor={k}>{normalizeFieldName(k)}</label>
                <input name={k} defaultValue={v} />
              </div>
            ))}
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

  return {
    props: {
      guild,
      data: await guildData.json(),
    },
  };
}
