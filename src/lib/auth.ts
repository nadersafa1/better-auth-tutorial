import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/drizzle/db";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  sessions: {
    // cookieCache is used to enable caching of user sessions
    cookieCache: {
      enabled: true,
      maxAge: 60, // 1minute
    },
  },
  plugins: [
    // nextCookies makes sure that the application knows how to set cookies inside of next js on server side. so its required for nextjs
    nextCookies(),
  ],
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
});
