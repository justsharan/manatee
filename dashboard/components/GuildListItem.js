import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./GuildListItem.module.css";

export default (props) => {
  const { locale } = useRouter();
  return (
    <Link href={`/guild/${props.id}`} locale={locale}>
      <section className={styles.card}>
        <img
          className={styles.icon}
          src={`https://cdn.discordapp.com/icons/${props.id}/${props.icon}.jpg?size=256`}
        />
        <p>{condense(props.name)}</p>
      </section>
    </Link>
  );
};

const condense = (name) =>
  name.length > 30 ? name.slice(0, 20) + "..." : name;
