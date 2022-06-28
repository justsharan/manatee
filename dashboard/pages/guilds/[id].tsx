import Layout from "components/Layout";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import Hero from "components/Hero";
import { useTranslations } from "next-intl";
import styles from "./[id].module.css";
import { useEffect, useState } from "react";
import Spinner from "components/Spinner";
import { Guild } from "types/discord";
import { DBGuild } from "types/database";
import { iconURL, truncateName } from "utils/guild";
import { useSession } from "next-auth/react";

export default function GuildSettings() {
  const t = useTranslations("Guild");
  const router = useRouter();
  const { status } = useSession();
  if (status === "unauthenticated") {
    router.push("/");
  }

  const [guild, setGuild] = useState<Guild>();
  const [settings, setSettings] = useState<DBGuild>();

  useEffect(() => {
    (async () => {
      // Find guild info in localStorage
      const localInfo: Guild[] = JSON.parse(localStorage.getItem("guilds"));
      const guild = localInfo.find((g) => g.id === router.query.id);
      setGuild(guild);

      // Get guild settings from database
      const res = await fetch(`/api/guilds/${guild.id}`);
      setSettings(await res.json());
    })();
  }, []);

  // Show spinner if guild info hasn't loaded yet
  if (!guild || !settings) {
    return (
      <Layout title={router.query.id as string}>
        <Spinner />
      </Layout>
    );
  }

  // Render guild settings page
  return (
    <Layout title={guild.name}>
      <div className={styles.header}>
        <img src={iconURL(guild)} />
        <Hero
          title={truncateName(guild.name)}
          subtitle={t("subtitle")}
          reversed
        />
      </div>
      <section className={styles.settings}>
        <form
          onSubmit={(evt) => {
            evt.preventDefault();
            alert("Implement save logic");
          }}
        >
          <div>
            <label htmlFor="autorole">{t("autorole")}</label>
            <input value={settings.autorole ?? ""} name="autorole" />
          </div>

          <div>
            <label htmlFor="mod_log">{t("mod_log")}</label>
            <input value={settings.mod_log ?? ""} name="mod_log" />
          </div>

          <div>
            <label htmlFor="member_log">{t("member_log")}</label>
            <input value={settings.member_log ?? ""} name="member_log" />
          </div>

          <div>
            <label htmlFor="message_log">{t("message_log")}</label>
            <input value={settings.message_log ?? ""} name="message_log" />
          </div>

          <div>
            <button className="btn" type="submit">
              {t("save")}
            </button>
          </div>
        </form>
      </section>
    </Layout>
  );
}

// Load translations
export async function getServerSideProps({
  locale,
}: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`public/locales/${locale}.json`)).default,
    },
  };
}
