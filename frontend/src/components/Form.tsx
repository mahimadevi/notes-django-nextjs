"use client";
import { useState, FormEvent } from "react";
import api from "../api";
import { useRouter } from "next/navigation";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import LoadingIndicator from "./LoadingIndicator";

interface FormProps {
  route: string;
  method: "login" | "register";
}

function Form({ route, method }: FormProps) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post(route, { username, password });

      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

        window.location.href = "/home";
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      alert(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center mx-auto my-12 p-5 rounded-lg shadow-md max-w-md"
    >
      <h1 className="text-2xl font-bold mb-4">
        {method === "login" ? "Login" : "Register"}
      </h1>
      <input
        className="w-[90%] p-2.5 my-2 border border-gray-300 rounded-md"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        className="w-[90%] p-2.5 my-2 border border-gray-300 rounded-md"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {loading && <LoadingIndicator />}
      <button
        className="w-[95%] p-2.5 my-5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        type="submit"
        disabled={loading}
      >
        {method === "login" ? "Login" : "Register"}
      </button>
    </form>
  );
}

export default Form;
