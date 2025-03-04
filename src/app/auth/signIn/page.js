"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const Home = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [session, setSession] = useState(null); // Track session state
  const router = useRouter();

  useEffect(() => {
    // Check if a session already exists when the component mounts
    const fetchSession = async () => {
      const sessionData = await getSession();
      setSession(sessionData);
    };
    fetchSession();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false, // prevents automatic redirect
    });

    console.log("Login Result:", result);

    if (result?.error) {
      setError(result.error); // Display error if login fails
      setIsLoading(false);
    } else {
      // Check if session is available after sign-in
      const sessionData = await getSession();
      setSession(sessionData); // Update the session state
      console.log("Session after login:", sessionData);

      setTimeout(() => {}, 3000);

      if (sessionData) {
        router.push("/dashboard"); // Redirect to the dashboard if session exists
      } else {
        setError("Session not available, please try again.");
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (session) {
      router.push("/dashboard"); // If session exists, redirect immediately
    }
  }, [session, router]);

  return (
    <section className="h-screen min-w-[300px] flex justify-center items-center py-44 px-10 md:px-44">
      <div className="flex flex-col items-center justify-center min-w-[300px] min-h-[60%] flex-1 p-3">
        <h1 className="mb-4 text-4xl font-bold py-5 text-wrap">
          Sign in to your account
        </h1>
        <form
          onSubmit={submitHandler}
          className="max-w-[500px] w-full flex-1 flex flex-col items-center"
        >
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="mb-3"
          />
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="mb-4"
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : "Login"}
          </Button>
          <div className="text-sm my-3 text-center">
            Don’t have an account?{" "}
            <Link className="font-bold" href={"./register"}>
              Register
            </Link>
          </div>
          {error && (
            <p className="text-sm text-red-500 text-center">
              Incorrect Email or Password
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default Home;
