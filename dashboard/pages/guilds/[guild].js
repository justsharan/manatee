import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";

import styles from "./[guild].module.css";

export default () => {
  const { guild } = useRouter().query;

  const { data } = useSession();
  if (!data) return <>Loading...</>;

  const discordGuild = data.guilds.find((g) => g.id === guild);

  return (
    <>
      <Navbar />
      <header className={styles.hero}>
        <img
          src={`https://cdn.discordapp.com/icons/${discordGuild.id}/${discordGuild.icon}.jpg?size=256`}
        />
        <div>
          <p>Settings for</p>
          <h1>{discordGuild.name}</h1>
        </div>
      </header>
    </>
  );
};
