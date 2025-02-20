"use client";
import getUser from "@/app/utils/getUser";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { toast } from "sonner";
import Dragndrop from "./Dragndrop";

const EditProfile = () => {
  const [details, setDetails] = useState({
    profilePic: {},
    bio: "",
    gender: "",
  });
  const router = useRouter();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: session, status } = useSession();
  useEffect(() => {
    if (session?.user?.id) {
      const initialize = async () => {
        const user = await getUser(session.user.id);

        if (user._id) {
          setDetails({
            profilePic: user.profilePic,
            bio: user.bio,
            gender: user.gender,
          });
          setPreview(user.profilePic.url);
        }
      };
      initialize();
    }
  }, [session]);

  const handleImageSelect = (selectedImage) => {
    setImage(selectedImage);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Upload image to Cloudinary
      let imageResponse;
      if (image) {
        imageResponse = await axios.post("/api/uploadImage", {
          image: image,
          username: session.user.id.toString(),
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
          setIsLoading(false);
          return;
        }
      }

      // Create post in the backend
      const editResponse = await axios.post(
        "/api/editUser",
        {
          details: {
            ...details,
            profilePic: image
              ? {
                  url: imageResponse.data.url,
                  publicId: imageResponse.data.public_id,
                }
              : details.profilePic,
          },
          user_id: session.user.id,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      toast("User details updated successfully", { variant: "success" });

      setDetails({ ...details, profilePic: {}, bio: "", gender: "" });
      setPreview(null);
      setIsLoading(false);
      router.push("/dashboard/profile");
    } catch (error) {
      console.error("details update error", error);
      setIsLoading(false);
    }
  };

  return (
    <div className=" w-screen lg:w-[83vw] mt-[5vh] lg:mt-0 lg:pr-[15vh]  mx-auto ">
      <div className="flex flex-col items-center justify-center w-fit  min-h-screen pt-10 px-2 mx-auto ">
        <h1 className="mb-10 text-6xl font-bold w-full text-center">
          Edit Profile Details
        </h1>
        <div className="flex flex-col space-y-5 pb-10">
          <div className=" max-w-[400px] ">
            <h2 className="font-semibold text-lg text-left w-full mb-2">
              Change Profile Picture
            </h2>
            <Dragndrop
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
                Feeling new about yourself?
              </span>
              <textarea
                type="text"
                name="bio"
                value={details.bio}
                onChange={handleChange}
                placeholder="Add your description"
                className="w-full max-h-96 min-h-16 focus-visible:ring-transparent border border-black/20 rounded-sm"
              />
            </div>
            <div className="flex flex-col items-center space-y-2 w-full px-2">
              <span className="font-semibold text-lg text-left w-full ">
                Change your gender
              </span>
              <select
                name="gender"
                value={details.gender}
                onChange={handleChange}
                className=" p-2 border rounded-md w-full focus-visible:ring-transparent"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <Button
            className={`w-full mb-2 ${isLoading ? "disabled" : ""}`}
            onClick={submitHandler}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Submit"}
          </Button>
          <Link
            className="w-full font-bold flex space-x-2  justify-center"
            href={"./"}
          >
            <ArrowLeft />
            Go Back
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
