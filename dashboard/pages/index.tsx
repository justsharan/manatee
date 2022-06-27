import { GetStaticPropsContext } from "next";
import Layout from "components/Layout";
import styles from "./index.module.css";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("Home");
  return (
    <Layout title="Manatee">
      <section className={styles.hero}>
        <h1>Manatee</h1>
        <p>{t("tagline")}</p>
      </section>
    </Layout>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`public/locales/${locale}.json`)).default,
    },
  };
}
