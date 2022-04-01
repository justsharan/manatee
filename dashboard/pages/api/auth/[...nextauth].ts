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
    jwt: ({ token, account }) =>
      account ? { accessToken: account.access_token, ...token } : token,
    session: ({ session, token }) => ({
      id: token.sub,
      accessToken: token.accessToken,
      ...session,
    }),
  },
});
