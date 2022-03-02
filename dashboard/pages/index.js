import Navbar from "../components/Navbar";

const dummyUser = {
  avatar:
    "https://cdn.discordapp.com/avatars/281193735788953601/5044b94e09b6262e1f5442d16dd53c1e.jpg?size=128",
  name: "Cyborg#4239",
};

export default function Home() {
  return (
    <>
      <Navbar user={dummyUser} />
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
