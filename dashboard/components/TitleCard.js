import styles from "./TitleCard.module.css";

export default (props) => (
  <header className={styles.hero}>
    {props.img && <img src={props.img} />}
    <div>
      {props.subtitle && <p>{props.subtitle}</p>}
      <h1>{props.title}</h1>
    </div>
  </header>
);
