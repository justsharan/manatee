import styles from "./Hero.module.css";

type HeroProps = {
  title: string;
  subtitle: string;
  color?: boolean;
  reversed?: boolean;
};

export default function Hero(props: HeroProps) {
  return !props.reversed ? (
    <header className={styles.hero}>
      {props.color && <h1 className={styles.manatee}>{props.title}</h1>}
      {!props.color && <h1>{props.title}</h1>}
      <p>{props.subtitle}</p>
    </header>
  ) : (
    <header className={styles.hero}>
      <p>{props.subtitle}</p>
      {props.color && <h1 className={styles.manatee}>{props.title}</h1>}
      {!props.color && <h1>{props.title}</h1>}
    </header>
  );
}
