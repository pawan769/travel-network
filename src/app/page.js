"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
const Home = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const submitHandler = () => {
    console.log("submit handler clicked!");
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
        <Button type="submit" className="w-full">
          Login
        </Button>
        <div className="text-sm my-3 text-center">
          Don't have an account? <Link className="font-bold" href={"./auth/register"}>Register</Link>
        </div>
      </form>
    </div>
  );
};

export default Home;
