import { GetServerSideProps, GetStaticProps } from "next";
import { getSession, useSession } from "next-auth/react";
import GuildListItem from "../components/GuildListItem";
import Hero from "../components/Hero";
import Layout from "../components/Layout";
import styles from "./guilds.module.css";

interface Guild {
  id: string;
  name: string;
  icon?: string;
  owner: boolean;
  permissions: string;
  features: string[];
}

export default function Guilds() {
  const { data }: any = useSession({ required: true });
  console.log(data);
  return (
    <Layout>
      <Hero>
        <h1>Welcome to Manatee!</h1>
        <p>Choose a server from the list below.</p>
      </Hero>
      <div className={styles.list}>
        {data.guilds
          // .filter((g) => Number(g.permissions) & (1 << 5))
          .map((g) => (
            <GuildListItem key={g.id} {...g} />
          ))}
      </div>
    </Layout>
  );
}
