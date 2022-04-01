import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { data } = useSession();
  return (
    <nav className={styles.navbar} role="navigation">
      <div className={styles.links}>
        <Link href="/">
          <img className={styles.manatee} src="/manatee.png" />
        </Link>
        <Link href="/docs">Docs</Link>
        <Link href="/invite">Invite</Link>
        <Link href="/support">Support</Link>
      </div>
      <div className={styles.user}>
        {data && (
          <>
            <img src={data.user.image} />
            <Link href="/guilds">{data.user.name}</Link>
          </>
        )}
        {!data && (
          <>
            <a onClick={() => signIn("discord", { callbackUrl: "/guilds" })}>
              Sign In
            </a>
          </>
        )}
      </div>
    </nav>
  );
}
