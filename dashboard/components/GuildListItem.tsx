import { useRouter } from "next/router";
import { FC } from "react";
import Link from "next/link";

import styles from "./GuildListItem.module.css";

type GuildListItemProps = {
  id: string;
  name: string;
  icon?: string;
  owner: boolean;
  permissions: string;
  features: string[];
};

const GuildListItem: FC<GuildListItemProps> = ({ id, icon, name }) => {
  const { locale } = useRouter().query as { locale: string };
  return (
    <Link href={`/guild/${id}`} locale={locale}>
      <section className={styles.card}>
        <img
          className={styles.icon}
          src={`https://cdn.discordapp.com/icons/${id}/${icon}.jpg?size=256`}
        />
        <p>{name.length > 30 ? name.slice(0, 20) + "..." : name}</p>
      </section>
    </Link>
  );
};

export default GuildListItem;
