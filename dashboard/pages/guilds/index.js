import { useSession } from "next-auth/react";

import Navbar from "../../components/Navbar";
import GuildListItem from "../../components/GuildListItem";

export default function Guilds() {
  const { data } = useSession();
  if (!data) return <>Loading</>;
  return (
    <>
      <style jsx>{`
        main {
          display: flex;
          flex-direction: row;
          gap: 3em;
          flex-wrap: wrap;
          justify-content: center;
          margin: 5em auto;
        }
      `}</style>
      <Navbar />
      <header>
        <h3>Welcome!</h3>
        <p>Choose a server from below.</p>
      </header>
      <main>
        {data.guilds.map((guild) => (
          <GuildListItem {...guild} />
        ))}
      </main>
    </>
  );
}
