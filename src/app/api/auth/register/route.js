// app/api/auth/register/route.js

import dbConnect from "@/lib/dbconnect.js";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ error: "User exists already!" }),
        {
          status: 400,
        }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    return new NextResponse(
      JSON.stringify({ message: "User registered successfully!" }),
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return new NextResponse(JSON.stringify({ error: "Registration failed" }), {
      status: 500,
    });
  }
}
