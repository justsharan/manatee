import { useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import Navbar from "../components/Navbar";
import GuildListItem from "../components/GuildListItem";

import styles from "./guilds.module.css";

export default function Guilds() {
  const { data } = useSession();
  const { t } = useTranslation("common");
  if (!data) return <>Loading</>;

  return (
    <>
      <Navbar />
      <header className={styles.hero}>
        <h1>{t("welcome")}</h1>
        <p>{t("welcome-subtitle")}</p>
      </header>
      <main className={styles.list}>
        {data.guilds.map((guild) => (
          <GuildListItem {...guild} />
        ))}
      </main>
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}
