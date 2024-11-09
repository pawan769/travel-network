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

        // Find user by email
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          // Return null if the user is not found
          throw new Error("No user found with this email");
        }

        // Validate password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        
        if (!isValid) {
          // Return null if the password does not match
          throw new Error("Incorrect password");
        }

        // Return user object if authentication is successful
        return { id: user._id, name: user.name, email: user.email };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signIn",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
