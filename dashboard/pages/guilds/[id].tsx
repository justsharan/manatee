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
import { Field, Form, Formik } from "formik";

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
        <Formik
          initialValues={settings}
          onSubmit={(values, { setSubmitting }) =>
            fetch(`/api/guilds/edit/${guild.id}`, {
              method: "POST",
              body: JSON.stringify({ ...values, id: undefined }),
            })
          }
        >
          {({ isSubmitting }) => (
            <Form>
              <div>
                <label htmlFor="autorole">{t("autorole")}</label>
                <Field name="autorole" />
              </div>
              <div>
                <label htmlFor="autorole">{t("mod_log")}</label>
                <Field name="mod_log" />
              </div>
              <div>
                <label htmlFor="autorole">{t("member_log")}</label>
                <Field name="member_log" />
              </div>
              <div>
                <label htmlFor="autorole">{t("message_log")}</label>
                <Field name="message_log" />
              </div>
              <button type="submit" disabled={isSubmitting} className="btn">
                Save
              </button>
            </Form>
          )}
        </Formik>
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
