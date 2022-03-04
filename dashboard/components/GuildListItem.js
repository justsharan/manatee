import Link from "next/link";
import styles from "./GuildListItem.module.css";

export default (props) => (
  <Link href={`/guilds/${props.id}`}>
    <section className={styles.card}>
      <img
        className={styles.icon}
        src={`https://cdn.discordapp.com/icons/${props.id}/${props.icon}.jpg?size=256`}
      />
      <p>{condense(props.name)}</p>
    </section>
  </Link>
);

const condense = (name) =>
  name.length > 30 ? name.slice(0, 20) + "..." : name;
