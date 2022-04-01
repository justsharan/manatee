import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { data } = useSession();
  return (
    <nav className={styles.navbar} role="navigation">
      <div className={styles.links}>
        <Link href="/">
          <Image src="/manatee.png" width="50" height="50" />
        </Link>
        <Link href="/docs">Docs</Link>
        <Link href="/invite">Invite</Link>
        <Link href="/discord">Support</Link>
      </div>
      <div className={styles.user}>
        {data && (
          <>
            <Image
              src={data.user.image}
              width="30"
              height="30"
              className="round"
            />
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
