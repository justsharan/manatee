import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Layout from "components/Layout";

export default () => {
  const { t } = useTranslation("common");
  return (
    <Layout>
      <style jsx>{`
        section {
          text-align: center;
          height: 70vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        h1,
        p {
          margin: 5px auto;
        }

        h1 {
          color: var(--manatee);
          font-weight: bold;
          font-size: 4em;
        }
      `}</style>
      <section>
        <h1>Manatee</h1>
        <p>{t("subtitle")}</p>
      </section>
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
