import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

export default NextAuth({
  providers: [
    new Discord({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      authorization:
        "https://discord.com/api/oauth2/authorize?scope=identify+guilds",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      if (!token.guilds) {
        const res = await fetch("https://discord.com/api/v9/users/@me/guilds", {
          headers: { Authorization: `Bearer ${token.accessToken}` },
        });
        token.guilds = await res.json();
      }
      return token;
    },
    async session({ session, token }) {
      session.userId = token.sub;
      session.accessToken = token.accessToken;
      session.guilds = token.guilds;
      return session;
    },
  },
});
