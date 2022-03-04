import { useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GuildListItem from "../components/GuildListItem";
import Hero from "../components/Hero";

import styles from "./guilds.module.css";

export default function Guilds() {
  const { data } = useSession();
  const { t } = useTranslation("common");
  if (!data) return <>Loading</>;

  return (
    <>
      <Navbar />
      <Hero manatee>
        <h1>{t("welcome")}</h1>
        <p>{t("welcome-subtitle")}</p>
      </Hero>
      <main className={styles.list}>
        {data.guilds.map((guild) => (
          <GuildListItem {...guild} />
        ))}
      </main>
      <Footer />
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
