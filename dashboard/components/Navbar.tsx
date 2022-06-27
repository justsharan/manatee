import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Button from "components/Button";
import styles from "./Navbar.module.css";
import { useRouter } from "next/router";

const INVITE_LINK =
  "https://discord.com/oauth2/authorize?scope=applications.commands%20bot&client_id=643103079679393792&permissions=164752486";
const SUPPORT_LINK = "https://discord.gg/PMzqbaVEsH";

export default function Navbar() {
  const t = useTranslations("Navbar");
  const { locale } = useRouter();

  return (
    <nav className={styles.navbar}>
      <div>
        <Link href="/" locale={locale}>
          <Image src="/manatee.png" width={50} height={50} />
        </Link>
        <Link href="/docs" locale={locale}>
          {t("docs")}
        </Link>
        <Link href={INVITE_LINK}>{t("invite")}</Link>
        <Link href={SUPPORT_LINK}>{t("discord")}</Link>
      </div>
      <div>
        <Button href="/guilds" locale={locale}>
          {t("signIn")}
        </Button>
      </div>
    </nav>
  );
}
