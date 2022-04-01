import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar(props) {
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
        <img src={props.avatar} />
        <Link href="/guilds">{props.username}</Link>
      </div>
    </nav>
  );
}
