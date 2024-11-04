/* eslint-disable react/no-unescaped-entities */
"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
const Home = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
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
      redirect: false,
    });
    if (result) {
      setIsLoading(false);
    }

    if (result.error) {
      console.log(result);
      setError(result.error);
    } else {
      router.push("../dashboard");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="mb-4 text-2xl font-bold">Login</h1>
      <form onSubmit={submitHandler} className="w-96">
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
          Don't have an account?
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
  );
};

export default Home;
