import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  
  try {
    const { image, username } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const uploadedImage = await cloudinary.uploader.upload(image, {
      folder: `posts/${username}`, // Optional: Save in a specific folder
    });
    
    if (!uploadedImage.public_id && !uploadedImage.secure_url) {
      return NextResponse.json(
        { error: "no cloudinary data" },
        { status: 500 }
      );
    }
    return NextResponse.json({
      url: uploadedImage.secure_url,
      public_id: uploadedImage.public_id,
    });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
  }
}
