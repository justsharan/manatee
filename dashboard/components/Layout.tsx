import Navbar from "./Navbar";
import styles from "./Layout.module.css";
import Head from "next/head";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <meta name="theme-color" content="#202225" />
      </Head>
      <Navbar
        avatar="https://cdn.discordapp.com/avatars/281193735788953601/5044b94e09b6262e1f5442d16dd53c1e.jpg?size=128"
        username="Cyborg#4239"
      />
      <main className={styles.content}>{children}</main>
    </>
  );
}
