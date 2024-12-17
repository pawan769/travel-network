"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import DragDropUploader from "@/app/dashboard/create/DragDropUploader";

import { useToast } from "@/hooks/use-toast";

// Leaflet imports
import dynamic from "next/dynamic";
import Image from "next/image.js";

// Dynamically import the map to prevent SSR issues
const LeafletMap = dynamic(() => import("./map/LeafletMap.js"), { ssr: false });

const CreatePost = ({ setModalOpen }) => {
  const { data: session } = useSession();
  const [post, setPost] = useState({
    author: "",
    caption: "",
    image: {},
    location: {},
  });
  const [image, setImage] = useState(null);
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [preview, setPreview] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null); // Store selected location

  const fileInputRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    if (session) {
      setPost((prevPost) => ({ ...prevPost, author: session.user.id }));
    }
  }, [session]);

  const handleCaptionChange = (e) => {
    setPost((prevPost) => ({ ...prevPost, caption: e.target.value }));
  };

  const handleImageSelect = (selectedImage) => {
    setImage(selectedImage);
  };
  const handleNextStep = () => {
    if (step >= 1 && step <= 3 && image) {
      setStep(step + 1); // Proceed to the next step (map) if an image is selected
    }
  };

  useEffect(() => {
    // Enable button only if both caption and image are provided
    setIsDisabled(!(post.caption && image && selectedLocation));
  }, [post.caption, image, selectedLocation]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsDisabled(true);
    setMessage("");

    if (!image) {
      setMessage("Please select an image.");
      return;
    }

    try {
      // Upload image to Cloudinary
      const imageResponse = await axios.post("/api/uploadImage", {
        image: image,
        username: session.user.name,
      });

      if (imageResponse.data.url && imageResponse.data.public_id) {
        setPost((prevPost) => ({
          ...prevPost,
          image: {
            url: imageResponse.data.url,
            publicId: imageResponse.data.public_id,
          },
        }));
      } else {
        setMessage("Image response didn't come!");
        return;
      }
      console.log(selectedLocation);
      // Create post in the backend
      const postResponse = await axios.post(
        "/api/createpost",
        {
          post: {
            ...post,
            image: {
              url: imageResponse.data.url,
              publicId: imageResponse.data.public_id,
            },

            location: selectedLocation, // Include location in the post
          },
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setMessage(postResponse.data.message || "Post created successfully!");
      toast({
        description: "Post is created successfully",
        variant: "success",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
      setPost({ ...post, caption: "", image: {} });
      setPreview(null);
      setSelectedLocation(null); // Clear location after post creation

    } catch (error) {
      console.error("Post creation failed:", error);
      setMessage("Failed to create post. Please try again.");
      setIsLoading(false);
      setIsDisabled(false);
    } finally {
      setModalOpen(false);
      setIsLoading(false);
      setIsDisabled(false);
    }
  };

  return (
    <div className=" m-auto ">
      {step === 1 && (
        <div className=" flex flex-col items-center gap-3 border-2 w-[40vw] border-red-500">
          <h1 className="font-bold text-7xl mb-8 text-center">Create Post</h1>
          <div className="bg-green-300 w-full  border-2 border-zinc-500">
            <DragDropUploader
              onImageSelect={handleImageSelect}
              preview={preview}
              setPreview={setPreview}
              className={"flex text-center w-full"}
            />
          </div>
          <Button
            type="button"
            disabled={!image}
            varient="ghost"
            onClick={handleNextStep}
          >
            Next
          </Button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h1 className="font-bold text-7xl mb-8 text-center">
            Select Location
          </h1>
          <LeafletMap
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            setPost={setPost}
            post={post}
          />
          <Button
            type="button"
            disabled={!selectedLocation}
            varient="ghost"
            onClick={handleNextStep}
          >
            Next
          </Button>
        </div>
      )}

      {/* Leaflet Map to Select Location */}

      {/* {selectedLocation && (
              <div>
                <p>
                  Location selected: {selectedLocation.lat},{" "}
                  {selectedLocation.lng}
                </p>
              </div>
            )} */}

      {step === 3 && (
        <div className="grid grid-cols-2 h-[60vh] w-[50vw] p-3">
          <Image
            src={preview}
            width={400}
            height={600}
            alt="Preview"
            className="col-span-1 border-2 border-red-500"
          />
          {console.log(selectedLocation)}
          <div className="col-span-1">
            <div className="flex justify-end mb-2">
              <Button
                type="submit"
                disabled={isDisabled}
                className={`transition-opacity duration-300 ", ${
                  isDisabled ? "opacity-50 cursor-not-allowed" : "opacity-100"
                }`}
                onClick={submitHandler}
                variant="ghost"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin size-4" />
                ) : (
                  <p>Post</p>
                )}
              </Button>
            </div>
            <Input
              type="text"
              name="caption"
              value={post.caption}
              onChange={handleCaptionChange}
              placeholder="Set a Location"
              required
              className="mb-3"
            />
            <Input
              type="text"
              name="caption"
              value={post.caption}
              onChange={handleCaptionChange}
              placeholder="Please Enter Caption"
              required
              className="mb-3"
            />
            <Textarea
              placeholder="Description..."
              value={post.caption}
              onChange={handleCaptionChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
