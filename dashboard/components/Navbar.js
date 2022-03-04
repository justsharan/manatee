import { signIn, signOut, useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./Navbar.module.css";

export default () => {
  const { data } = useSession();
  const { locale } = useRouter();
  const t = useTranslation("common").t("navbar");

  return (
    <nav className={styles.navbar}>
      <div className={styles.links}>
        <Link href="/" locale={locale}>
          <img src="/manatee.png" />
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
            <a href="/guilds">{data.user.name}</a>
            <a
              className={styles.btn}
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              {t["log-out"]}
            </a>
          </>
        ) : (
          <a
            className={styles.btn}
            onClick={() => signIn("discord", { callbackUrl: "/guilds" })}
          >
            {t["log-in"]}
          </a>
        )}
      </div>
    </nav>
  );
};
