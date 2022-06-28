import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      authorization: {
        params: {
          scope: "identify guilds",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      // if (!session.guilds) {
      //   console.log("Getting guilds");
      //   const res = await fetch(
      //     "https://discord.com/api/v10/users/@me/guilds",
      //     {
      //       headers: {
      //         Authorization: `Bearer ${token.accessToken}`,
      //       },
      //     }
      //   );
      //   const body = await res.json();
      //   session.guilds = body;
      // }
      return session;
    },
  },
});
