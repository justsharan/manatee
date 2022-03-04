import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import Navbar from "../../components/Navbar";
import styles from "./[guildID].module.css";

export default () => {
  const { data } = useSession();
  if (!data) return <>Loading</>;

  const guild = data.guilds.find((g) => g.id === useRouter().query.guildID);

  return (
    <>
      <Navbar />
      <header className={styles.hero}>
        <img
          src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.jpg?size=256`}
        />
        <div>
          <p>Settings for</p>
          <h1>{guild.name}</h1>
        </div>
      </header>
      <main></main>
    </>
  );
};
