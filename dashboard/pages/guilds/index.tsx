import { GetStaticPropsContext } from "next";
import Image from "next/image";
import Layout from "components/Layout";
import styles from "./index.module.css";
import Hero from "components/Hero";
import { useTranslations } from "next-intl";

interface UserGuild {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: string;
  features: string[];
}

export default function Guilds(props: { guilds: UserGuild[] }) {
  const t = useTranslations("Guilds");
  return (
    <Layout>
      <Hero title={t("title")} subtitle={t("subtitle")} color />
      <div className={styles.list}>
        {props.guilds.map(({ id, icon, name }) => (
          <div key={id}>
            <Image
              src={`https://cdn.discordapp.com/icons/${id}/${icon}.png?size=256`}
              width={75}
              height={75}
            />
            <p>{name.length > 25 ? name.slice(0, 20) + "..." : name}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`public/locales/${locale}.json`)).default,
      guilds: (await import("testdata.json")).default,
    },
  };
}
