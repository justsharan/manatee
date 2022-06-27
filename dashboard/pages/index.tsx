import { GetStaticPropsContext } from "next";
import Navbar from "components/Navbar";
import styles from "./index.module.css";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("Home");
  return (
    <>
      <Navbar />
      <main className={styles.hero}>
        <h1>Manatee</h1>
        <p>{t("tagline")}</p>
      </main>
    </>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`public/locales/${locale}.json`)).default,
    },
  };
}
