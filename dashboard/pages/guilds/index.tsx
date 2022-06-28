import { GetServerSidePropsContext } from "next";
import Image from "next/image";
import Link from "next/link";
import Layout from "components/Layout";
import styles from "./index.module.css";
import Hero from "components/Hero";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";

export interface UserGuild {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: string;
  features: string[];
}

export default function Guilds(props: {
  guilds: UserGuild[];
  guildsWithBot: string[];
}) {
  const t = useTranslations("Guilds");
  const { locale } = useRouter();
  return (
    <Layout title="Servers">
      <Hero title={t("title")} subtitle={t("subtitle")} color />
      <div className={styles.list}>
        {props.guilds
          .filter((g) => Number(g.permissions) & (1 << 5))
          .map(({ id, icon, name }) =>
            props.guildsWithBot.includes(id) ? (
              <Link href={`/guilds/${id}`} locale={locale} key={id}>
                <div>
                  <Image
                    src={`https://cdn.discordapp.com/icons/${id}/${icon}.png?size=256`}
                    width={75}
                    height={75}
                  />
                  <p>{name.length > 25 ? name.slice(0, 20) + "..." : name}</p>
                </div>
              </Link>
            ) : (
              <Link href={`/invite?guild_id=${id}`} locale={locale} key={id}>
                <div>
                  <Image
                    src={`https://cdn.discordapp.com/icons/${id}/${icon}.png?size=256`}
                    width={75}
                    height={75}
                    className={styles.grayscale}
                  />
                  <p>{name.length > 25 ? name.slice(0, 20) + "..." : name}</p>
                </div>
              </Link>
            )
          )}
      </div>
    </Layout>
  );
}

export async function getServerSideProps({
  locale,
}: GetServerSidePropsContext) {
  const guilds = (await import("testdata.json")).default;
  const hasBot = await Promise.all(
    guilds.map(async (guild) => {
      const res = await fetch(`http://localhost:3000/api/guilds/${guild.id}`);
      return res.status === 200;
    })
  );
  return {
    props: {
      messages: (await import(`public/locales/${locale}.json`)).default,
      guilds,
      guildsWithBot: guilds.filter((_, i) => hasBot[i]).map((g) => g.id),
    },
  };
}
