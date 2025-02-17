"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const Register = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/auth/register", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response) {
        setIsLoading(false);
      }

      if ((response.status = 200)) {
        toast("User registered successfully");
        router.push(`./register/addDetails/${response.data.userId}`);
        // Redirect to home page
      }
    } catch (e) {
      
      setError(e.response.data.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen ">
      <div className="flex flex-col justify-center space-y-2 min-w-[300px] w-[30vw] ">
        <h1 className=" text-3xl font-bold py-5  text-center">
          Register an account
        </h1>
        <form onSubmit={handleSubmit} className="w-full">
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
            className="mb-3"
          />
          <Input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
            className="mb-4"
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : "Continue"}
          </Button>
          <div className="text-sm my-3 text-center">
            Already have an account?{" "}
            <Link className="font-bold" href={"/auth/signIn"}>
              Login
            </Link>
          </div>
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
};
export default Register;
