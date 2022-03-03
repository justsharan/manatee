import styles from "./GuildListItem.module.css";

export default (props) => (
  <section className={styles.card}>
    <img
      className={styles.icon}
      src={`https://cdn.discordapp.com/icons/${props.id}/${props.icon}.jpg?size=256`}
    />
    <p>{condense(props.name)}</p>
  </section>
);

const condense = (name) =>
  name.length > 20 ? name.slice(0, 10) + "..." : name;
