import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar(props) {
  return (
    <nav className={styles.navbar} role="navigation">
      <div className={styles.links}>
        <img className={styles.manatee} src="/manatee.png" />
        <Link href="/docs">Docs</Link>
        <Link href="/invite">Invite</Link>
        <Link href="/support">Support</Link>
      </div>
      <div className={styles.user}>
        <img src={props.avatar} />
        <p>{props.username}</p>
      </div>
    </nav>
  );
}
