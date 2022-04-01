import styles from "./Hero.module.css";

export default function Hero({ children }) {
  return <header className={styles.hero}>{children}</header>;
}
