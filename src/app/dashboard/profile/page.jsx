"use client";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";

import { useEffect, useState } from "react";
import getUserPosts from "@/app/utils/getUserPosts";
import ProfilePost from "./ProfilePost";
import { IoExitOutline } from "react-icons/io5";
import Image from "next/image";
import { useSelector } from "react-redux";
import Link from "next/link";

const Profile = () => {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState([]);
  const [profileToggle, setProfileToggle] = useState(false);

  const user = useSelector((state) => state.app.user);
  useEffect(() => {
    if (session?.user?.id) {
      const initialize = async () => {
        const userPosts = await getUserPosts(session.user.id);
        if (userPosts?.length != 0) {
          setPosts(userPosts);
        }
      };
      initialize();
    }
  }, [session]);

  const logoutHandler = async () => {
    console.log("signout");
    await signOut({ redirect: true, callbackUrl: "/auth/signIn" });
  };
  return (
    <div className="flex flex-col  gap-5  mt-14 md:mt-7 -z-10">
      <div className="flex flex-col">
        <section className=" flex flex-col ">
          <div className=" py-2 flex flex-col md:flex-row md:items-center md:justify-between md:space-x-5 space-y-5 md:pr-10 ">
            <div className="flex flex-col md:flex-row space-x-5 items-center">
              <Image
                src={
                  user.profilePic?.url
                    ? user.profilePic.url
                    : "/images/profilepic.jpg"
                }
                width={100}
                height={100}
                alt="pp"
                priority
                className="aspect-square rounded-full min-h-[150px] min-w-[150px] object-cover mx-auto md:mx-0"
              />
              <div className="flex flex-col space-y-3">
                <h1 className="text-6xl  font-semibold capitalize  text-center md:text-start">
                  {user.name}
                </h1>
                <p className="text-xl font-semibold w-full text-center md:text-left text-wrap">
                  {user.bio}
                </p>

                <h2 className="font-semibold text-md text-center w-full md:text-left">
                  {`${posts ? posts.length : 0} posts`}
                </h2>
              </div>
            </div>
            <Link
              href={`./profile/editProfile`}
              className="w-fit mx-auto bg-black/90 text-white py-2 px-4  text-md font-semibold rounded-md hover:bg-black/70"
            >
              Edit Profile
            </Link>
          </div>
        </section>
        <hr className="border border-black/50 my-2 md:mr-10" />
        <div className="flex justify-between items-center w-full pr-10 ">
          <h1 className="text-[3rem] capitalize">My Posts</h1>
          <div
            className="cursor-pointer relative"
            onClick={() => {
              setProfileToggle(!profileToggle);
            }}
          >
            <IoExitOutline size={36} />
            {profileToggle && (
              <div className="absolute right-0 top-full w-40 rounded-lg border-2 border-gray-300 bg-white transition-all duration-500">
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
      </div>

      <div className="flex  w-[100vw] md:w-[85vw] h-full  justify-evenly md:justify-start md:gap-8 gap-3 pr-3 flex-wrap ">
        {posts?.length != 0 ? (
          posts.map((post, index) => {
            return <ProfilePost post={post} key={index} />;
          })
        ) : (
          <div className="text-2xl mt-24 w-full text-center">
            Please create a post
          </div>
        )}
      </div>
    </div>
  );
};
export default Profile;
