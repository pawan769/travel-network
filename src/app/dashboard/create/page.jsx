"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import DragDropUploader from "@/components/DragDropUploader.jsx";

import { toast } from "sonner";

// Leaflet imports
import dynamic from "next/dynamic";
import Image from "next/image.js";
import {
  setModalOpen,
  setRecommendedPosts,
} from "@/app/redux/slices/slices.js";
import { useDispatch, useSelector } from "react-redux";

// Dynamically import the map to prevent SSR issues
const LeafletMap = dynamic(() => import("./map/LeafletMap.js"), { ssr: false });

const CreatePost = ({}) => {
  const { data: session } = useSession();
  const [post, setPost] = useState({
    author: "",
    caption: "",
    images: [], // Store multiple images
    location: {},
    address: "",
    description: "",
  });
  const [images, setImages] = useState([]); // Store uploaded images
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [preview, setPreview] = useState([]); // Store multiple previews
  const [selectedLocation, setSelectedLocation] = useState(null);

  const dispatch = useDispatch();
  const recommendedPosts = useSelector((store) => store.app.recommendedPosts);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (session) {
      setPost((prevPost) => ({ ...prevPost, author: session.user.id }));
    }
  }, [session]);

  const handleCaptionChange = (e) => {
    setPost((prevPost) => ({ ...prevPost, caption: e.target.value }));
  };

  const handleAddressChange = (e) => {
    setPost((prevPost) => ({ ...prevPost, address: e.target.value }));
  };

  const handleDescriptionChange = (e) => {
    setPost((prevPost) => ({ ...prevPost, description: e.target.value }));
  };

  const handleImageSelect = (selectedImages) => {
    setImages(selectedImages);
    setPreview(selectedImages);
  };

  useEffect(() => {
    setIsDisabled(
      !(post.caption && images.length > 0 && selectedLocation && post.address)
    );
  }, [post.caption, images, selectedLocation, post.address]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsDisabled(true);
    setMessage("");

    if (images.length === 0) {
      setMessage("Please select at least one image.");
      return;
    }

    try {
      // Upload each image to Cloudinary
      const uploadedImages = await Promise.all(
        images.map(async (image) => {
          const response = await axios.post("/api/uploadImage", {
            image,
            username: session.user.name,
            folder: "posts",
          });

          if (response.data.url && response.data.public_id) {
            return {
              url: response.data.url,
              publicId: response.data.public_id,
            };
          } else {
            throw new Error("Image upload failed.");
          }
        })
      );

      // Create post in the backend
      const postResponse = await axios.post(
        "/api/createpost",
        {
          post: {
            ...post,
            images: uploadedImages, // Store all images
            location: selectedLocation,
          },
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setMessage(postResponse.data.message || "Post created successfully!");
      toast("Post created successfully", { variant: "success" });

      const newRecommendedPosts = [postResponse.data.post, ...recommendedPosts];
      dispatch(setRecommendedPosts(newRecommendedPosts));

      // Reset state
      setPost({ ...post, caption: "", images: [] });
      setPreview([]);
      setSelectedLocation(null);
    } catch (error) {
      console.error("Post creation failed:", error);
      setMessage("Failed to create post. Please try again.");
    } finally {
      dispatch(setModalOpen(false));
      setIsLoading(false);
      setIsDisabled(false);
    }
  };

  return (
    <div className="bg-gray-100 text-black absolute top-[50vh] left-[50vw] -translate-x-1/2 -translate-y-1/2 rounded-2xl p-3 select-none z-50">
      {step === 1 && (
        <div className="flex flex-col items-center gap-2 min-w-[400px] min-h-[400px]">
          <h1 className="font-bold text-4xl lg:text-5xl text-center">
            Create Post
          </h1>

          <div className="w-full flex  justify-end">
            <Button
              type="button"
              disabled={images.length === 0}
              variant="ghost"
              onClick={() => setStep(2)}
              className="text-blue-600 text-xl font-bold  disabled:text-blue-500"
            >
              Next
            </Button>
          </div>
          <DragDropUploader
            onImageSelect={handleImageSelect}
            preview={preview}
            setPreview={setPreview}
          />
          <h2 className="w-full px-5 font-medium">
            Note:{" "}
            <span className="font-normal">Size must be less than 10mb</span>
          </h2>
        </div>
      )}

      {step === 2 && (
        <div>
          <h1 className="font-bold text-7xl mb-8 text-center">
            Select Location
          </h1>
          <div className="flex justify-end">
            <Button
              type="button"
              disabled={!selectedLocation}
              variant="ghost"
              onClick={() => setStep(3)}
              className="text-blue-600 text-xl font-bold disabled:text-blue-500"
            >
              Next
            </Button>
          </div>
          <LeafletMap
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            setPost={setPost}
            post={post}
          />
        </div>
      )}

      {step === 3 && (
        <>
          <h1 className="font-bold text-7xl mb-3 text-center">
            Add Description
          </h1>
          <div className="flex flex-col space-y-5">
            <div>
              <label htmlFor="place" className="font-bold  px-3 text-xl">
                Where is this place
              </label>
              <Input
                type="text"
                name="place"
                value={post.address}
                onChange={handleAddressChange}
                placeholder="Place Name"
                className="mb-3"
              />
            </div>
            <div>
              <label htmlFor="caption" className="font-bold  px-3 text-xl">
                Give appropriate caption
              </label>
              <Input
                type="text"
                name="caption"
                value={post.caption}
                onChange={handleCaptionChange}
                placeholder="Caption"
                className="mb-3"
              />
            </div>
            <div>
              <label htmlFor="description" className="font-bold  px-3 text-xl">
                Write a detailed description
              </label>
              <Textarea
                value={post.description}
                name="description"
                onChange={handleDescriptionChange}
                placeholder="Description..."
                className="h-36"
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isDisabled}
                  onClick={submitHandler}
                  className="mt-10"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin size-4" />
                  ) : (
                    "Post"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CreatePost;
