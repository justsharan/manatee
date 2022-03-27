import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Hero from "components/Hero";
import Layout from "components/Layout";
import GuildListItem from "components/GuildListItem";

import styles from "./guilds.module.css";

export default () => {
  const { data } = useSession();
  const { t } = useTranslation("common");
  if (!data) return <Layout>Loading</Layout>;

  return (
    <Layout>
      <Hero manatee>
        <h1>{t("welcome")}</h1>
        <p>{t("welcome-subtitle")}</p>
      </Hero>
      <div className={styles.list}>
        {(data.guilds as any[])
          .filter((g) => Number(g.permissions) & (1 << 5))
          .map((g) => (
            <GuildListItem key={g.id} {...g} />
          ))}
      </div>
    </Layout>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}
