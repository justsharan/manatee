import { PropsWithChildren } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import Button from "components/Button";
import styles from "./Layout.module.css";
import Head from "next/head";

export default function Layout(props: PropsWithChildren<{ title: string }>) {
  const t = useTranslations("Navbar");
  const { locale } = useRouter();

  return (
    <>
      <Head>
        <title>{props.title}</title>
      </Head>
      <nav className={styles.navbar}>
        <div>
          <Link href="/" locale={locale}>
            <Image src="/manatee.png" width={50} height={50} />
          </Link>
          <Link href="/docs" locale={locale}>
            {t("docs")}
          </Link>
          <Link href="/invite">{t("invite")}</Link>
          <Link href="/discord">{t("discord")}</Link>
        </div>
        <div>
          <Button href="/guilds" locale={locale}>
            {t("signIn")}
          </Button>
        </div>
      </nav>
      <main className={styles.content}>{props.children}</main>
    </>
  );
}
