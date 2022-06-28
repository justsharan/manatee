import { GetStaticPropsContext } from "next";
import Image from "next/image";
import Link from "next/link";
import Layout from "components/Layout";
import styles from "./index.module.css";
import Hero from "components/Hero";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

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
  const { locale, ...router } = useRouter();
  const { data, status } = useSession();

  if (status === "unauthenticated") {
    router.push("/");
  }

  const [guilds, setGuilds] = useState([]);
  const [botGuilds, setBotGuilds] = useState([]);

  const fetchGuilds = async () => {
    const storedGuilds = localStorage.getItem("guilds");
    if (!storedGuilds) {
      const res = await fetch("/api/guilds/user");
      const body = await res.json();
      localStorage.setItem("guilds", JSON.stringify(body));
    }
    const guilds = JSON.parse(localStorage.getItem("guilds"));
    const botGuildsRes = await fetch(
      `/api/guilds/check?guilds=${guilds.map((g) => g.id).join(",")}`
    );
    setBotGuilds(await botGuildsRes.json());
    setGuilds(guilds);
  };

  useEffect(() => {
    fetchGuilds();
  }, []);

  return (
    <Layout title="Servers">
      <Hero title={t("title")} subtitle={t("subtitle")} color />
      <div className={styles.list}>
        {guilds
          .filter((g) => Number(g.permissions) & (1 << 5))
          .map(({ id, icon, name }) =>
            botGuilds.includes(id) ? (
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

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`public/locales/${locale}.json`)).default,
    },
  };
}
