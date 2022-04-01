import Hero from "../components/Hero";
import Layout from "../components/Layout";

export default function Home() {
  return (
    <Layout>
      <Hero>
        <h1 style={{ color: "var(--manatee)" }}>Manatee</h1>
        <p>
          An awesome, easy-to-use Discord bot that's perfect for your server.
        </p>
      </Hero>
    </Layout>
  );
}
