import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Layout from "components/Layout";
import Hero from "components/Hero";

export default () => (
  <Layout>
    <Hero>
      <h1>Privacy Policy</h1>
    </Hero>
    <p>
      This document entails the privacy policy that you accept when adding{" "}
      <a href="https://discord.com/users/643103079679393792">Manatee#6746</a> to
      a server, or as a member of a server with Manatee in it.
    </p>
    <h2>Terminology</h2>
    <p>
      This section outlines some terms that will be used in the rest of the
      document.
    </p>
    <ul>
      <li>
        <strong>Server Manager</strong>: Anyone with the ability to add Manatee
        to a server or configure the server’s preferences on our dashboard
        (usually moderators, administrators, and the owner).
      </li>
      <li>
        <strong>Server Member</strong>: Anyone who is a member of a server to
        which Manatee has been added.
      </li>
      <li>
        <strong>Service User</strong>: Anyone who authorizes Manatee to obtain
        additional information on a user other than what’s publicly available
        (typically by using the “Login with Discord” feature on our website).
      </li>
    </ul>
    <h2>Data Collected By Command</h2>
    <p>
      The following pieces of information may be collected and stored when
      intentionally provided by a user, either by executing a command on Discord
      or interacting with our website. This data will not be collected
      automatically. When providing data in this way, you forego any rights to
      the content of the data provided.
    </p>
    <ul>
      <li>Server configurations</li>
      <li>Name of slash commands that are run</li>
      <li>Options provided to slash commands</li>
      <li>
        Your Discord ID (ex: <strong>281193735788953601</strong>) and Discord
        tag (ex: <strong>Cyborg#4239</strong>)
      </li>
      <li>Timestamps when commands are executed</li>
    </ul>
    <h2>Data Collected When Enabled</h2>
    <p>
      Manatee offers features that allow Server Managers to log events that
      happen within their server, including, but not limited to, the following:
    </p>
    <ul>
      <li>The content of any edited/deleted messages</li>
      <li>Details of a user involved in a moderation action (tag, ID, etc)</li>
      <li>Details of any users who join and leave (tag, ID, etc)</li>
    </ul>
    <p>
      When such logging features are enabled, the information is sent directly
      to the designated channel and is not collected or stored by Manatee.
      Manatee and its developer(s) assume no responsibility for this data, and
      you are advised to contact the Server Managers directly with any relevant
      questions.
    </p>
    <h2>Data Collected Automatically</h2>
    <p>
      Manatee may automatically collect any data needed for the standard
      operation of Discord bots (such as server, user, and member info). This
      data is cached in memory while the bot is running, and it is not stored on
      our servers.
    </p>
    <h2>Data Collected Via Authorization</h2>
    <p>
      The following data may be accessed by Manatee when authorized, such as
      when logging to this website via Discord OAuth2. This data is also listed
      when you authorize Manatee.
    </p>
    <ul>
      <li>Your username, Discord ID, and avatar data</li>
      <li>List of servers your account is connected to</li>
      <li>Your server permissions in the aforementioned servers</li>
    </ul>
    <h2>Data Storage</h2>
    <p>
      All data is stored on protected servers, kept within Manatee’s{" "}
      <a href="https://www.postgresql.org/">PostgreSQL</a> database. Please keep
      in mind that even with these protections, no data can be 100% secure. All
      efforts are taken to keep your data secure and private, but its absolute
      security cannot be guaranteed.
    </p>
    <h2>Agreement</h2>
    <p>
      By adding Manatee to your server or by being present in a server including
      Manatee, you consent to the policies outlined in this document. In
      addition, you (the Server Manager) assume the responsibility of informing
      your members of the contents of this document. If you, the Server Manager,
      do not agree to this document, you may remove Manatee from your Discord
      server. If you, the Server Member, do not agree to this document, you may
      leave the server(s) that include Manatee. If you, the Service User, do not
      agree to this document, you may revoke Manatee’s access to your data by
      going to Discord &gt; User Settings &gt; Authorized Apps.
    </p>
    <p>
      Manatee’s developer(s) reserve the right to update this document as
      necessary. If you have any questions or concerns on this agreement, you
      may contact Manatee’s developer(s) at the{" "}
      <a href="https://discord.com/invite/NP7F78SMzB">support server</a>.
    </p>
    <h2 id="credit">Credit</h2>
    <p>
      This document heavily borrows from{" "}
      <a href="https://gist.github.com/jagrosh/f1df4441f94ca06274fa78db7cc3c526">
        jagrosh’s Privacy Policy
      </a>
      , which applies to users of the bots listed in that agreement.
    </p>
  </Layout>
);

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}
