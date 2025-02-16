// src/app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/dbconnect";
import User from "@/models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        await dbConnect();

        try {
          // Find user by email
          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            console.log("User not found");
            return null;
          }

          // Validate password
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValid) {
            console.log("Invalid password");
            return null;
          }

          console.log("User authenticated successfully:", user);
          return { id: user._id, name: user.name, email: user.email };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 1 day
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log("JWT callback - user:", user);
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session callback - token:", token);
      session.user = token;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signIn",
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token" // More secure name in production
          : "next-auth.session-token", // Normal name in development
      options: {
        httpOnly: false,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production", // Use secure cookies only in production
      },
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
