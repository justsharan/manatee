import Layout from "components/Layout";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { UserGuild } from ".";
import Hero from "components/Hero";
import { useTranslations } from "next-intl";
import styles from "./[id].module.css";
import { useEffect, useState } from "react";
import Spinner from "components/Spinner";
import { Guild } from "types/discord";
import { iconURL, truncateName } from "utils/guild";

export default function GuildSettings() {
  const t = useTranslations("Guild");
  const router = useRouter();

  const [guild, setGuild] = useState<Guild>();
  const [settings, setSettings] = useState();

  useEffect(() => {
    (async () => {
      // Find guild info in localStorage
      const localInfo: Guild[] = JSON.parse(localStorage.getItem("guilds"));
      const guild = localInfo.find((g) => g.id === router.query.id);
      setGuild(guild);

      // Get guild settings from database
      const res = await fetch(`/api/guilds/${guild.id}`);
      setSettings(await res.json());
    })();
  }, []);

  // Show spinner if guild info hasn't loaded yet
  if (!guild || !settings) {
    return (
      <Layout title={router.query.id as string}>
        <Spinner />
      </Layout>
    );
  }

  // Render guild settings page
  return (
    <Layout title={guild.name}>
      <div className={styles.header}>
        <img src={iconURL(guild)} />
        <Hero
          title={truncateName(guild.name)}
          subtitle={t("subtitle")}
          reversed
        />
      </div>
      <section>
        {Object.keys(settings).map((s, i) => (
          <p key={i}>{s}</p>
        ))}
      </section>
    </Layout>
  );
}

// Load translations
export async function getServerSideProps({
  locale,
}: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`public/locales/${locale}.json`)).default,
    },
  };
}
