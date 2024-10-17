"use client";

import React, { useState, useEffect } from "react";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [disableBtn, setDisableBtn] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" || !session) {
      // window.location.href = "/";
      // router.push('/')
    }
  }, [status]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setDisableBtn(true)
    console.log("user log in data", email, password);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(`Invalid email or password ${result.error}`);
      } else {
        window.location.href = "/";
        // router.push('/')
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
    }finally{setDisableBtn(false)}
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen h-full flex items-center justify-center bg-gray-100 w-full">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-cyan-800">
        <h1 className="text-3xl font-bold mb-6 text-cyan-700 text-center">
          School Management System
        </h1>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-cyan-600 mb-2">
              username/email
            </label>
            <div className="flex items-center border rounded">
              <FaUser className="text-gray-400 ml-2" />
              <input
                type="text"
                id="email"
                className="w-full p-2 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-cyan-600 mb-2">
              Password
            </label>
            <div className="flex items-center border rounded">
              <FaLock className="text-gray-400 ml-2" />
              <input
                type="password"
                id="password"
                className="w-full p-2 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={disableBtn}
            className={`w-full  text-white p-2 rounded  flex items-center justify-center ${
              disableBtn
                ? "bg-gray-300 hover:bg-gray-300"
                : "bg-cyan-700 hover:bg-cyan-600"
            }`}
          >
            <FaSignInAlt className="mr-2" /> Login
          </button>
        </form>
        {/* <div className="mt-4 text-center">
          <span className="text-gray-600">Don't have an account? </span>
          <Link
            href="/authentication/signUp"
            className="text-cyan-600 hover:underline"
          >
            Sign Up
          </Link>
        </div>
        <div className="mt-4 text-center">
          <Link
            href="/authentication/forgotpassword"
            className="text-cyan-600 hover:underline"
          >
            Forgot Password?
          </Link>
        </div> */}
      </div>
    </div>
  );
};

export default Login;
