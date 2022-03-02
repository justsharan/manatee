import styles from "../styles/Navbar.module.css";

export default (props) => (
  <nav className={styles.navbar}>
    <div className={styles.links}>
      <img src="/manatee.png" />
      <a href="#">Docs</a>
      <a href="#">Invite</a>
      <a href="#">Discord</a>
    </div>
    <div className={styles.userinfo}>
      <img src={props.avatar} />
      <p>{props.name}</p>
    </div>
  </nav>
);
