import { PropsWithChildren } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import Button from "components/Button";
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
      </Head>
      <nav className={styles.navbar}>
        <div className={styles.navleft}>
          <Link href="/" locale={locale}>
            <Image src="/manatee.png" width={50} height={50} />
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
                <img src="https://cdn.discordapp.com/avatars/281193735788953601/59b9e61d45d9d40fbbe04cac85e7ab18.jpg?size=128" />
                <p>{data.user.name}</p>
              </div>
            </Link>
            <Button onClick={() => signOut()}>{t("signOut")}</Button>
          </div>
        )}
        {!data && (
          <Button
            onClick={() =>
              signIn("discord", {
                callbackUrl:
                  locale === defaultLocale ? "/guilds" : `/${locale}/guilds`,
              })
            }
          >
            {t("signIn")}
          </Button>
        )}
      </nav>
      <main className={styles.content}>{props.children}</main>
    </>
  );
}
