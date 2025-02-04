"use client";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import getUserPosts from "@/app/utils/getUserPosts";

const Profile = () => {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    if (session?.user?.id) {
      const initialize = async () => {
        const userPosts = await getUserPosts(session.user.id);
        setPosts(userPosts);
      };
      initialize();
    }
  }, [session]);
  console.log(posts);

  const logoutHandler = async () => {
    console.log("signout");
    await signOut({ redirect: true, callbackUrl: "/auth/signIn" });
  };
  return (
    <div className="flex flex-col w-[100vw] md:w-[85vw] h-[100vh] mt-16 md:mt-0">
      <div className="flex  px-10 items-center gap-10">
        <h1 className="text-[9vw]  w-full  capitalize">
          {session?.user?.name}
        </h1>
        <div className="cursor-pointer" onClick={() => {}}>
          <Image
            src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="PP"
            className="md:w-16 md:h-16 w-10 h-10 rounded-full"
            height={10}
            width={10}
          />
        </div>
      </div>

      {posts.length != 0 ? (
        posts.map((post, index) => {
          return <div key={index}>{post.caption}</div>;
        })
      ) : (
        <div>Please create a post</div>
      )}
      <Button className="mx-5 w-[100px]" onClick={logoutHandler}>
        Logout
      </Button>
    </div>
  );
};
export default Profile;
