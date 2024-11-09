"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const Register = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (response) {
      setIsLoading(false);
    }

    if (response.ok) {
     
      router.push("./signIn");
      // Redirect to home page
    } else {
      const errorData = await response.json();
      console.error("Registration error:", errorData);
      setError(errorData.error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="mb-4 text-2xl font-bold">Register</h1>
      <form onSubmit={handleSubmit} className="w-96">
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
          className="mb-3"
        />
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
          {isLoading ? <Loader2 className="animate-spin" /> : "Register"}
        </Button>
        <div className="text-sm my-3 text-center">
          Already have an account?{" "}
          <Link className="font-bold" href={"./signIn"}>
            Login
          </Link>
        </div>
        {error ? (
          <div>
            <p className="text-red-500 text-center text-sm">{error}</p>
          </div>
        ) : null}
      </form>
    </div>
  );
};

export default Register;
