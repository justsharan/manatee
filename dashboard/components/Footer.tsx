import { FC } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import Link from "next/link";

import styles from "./Footer.module.css";

const localeEmojis = {
  en: "🇺🇸",
  fr: "🇫🇷",
};

const Footer: FC = () => {
  const router = useRouter();
  const { locale, locales, pathname, asPath, query } = router;
  const otherLocale = locales.find((l) => l !== locale);

  const { t } = useTranslation("common");
  const footer = t("footer") as Record<string, string>;

  return (
    <footer className={styles.footer}>
      &copy; {new Date().getFullYear()} Manatee.{" "}
      <Link href="/privacy">{footer.privacy}</Link>.{" "}
      <span
        onClick={() =>
          router.push({ pathname, query }, asPath, { locale: otherLocale })
        }
      >
        {localeEmojis[otherLocale]}
      </span>
    </footer>
  );
};

export default Footer;
