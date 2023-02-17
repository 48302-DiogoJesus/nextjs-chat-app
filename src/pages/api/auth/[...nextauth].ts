import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

const authOptions = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
});

export default authOptions;
