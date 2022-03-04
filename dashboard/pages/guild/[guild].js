import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import Navbar from "../../components/Navbar";
import TitleCard from "../../components/TitleCard";

export default () => {
  const { guild } = useRouter().query;
  const { t } = useTranslation("settings");

  const { data } = useSession();
  if (!data) return <>Loading</>;

  const info = data.guilds.find((g) => g.id === guild);

  return (
    <>
      <Navbar />
      <TitleCard
        img={`https://cdn.discordapp.com/icons/${info.id}/${info.icon}.jpg?size=256`}
        subtitle={t("settings")}
        title={info.name}
      />
      <main></main>
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
