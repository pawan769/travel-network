import dbConnect from "@/lib/dbconnect.js";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { details, user_id } = await req.json();
    const { profilePic, bio, gender } = details;

    await dbConnect();

    // Ensure profilePic is an object before updating
    const updateData = { bio, gender };

    if (profilePic && profilePic.url && profilePic.publicId) {
      updateData.profilePic = {
        url: profilePic.url,
        publicId: profilePic.publicId,
      };
    }

    const updatedUser = await User.findByIdAndUpdate(user_id, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("updatedUser", updatedUser);

    return NextResponse.json(
      { message: "User details updated successfully!", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user details:", error);
    return NextResponse.json(
      { error: "Details update failed" },
      { status: 500 }
    );
  }
}
