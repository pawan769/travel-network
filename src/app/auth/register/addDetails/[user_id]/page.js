"use client";
import DragAndDropUploader from "@/components/DragDropUploader";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const AddDetails = () => {
  const router = useRouter();
  const { user_id } = useParams();

  const [details, setDetails] = useState({
    profilePic: {},
    bio: "",
    gender: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageSelect = (selectedImage) => {
    setImage(selectedImage);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      // Upload image to Cloudinary
      const imageResponse = await axios.post("/api/uploadImage", {
        image: image,
        username: user_id.toString(),
        folder: "user",
      });

      if (imageResponse.data.url && imageResponse.data.public_id) {
        setDetails((prevDetail) => ({
          ...prevDetail,
          profilePic: {
            url: imageResponse.data.url,
            publicId: imageResponse.data.public_id,
          },
        }));
      } else {
        return;
      }

      // Create post in the backend
      const editResponse = await axios.post(
        "/api/editUser",
        {
          details: {
            ...details,
            profilePic: {
              url: imageResponse.data.url,
              publicId: imageResponse.data.public_id,
            },
          },
          user_id: user_id,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      toast({
        description: "User details is updated successfully",
        variant: "success",
      });

      setDetails({ ...details, profilePic: {}, bio: "", gender: "" });
      setPreview(null);
      router.push("/dashboard");
    } catch (error) {
      console.error("details update error", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen pt-10 px-2 ">
      <h1 className="mb-10 text-6xl font-bold">Add Profile Details</h1>
      <div className="flex flex-col space-y-5 pb-10">
        <div className=" max-w-[400px] ">
          <h2 className="font-semibold text-lg text-left w-full mb-2">
            Choose Profile Picture
          </h2>
          <DragAndDropUploader
            onImageSelect={handleImageSelect}
            preview={preview}
            setPreview={setPreview}
            className={"flex text-center"}
          />
        </div>
        <hr className="border border-black/50" />
        <div className="flex flex-col space-y-5 items-center py-5">
          <div className="flex flex-col items-center space-y-2 w-full px-2">
            <span className="font-semibold text-lg text-left w-full ">
              Write something about yourself
            </span>
            <textarea
              type="text"
              name="bio"
              value={details.bio}
              onChange={handleChange}
              placeholder="Add your description"
              className="w-full max-h-96 focus-visible:ring-transparent border border-black/20 rounded-sm"
            />
          </div>
          <div className="flex flex-col items-center space-y-2 w-full px-2">
            <span className="font-semibold text-lg text-left w-full ">
              Select your gender
            </span>
            <select
              name="gender"
              value={details.gender}
              onChange={handleChange}
              className=" p-2 border rounded-md w-full"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <Button className="w-full mb-2" onClick={submitHandler}>
          Submit
        </Button>
        <Button
          className="w-full"
          variant="secondary"
          onClick={() => router.push("/dashboard")}
        >
          Skip
        </Button>
      </div>
    </div>
  );
};

export default AddDetails;
