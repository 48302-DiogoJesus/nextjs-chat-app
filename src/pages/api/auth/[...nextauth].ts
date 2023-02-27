import NextAuth from "next-auth";

import GithubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

import prismaClient from "@/server/prisma/prismaclient";

const prisma = new PrismaClient();

const authOptions = NextAuth({
  secret: process.env.NEXTAUTH_SECRET!,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    // * Generate a random username for users that don't already have one (if used magic link to sign in)
    session: async ({ session }) => {
      if (session.user.name !== null) {
        return session;
      }

      const email = session.user.email;
      const nameParts = email.replace(/@.+/, "");
      let generatedName = nameParts.replace(
        /[&/\\#,+()$~%._@'":*?<>{}]/g,
        "",
      );
      // Capitalize
      generatedName = generatedName.charAt(0).toUpperCase() +
        generatedName.slice(1);

      await prismaClient.user.update({
        where: { email: email },
        data: { name: generatedName },
      });

      return {
        ...session,
        user: {
          ...session.user,
          name: generatedName,
        },
      };
    },
  },
  adapter: PrismaAdapter(prisma),
});

export default authOptions;
