import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Navbar from "../components/Navbar";

export default function Home() {
  const { t } = useTranslation("common");
  return (
    <>
      <Navbar />
      <main>
        <section className="hero">
          <h1>Manatee</h1>
          <p>{t("subtitle")}</p>
        </section>
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
