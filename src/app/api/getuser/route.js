import dbConnect from "@/lib/dbconnect";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { id } = await req.json(); // Extract the id from the request body

    if (!id) {
      return new NextResponse(
        JSON.stringify({
          error: "User ID is required",
          success: false,
        }),
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findById(id);

    if (!user) {
      return new NextResponse(
        JSON.stringify({
          error: "User does not exist",
          success: false,
        }),
        { status: 404 }
      );
    }

    const responseUser = {
        _id:user._id,
        name:user.name,
        email:user.email
    }

    return new NextResponse(
      JSON.stringify({
        user:responseUser,
        message: "User Found",
        success: true,
      }),
      { status: 200 }
    );
  } catch (error) {
    
    return new NextResponse(
      JSON.stringify({
        error: "Error occurred while fetching user data",
        success: false,
      }),
      { status: 500 }
    );
  }
}
