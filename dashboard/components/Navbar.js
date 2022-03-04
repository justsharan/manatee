import { signIn, signOut, useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./Navbar.module.css";

export default () => {
  const { data } = useSession();
  const { locale, defaultLocale } = useRouter();
  const routeBase = locale === defaultLocale ? "/" : `/${locale}`;

  const t = useTranslation("common").t("navbar");

  return (
    <nav className={styles.navbar}>
      <div className={styles.links}>
        <Link href="/" locale={locale}>
          <img className={styles.manatee} src="/manatee.png" />
        </Link>
        <Link href="/docs" locale={locale}>
          Docs
        </Link>
        <Link href="/invite">{t["invite"]}</Link>
        <Link href="/discord">Discord</Link>
      </div>
      <div className={styles.userinfo}>
        {data ? (
          <>
            <img src={data.user.image} />
            <Link href="/guilds" locale={locale}>
              {data.user.name}
            </Link>
            <a
              className={styles.btn}
              onClick={() => signOut({ callbackUrl: routeBase })}
            >
              {t["log-out"]}
            </a>
          </>
        ) : (
          <a
            className={styles.btn}
            onClick={() =>
              signIn("discord", { callbackUrl: `${routeBase}/guilds` })
            }
          >
            {t["log-in"]}
          </a>
        )}
      </div>
    </nav>
  );
};
