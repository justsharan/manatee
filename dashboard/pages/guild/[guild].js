import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Hero from "../../components/Hero";

export default () => {
  const { guild } = useRouter().query;
  const { t } = useTranslation("settings");

  const { data } = useSession();
  if (!data) return <>Loading</>;

  const info = data.guilds.find((g) => g.id === guild);

  return (
    <>
      <Navbar />
      <Hero
        img={`https://cdn.discordapp.com/icons/${info.id}/${info.icon}.jpg?size=256`}
      >
        <p>{t("settings")}</p>
        <h1>{info.name}</h1>
      </Hero>
      <main></main>
      <Footer />
    </>
  );
};

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}
