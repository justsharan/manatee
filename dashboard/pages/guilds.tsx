import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Hero from "components/Hero";
import Layout from "components/Layout";

import GuildListItem from "components/GuildListItem";

export default () => {
  const { data } = useSession();
  const { t } = useTranslation("common");
  if (!data) return <Layout>Loading</Layout>;

  return (
    <Layout>
      <style jsx>{`
        .list {
          display: flex;
          flex-direction: row;
          gap: 3em;
          flex-wrap: wrap;
          justify-content: center;
          margin: 2em auto;
        }

        @media only screen and (max-width: 600px) {
          .list {
            display: flex;
            flex-direction: column;
            gap: 3em;
            align-items: center;
          }
        }
      `}</style>
      <Hero manatee>
        <h1>{t("welcome")}</h1>
        <p>{t("welcome-subtitle")}</p>
      </Hero>
      <div className="list">
        {(data.guilds as any[]).map((g) => (
          <GuildListItem {...g} />
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
