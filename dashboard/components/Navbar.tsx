import { FC } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useTranslation } from "next-i18next";

import styles from "./Navbar.module.css";

const Navbar: FC = () => {
  const { data } = useSession();
  const { locale, defaultLocale } = useRouter();
  const routeBase = locale === defaultLocale ? "/" : `/${locale}`;

  const { t } = useTranslation("common");
  const navbar = t("navbar") as Record<string, string>;

  return (
    <nav className={styles.navbar} role="navigation">
      <div className={styles.links}>
        <Link href="/" locale={locale}>
          <img className={styles.manatee} src="/manatee.png" />
        </Link>
        <Link href="/docs" locale={locale}>
          Docs
        </Link>
        <Link href="/invite">{navbar.invite}</Link>
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
              {navbar["log-out"]}
            </a>
          </>
        ) : (
          <a
            className={styles.btn}
            onClick={() =>
              signIn("discord", { callbackUrl: `${routeBase}/guilds` })
            }
          >
            {navbar["log-in"]}
          </a>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
