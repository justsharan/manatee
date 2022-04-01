import Navbar from "./Navbar";
import styles from "./Layout.module.css";
import Head from "next/head";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <meta name="theme-color" content="#202225" />
      </Head>
      <Navbar />
      <main className={styles.content}>{children}</main>
    </>
  );
}
