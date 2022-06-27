import Image from "next/image";
import Layout from "components/Layout";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { UserGuild } from ".";
import Hero from "components/Hero";
import { useTranslations } from "next-intl";
import styles from "./[id].module.css";

export default function Guild(props: { guilds: UserGuild[] }) {
  const t = useTranslations("Guild");
  const { query } = useRouter();
  const guild = props.guilds.find((g) => g.id === query.id);

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
