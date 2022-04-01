import Image from "next/image";
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
        <Image
          src={`https://cdn.discordapp.com/icons/${id}/${icon}.jpg?size=256`}
          width="64"
          height="64"
          className="round"
        />
        <p className={styles.name}>
          {name.length > 30 ? name.slice(20) + "..." : name}
        </p>
      </div>
    </Link>
  );
}
