import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Button from "components/Button";
import styles from "./Navbar.module.css";

const INVITE_LINK =
  "https://discord.com/oauth2/authorize?scope=applications.commands%20bot&client_id=643103079679393792&permissions=164752486";
const SUPPORT_LINK = "https://discord.gg/PMzqbaVEsH";

export default function Navbar() {
  const t = useTranslations("Navbar");
  return (
    <nav className={styles.navbar}>
      <div>
        <Image src="/manatee.png" width={50} height={50} />
        <Link href="/docs">{t("docs")}</Link>
        <Link href={INVITE_LINK}>{t("invite")}</Link>
        <Link href={SUPPORT_LINK}>{t("discord")}</Link>
      </div>
      <div>
        <Button onClick={() => alert("Hello World")}>{t("signIn")}</Button>
      </div>
    </nav>
  );
}
