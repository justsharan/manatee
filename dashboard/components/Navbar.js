import { signIn, signOut, useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import styles from "./Navbar.module.css";

export default () => {
  const { data } = useSession();
  const t = useTranslation("common").t("navbar");
  return (
    <nav className={styles.navbar}>
      <div className={styles.links}>
        <a href="/">
          <img src="/manatee.png" />
        </a>
        <a href="/docs">Docs</a>
        <a href="/invite">{t["invite"]}</a>
        <a href="/discord">Discord</a>
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
