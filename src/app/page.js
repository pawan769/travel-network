"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
  //   if (status === "unauthenticated" && !session) {
  //     router.push("./auth/signIn");
  //   } else if (status === "authenticated") {
  //     // console.log(status);
  //     if (status === "authenticated") {
  //       const fetchUser = async () => {
  //         try {
  //           const userDetails = await getUser(session.user.id);
  //           // Dispatch to Redux or set state only if user data is valid
  //           if (userDetails) {
  //             dispatch(setUser(userDetails));
  //           }
  //         } catch (error) {
  //           console.error("Failed to fetch user:", error);
  //         }
  //       };

  //       fetchUser(); // Call async function
  //     }
      return router.push("./dashboard");
    // }
  });
};

export default Page;
