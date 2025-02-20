// app/api/auth/register/route.js

import dbConnect from "@/lib/dbconnect.js";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req) {
  console.log("yeah");
  try {
    const body = await req.json();
    const { name, email, password } = body;
    console.log(name, email, password);

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User exists already!" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
     
    });

    return NextResponse.json(
      { message: "User registered successfully!", userId: user._id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
