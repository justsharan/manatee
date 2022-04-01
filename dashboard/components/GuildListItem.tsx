import Link from "next/link";
import styles from "./GuildListItem.module.css";

interface GuildProps {
  id: string;
  name: string;
  icon?: string;
  owner: boolean;
  permissions: string;
  features: string[];
}

export default function GuildListItem({ id, icon, name }: GuildProps) {
  return (
    <Link href={`/guild/${id}`}>
      <div className={styles.item}>
        <img
          src={`https://cdn.discordapp.com/icons/${id}/${icon}.jpg?size=256`}
          className={styles.icon}
        />
        <p className={styles.name}>
          {name.length > 30 ? name.slice(20) + "..." : name}
        </p>
      </div>
    </Link>
  );
}
