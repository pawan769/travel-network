"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Loader2 } from "lucide-react";

const CreatePost = () => {
  const { data: session } = useSession();
  const [post, setPost] = useState({ author: "", caption: "", image: {} });
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (session) {
      setPost((prevPost) => ({ ...prevPost, author: session.user.id }));
    }
  }, [session]);

  const handleCaptionChange = (e) => {
    setPost((prevPost) => ({ ...prevPost, caption: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Image = reader.result; // This is the Data URL
      setImage(base64Image);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
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
      console.log(imageResponse);
      if (imageResponse.data.url && imageResponse.data.public_id) {
        setPost((prevPost) => ({
          ...prevPost,
          image: {
            url: imageResponse.data.url,
            publicId: imageResponse.data.public_id,
          },
        }));
      } else {
        setMessage("image response didnt came!");
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
          },
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setMessage(postResponse.data.message || "Post created successfully!");
      fileInputRef.current.value = null;
      setPost({ ...post, caption: "", image: {} });
    } catch (error) {
      console.error("Post creation failed:", error);
      // setMessage("Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <Input
          type="text"
          name="caption"
          value={post.caption}
          onChange={handleCaptionChange}
          placeholder="Caption"
          required
          className="mb-3"
        />
        <Input
          type="file"
          onChange={handleImageChange}
          required
          ref={fileInputRef}
          className="mb-3"
          
        />
        <Button type="submit">
          {isLoading ? (
            <Loader2 className="animate-spin size-4" />
          ) : (
            <p>Post</p>
          )}
        </Button>
      </form>
      {message && <div>{message}</div>}
    </div>
  );
};

export default CreatePost;
