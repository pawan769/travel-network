"use client";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import getUserPosts from "@/app/utils/getUserPosts";
import ProfilePost from "./ProfilePost";

const Profile = () => {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState([]);
  const [profileToggle, setProfileToggle] = useState(false);
  useEffect(() => {
    if (session?.user?.id) {
      const initialize = async () => {
        const userPosts = await getUserPosts(session.user.id);
        setPosts(userPosts);
      };
      initialize();
    }
  }, [session]);

  const logoutHandler = async () => {
    console.log("signout");
    await signOut({ redirect: true, callbackUrl: "/auth/signIn" });
  };
  return (
    <div className="flex flex-col w-[100vw] md:w-[85vw] md:ml-[5vw] h-[100vh] mt-16 md:mt-0 -z-10">
      <div className="flex justify-between  items-center w-[80%]">
        <h1 className="text-[9vw]    capitalize">My Posts</h1>
        <div
          className="cursor-pointer relative"
          onClick={() => {
            setProfileToggle(!profileToggle);
          }}
        >
          <Image
            src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="PP"
            className="md:w-16 md:h-16 w-8 h-8 rounded-full"
            height={10}
            width={10}
          />
          {profileToggle && (
            <div className="absolute right-12 top-8 w-40 rounded-lg border-2 border-gray-300 bg-white transition-all duration-500">
              <Button
                className=" w-full"
                variant="ghost"
                onClick={logoutHandler}
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex  w-[100vw] md:w-[85vw] h-full  justify-evenly md:justify-start md:gap-8 gap-3 pr-3 flex-wrap ">
        {posts.length != 0 ? (
          posts.map((post, index) => {
            return <ProfilePost post={post} key={index} />;
          })
        ) : (
          <div className="text-2xl mt-24">Please create a post</div>
        )}
      </div>
    </div>
  );
};
export default Profile;
