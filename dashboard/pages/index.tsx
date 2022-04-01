import Hero from "../components/Hero";
import Layout from "../components/Layout";
import styles from "./index.module.css";

export default function Home() {
  return (
    <Layout>
      <Hero>
        <div className={styles.hero}>
          <h1 style={{ color: "var(--manatee)" }}>Manatee</h1>
          <p>
            An awesome, easy-to-use Discord bot that's perfect for your server.
          </p>
        </div>
      </Hero>
    </Layout>
  );
}
