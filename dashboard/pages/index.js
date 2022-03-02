import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <section className="hero">
          <h1>Manatee</h1>
          <p>
            An <span className="keyword">awesome</span>, easy-to-use Discord bot
            that's <span className="keyword">perfect</span> for your server.
          </p>
        </section>
      </main>
    </>
  );
}
