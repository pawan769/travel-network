"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import DragDropUploader from "@/app/dashboard/create/DragDropUploader";
import clsx from "clsx";
import { useToast } from "@/hooks/use-toast";

// Leaflet imports
import dynamic from "next/dynamic";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon } from "leaflet";

// Dynamically import the map to prevent SSR issues
const LeafletMap = dynamic(() => import("./map/LeafletMap.js"), { ssr: false });

const CreatePost = () => {
  const { data: session } = useSession();
  const [post, setPost] = useState({
    author: "",
    caption: "",
    image: {},
    location: {},
  });
  const [image, setImage] = useState(null);
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

            location: {...selectedLocation}, // Include location in the post
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
      setIsLoading(false);
      setIsDisabled(false);
    }
  };

  return (
    <div>
      <h1 className="font-bold text-7xl mb-8 text-center">Create Post</h1>
      <div>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-start-1 ">
            <div className="flex">
              <Input
                type="text"
                name="caption"
                value={post.caption}
                onChange={handleCaptionChange}
                placeholder="Please Enter Caption"
                required
                className="mb-3"
              />
            </div>
            <DragDropUploader
              onImageSelect={handleImageSelect}
              preview={preview}
              setPreview={setPreview}
            />
            <Button
              type="submit"
              disabled={isDisabled}
              className={clsx("transition-opacity duration-300", {
                "opacity-50 cursor-not-allowed": isDisabled,
                "opacity-100": !isDisabled,
              })}
              onClick={submitHandler}
            >
              {isLoading ? (
                <Loader2 className="animate-spin size-4" />
              ) : (
                <p>Post</p>
              )}
            </Button>
          </div>

          {/* Leaflet Map to Select Location */}
          <div className="mt-8 relative col-start-2">
            {selectedLocation && (
              <div>
                <p>
                  Location selected: {selectedLocation.lat},{" "}
                  {selectedLocation.lng}
                </p>
              </div>
            )}
            <LeafletMap
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
            />
          </div>
        </div>
      </div>
      {message && <div>{message}</div>}
    </div>
  );
};

export default CreatePost;
