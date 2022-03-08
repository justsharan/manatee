import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
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
  const { locale } = useRouter();
  const [dbInfo, setDbInfo] = useState<Record<string, string>>();

  useEffect(() => {
    if (!dbInfo) {
      updateDbInfo();
    }
  }, [dbInfo]);

  const updateDbInfo = async () => {
    const res = await fetch(`${window.location.origin}/api/guilds/${id}`);
    setDbInfo(res.ok ? await res.json() : { error: String(res.status) });
  };

  if (dbInfo && !dbInfo.error) {
    return (
      <Link href={`/guild/${id}`} locale={locale}>
        <section className={styles.card}>
          <img
            className={styles.icon}
            src={`https://cdn.discordapp.com/icons/${id}/${icon}.jpg?size=256`}
          />
          <p>{name.length > 30 ? `${name.slice(0, 20)}...` : name}</p>
        </section>
      </Link>
    );
  } else {
    return (
      <Link
        href={`https://discord.com/oauth2/authorize?client_id=643103079679393792&permissions=164752486&scope=applications.commands%20bot&guild_id=${id}`}
      >
        <section className={`${styles.card} ${styles.error}`}>
          <img
            className={styles.icon}
            src={`https://cdn.discordapp.com/icons/${id}/${icon}.jpg?size=256`}
          />
          <p>{name.length > 30 ? `${name.slice(0, 20)}...` : name}</p>
        </section>
      </Link>
    );
  }
};

export default GuildListItem;
