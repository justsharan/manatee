import Layout from "components/Layout";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { UserGuild } from ".";
import Hero from "components/Hero";
import { useTranslations } from "next-intl";
import styles from "./[id].module.css";
import { useEffect, useState } from "react";

export default function Guild(props: { guilds: UserGuild[] }) {
  const t = useTranslations("Guild");
  const { query } = useRouter();
  const guild = props.guilds.find((g) => g.id === query.id);

  const [settings, setSettings] = useState({});

  const fetchSettings = async () => {
    const res = await fetch(`/api/guilds/${guild.id}`);
    const body = await res.json();
    setSettings(body);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <Layout title={guild.name}>
      <div className={styles.header}>
        <img
          src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=256`}
        />
        <Hero
          title={
            guild.name.length > 25
              ? guild.name.slice(0, 20) + "..."
              : guild.name
          }
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

export async function getServerSideProps({
  locale,
}: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`public/locales/${locale}.json`)).default,
      guilds: (await import("testdata.json")).default,
    },
  };
}
