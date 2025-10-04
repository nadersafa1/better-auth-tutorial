import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/drizzle/db";
import * as schema from "@/drizzle/schema";
import { sendEmailAction } from "@/actions/send-email.action";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: true,
    // sendResetPassword: async ({ user,url }) => {
    //  await sendPasswordResetEmail({user,url})
    // },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60 * 24, // 1 day
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmailAction({
        to: user.email,
        subject: "Email Verification",
        meta: {
          description: "Click the link below to verify your email",
          link: String(url),
        },
      });
    },
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
    schema,
  }),
});
