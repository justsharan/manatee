import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import Hero from "components/Hero";
import Layout from "components/Layout";

export default () => {
  const { guild } = useRouter().query;
  const { t } = useTranslation("settings");

  const { data } = useSession();
  console.log(data);
  if (!data) return <>Loading...</>;

  const { id, icon, name } = (data.guilds as any[]).find(
    ({ id }) => id === guild
  );

  return (
    <Layout>
      <Hero img={`https://cdn.discordapp.com/icons/${id}/${icon}.jpg?size=256`}>
        <p>{t("settings")}</p>
        <h1>{name}</h1>
      </Hero>
    </Layout>
  );
};

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}
