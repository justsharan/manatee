import { GetStaticPropsContext } from "next";
import Image from "next/image";
import Link from "next/link";
import Layout from "components/Layout";
import styles from "./index.module.css";
import Hero from "components/Hero";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { iconURL, truncateName } from "utils/guild";
import Spinner from "components/Spinner";
import { Guild } from "types/discord";

export interface UserGuild {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: string;
  features: string[];
}

export default function Guilds() {
  const t = useTranslations("Guilds");
  const { locale, ...router } = useRouter();
  const { status } = useSession();

  if (status === "unauthenticated") {
    router.push("/");
  }

  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [botGuilds, setBotGuilds] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      // Get guilds from localStorage or set it
      let localInfo = localStorage.getItem("guilds");
      if (!localInfo) {
        const res = await fetch("/api/guilds/user");
        const body = await res.text();
        localStorage.setItem("guilds", body);
      }

      setGuilds(JSON.parse(localStorage.getItem("guilds")));

      // Get guilds that the bot is in
      const botGuilds = await fetch(
        `/api/guilds/check?guilds=${guilds.map((g) => g.id).join(",")}`
      );
      setBotGuilds(await botGuilds.json());
    })();
  }, []);

  // Show spinner if data isn't ready yet
  if (!guilds || !botGuilds) {
    return (
      <Layout title="Servers">
        <Spinner />
      </Layout>
    );
  }
  console.log({ guilds, botGuilds });

  // Render Guild picker page
  return (
    <Layout title="Servers">
      <Hero title={t("title")} subtitle={t("subtitle")} color />
      <div className={styles.list}>
        {guilds
          .filter((g) => Number(g.permissions) & (1 << 5))
          .map((guild) => (
            <Link
              href={
                botGuilds.includes(guild.id)
                  ? `/guilds/${guild.id}`
                  : `/invite?guild_id=${guild.id}`
              }
              locale={locale}
              key={guild.id}
            >
              <div>
                {botGuilds.includes(guild.id) && (
                  <Image src={iconURL(guild)} width={75} height={75} />
                )}
                {!botGuilds.includes(guild.id) && (
                  <Image
                    src={iconURL(guild)}
                    width={75}
                    height={75}
                    className={styles.grayscale}
                  />
                )}
                <p>{truncateName(guild.name)}</p>
              </div>
            </Link>
          ))}
      </div>
    </Layout>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`public/locales/${locale}.json`)).default,
    },
  };
}
