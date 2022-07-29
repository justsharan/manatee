import { GetStaticPropsContext } from "next";
import Layout from "components/Layout";
import styles from "./docs.module.css";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";

type CommandInfo = {
  id: string;
  dm_permission: boolean;
  type: number;
  name: string;
  name_localizations: Record<string, string>;
  description: string;
  description_localizations: Record<string, string>;
  options: {
    type: number;
    name: string;
    name_localizations: Record<string, string>;
    description: string;
    description_localizations: Record<string, string>;
    required: boolean;
  }[];
};

export default function Docs({ cmds }: { cmds: CommandInfo[] } & object) {
  const t = useTranslations("Docs");
  const { locale, defaultLocale } = useRouter();
  return (
    <Layout title={t("docs")}>
      <section className={styles.list}>
        {cmds
          .filter((c) => c.type === 1)
          .map((cmd) => (
            <fieldset key={cmd.id}>
              <legend className={styles.header}>
                <h3>
                  /
                  {locale === defaultLocale
                    ? cmd.name
                    : cmd.name_localizations[locale]}{" "}
                  {cmd.options &&
                    cmd.options.map((o) => (
                      <span key={o.name}>
                        {locale === defaultLocale
                          ? o.name
                          : o.name_localizations[locale]}
                      </span>
                    ))}
                </h3>
              </legend>
              {locale === defaultLocale
                ? cmd.description
                : cmd.description_localizations[locale]}
              {cmd.options && (
                <ul>
                  {cmd.options.map((o) => (
                    <li key={o.name}>
                      <span>
                        {locale === defaultLocale
                          ? o.name
                          : o.name_localizations[locale]}
                      </span>{" "}
                      <code>{t(String(o.type))}</code>
                      <p>
                        {locale === defaultLocale
                          ? o.description
                          : o.description_localizations[locale]}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </fieldset>
          ))}
      </section>
    </Layout>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      cmds: (await import(`public/cmds.json`)).default,
      messages: (await import(`public/locales/${locale}.json`)).default,
    },
  };
}
