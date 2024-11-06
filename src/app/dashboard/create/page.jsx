"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const CreatePost = () => {
  const { data: session, status } = useSession();

  const [post, setPost] = useState({
    author: "",
    caption: "",
  });
  const [message, setMessage] = useState("");
  useEffect(() => {
    setPost({ ...post, author: session ? session.user.id : null });
  }, [session,post]);

  const handleChange = (e) => {
    setPost({ ...post, caption: e.target.value });
  };
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("../api/createpost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      });

      if (response.ok) {
        const responseData = await response.json();
        setMessage(responseData.message);
      }
    } catch (error) {
      throw new Error("post creation failed");
    } finally {
      setPost({ ...post, caption: "" });
    }
  };
  return (
    <div>
      <form onSubmit={submitHandler}>
        <Input
          type="text"
          name="caption"
          value={post.caption}
          onChange={handleChange}
          placeholder="Caption"
          required
          className="mb-3"
        ></Input>
        <Button type="submit">Post</Button>
      </form>
      {message && <div>{message}</div>}
    </div>
  );
};
export default CreatePost;
