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
import { setRecommendedPosts } from "@/app/redux/slices/slices.js";
import { useDispatch, useSelector } from "react-redux";

// Dynamically import the map to prevent SSR issues
const LeafletMap = dynamic(() => import("./map/LeafletMap.js"), { ssr: false });

const CreatePost = ({ setModalOpen }) => {
  const { data: session } = useSession();
  const [post, setPost] = useState({
    author: "",
    caption: "",
    image: {},
    location: {},
    address: "",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [preview, setPreview] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null); // Store selected location
  const dispatch = useDispatch();
  const recommendedPosts = useSelector((store) => store.app.recommendedPosts);

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
  const handleAddressChange = (e) => {
    setPost((prevPost) => ({ ...prevPost, address: e.target.value }));
  };
  const handleDescriptionChange = (e) => {
    setPost((prevPost) => ({ ...prevPost, description: e.target.value }));
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
    setIsDisabled(!(post.caption && image && selectedLocation && post.address));
  }, [post.caption, image, selectedLocation, post.address]);

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
      console.log(post);
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

      const newRecommendedPosts = [postResponse.data.post, ...recommendedPosts];
      dispatch(setRecommendedPosts(newRecommendedPosts));

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
    <div className="  bg-gray-100 text-black absolute top-[50vh] left-[50vw] -translate-x-1/2 -translate-y-1/2 rounded-2xl z-30 p-3 select-none ">
      <div className="w-full flex justify-end px-2  ">
        <div
          className="w-10 h-10 flex items-center justify-center cursor-pointer "
          onClick={() => setModalOpen(false)}
        >
          <span>X</span>
        </div>
      </div>
      {step === 1 && (
        <div className=" flex flex-col items-center gap-2 min-w-[400px]  min-h-[400px]  ">
          <h1 className="font-bold text-4xl lg:text-5xl text-center ">
            Create Post
          </h1>
          <div className="flex justify-end  w-full ">
            <Button
              type="button"
              disabled={!image}
              variant="ghost"
              onClick={handleNextStep}
              className="text-blue-600 text-xl font-bold disabled:text-blue-500"
            >
              Next
            </Button>
          </div>
          <div className=" h-full w-full  ">
            <DragDropUploader
              onImageSelect={handleImageSelect}
              preview={preview}
              setPreview={setPreview}
              className={"flex text-center"}
            />
          </div>
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
              onClick={handleNextStep}
              className="text-blue-600 text-xl font-bold disabled:text-blue-500"
            >
              Next
            </Button>
          </div>
          <div>
            <LeafletMap
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              setPost={setPost}
              post={post}
              className="w-full"
            />
          </div>
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
        <>
          <h1 className="font-bold text-7xl mb-3 md:mb-8 text-center">
            Add Description
          </h1>
          <div className="flex flex-col justify-center items-center md:grid md:grid-cols-2  w-[50vw] p-3 min-w-[400px]">
            <div className="flex items-center justify-center">

            <Image
              src={preview}
              width={400}
              height={600}
              alt="Preview"
              className="md:col-span-1 border-2 min-w-[200px] max-h-[450px] object-cover"
            />
            </div>
            
            <div className="md:col-span-1 w-full sm:mt-3">
              <Input
                type="text"
                name="caption"
                value={post.address}
                onChange={handleAddressChange}
                placeholder="Name of the Place"
                required
                className="mb-3 p-4"
              />
              <Input
                type="text"
                name="caption"
                value={post.caption}
                onChange={handleCaptionChange}
                placeholder="Please Enter Caption"
                required
                className="mb-3 p-4"
              />
              <Textarea
                placeholder="Description..."
                value={post.description}
                onChange={handleDescriptionChange}
                className=" h-12 md:h-36 overflow-y-auto focus-visible:ring-transparent"
              />
            <div className="flex justify-end mb-2">
              <Button
                type="submit"
                disabled={isDisabled}
                className={`transition-opacity duration-300 border-2 border-black mt-10 ", ${
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
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CreatePost;
