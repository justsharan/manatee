import { useSession } from "next-auth/react";

import Navbar from "../../components/Navbar";
import GuildListItem from "../../components/GuildListItem";

import styles from "./index.module.css";

export default function Guilds() {
  const { data } = useSession();
  if (!data) return <>Loading</>;
  return (
    <>
      <Navbar />
      <header className={styles.hero}>
        <h1>Welcome to Manatee!</h1>
        <p>Choose a server from below.</p>
      </header>
      <main className={styles.list}>
        {data.guilds.map((guild) => (
          <GuildListItem {...guild} />
        ))}
      </main>
    </>
  );
}
