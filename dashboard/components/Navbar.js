import styles from "../styles/Navbar.module.css";

export default (props) => (
  <nav className={styles.navbar}>
    <div className={styles.links}>
      <a href="/">
        <img src="/manatee.png" />
      </a>
      <a href="/docs">Docs</a>
      <a href="/invite">Invite</a>
      <a href="/discord">Discord</a>
    </div>
    <div className={styles.userinfo}>
      <img src={props.avatar} />
      <p>{props.name}</p>
    </div>
  </nav>
);
