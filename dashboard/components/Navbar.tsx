import Image from "next/image";
import Link from "next/link";
import Button from "components/Button";
import styles from "./Navbar.module.css";

const INVITE_LINK =
  "https://discord.com/oauth2/authorize?scope=applications.commands%20bot&client_id=643103079679393792&permissions=164752486";
const SUPPORT_LINK = "https://discord.gg/PMzqbaVEsH";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div>
        <Image src="/manatee.png" width={50} height={50} />
        <Link href="/docs">Docs</Link>
        <Link href={INVITE_LINK}>Invite</Link>
        <Link href={SUPPORT_LINK}>Support</Link>
      </div>
      <div>
        <Button onClick={() => alert("Hello World")}>Sign In</Button>
      </div>
    </nav>
  );
}
