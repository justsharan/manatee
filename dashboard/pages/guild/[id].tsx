import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import Image from "next/image";
import Hero from "../../components/Hero";
import Layout from "../../components/Layout";
import styles from "./[id].module.css";

interface Guild {
  id: string;
  name: string;
  icon?: string;
  owner: boolean;
  permissions: string;
  features: string[];
}

export default function Guild(props: Guild) {
  return (
    <Layout>
      <div className={styles.header}>
        <Image
          src={`https://cdn.discordapp.com/icons/${props.id}/${props.icon}.jpg?size=256`}
          width="64"
          height="64"
          className="round"
        />
        <Hero>
          <p>Settings for</p>
          <h1>{props.name}</h1>
        </Hero>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session: any = await getSession(ctx);
  if (!session) return { notFound: true };

  const guild = session.guilds.find((g) => g.id === ctx.query.id);
  if (!guild) return { notFound: true };

  return { props: guild };
}
