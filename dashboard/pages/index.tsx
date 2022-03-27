import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Layout from "components/Layout";

import styles from "./index.module.css";

export default () => {
  const { t } = useTranslation("common");
  return (
    <Layout>
      <section className={styles.hero}>
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
