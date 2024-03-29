import { PropsWithChildren } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import styles from "./Layout.module.css";
import Head from "next/head";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Layout(props: PropsWithChildren<{ title: string }>) {
  const t = useTranslations("Navbar");
  const { locale, defaultLocale } = useRouter();
  const { data } = useSession();

  return (
    <>
      <Head>
        <title>{props.title}</title>
        <link rel="shortcut icon" type="image/png" href="manatee.png" />
        <link
          rel="apple-touch-icon"
          sizes="1024x1024"
          href="apple-touch-icon.jpg"
        />
      </Head>
      <nav className={styles.navbar}>
        <div className={styles.navleft}>
          <Link href="/" locale={locale}>
            <img src="/manatee.png" />
          </Link>
          <Link href="/docs" locale={locale}>
            {t("docs")}
          </Link>
          <Link href="/invite">{t("invite")}</Link>
          <Link href="/discord">{t("discord")}</Link>
        </div>
        {data && (
          <div className={styles.user}>
            <Link href="/guilds" locale={locale}>
              <div>
                <img src={data.user.image} />
                <p>{data.user.name}</p>
              </div>
            </Link>
            <button onClick={() => signOut()} className="btn">
              {t("signOut")}
            </button>
          </div>
        )}
        {!data && (
          <button
            onClick={() =>
              signIn("discord", {
                callbackUrl:
                  locale === defaultLocale ? "/guilds" : `/${locale}/guilds`,
              })
            }
            className="btn"
          >
            {t("signIn")}
          </button>
        )}
      </nav>
      <main className={styles.content}>{props.children}</main>
      <footer className={styles.footer}>
        <Link href="/privacy">Privacy Policy</Link> • <LanguagePicker />
      </footer>
    </>
  );
}

function LanguagePicker() {
  const router = useRouter();
  const { pathname, asPath, query } = router;
  const handleClick = (locale) =>
    router.push({ pathname, query }, asPath, { locale });

  return (
    <select
      onChange={(e) => handleClick(e.target.value)}
      required
      defaultValue={router.locale}
    >
      <option value="en-US">English</option>
      <option value="fr">Français</option>
      <option value="de">Deutsch</option>
    </select>
  );
}
