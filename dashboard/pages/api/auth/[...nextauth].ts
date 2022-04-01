import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

export default NextAuth({
  providers: [
    Discord({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      authorization:
        "https://discord.com/api/oauth2/authorize?scope=identify+guilds",
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, account }) => {
      if (account) token.accessToken = account.access_token;
      if (!token.guilds) {
        const res = await fetch(
          "https://discord.com/api/v10/users/@me/guilds",
          {
            headers: {
              Authorization: `Bearer ${account.access_token}`,
            },
          }
        );
        if (res.ok) {
          token.guilds = await res.json();
        }
      }
      return token;
    },
    session: ({ session, token }) => ({
      id: token.sub,
      accessToken: token.accessToken,
      guilds: token.guilds,
      ...session,
    }),
  },
});
