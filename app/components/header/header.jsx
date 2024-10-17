"use client";

import React, { useState } from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

const Header = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/authentication/login" });
  };

  return (
    <header className="bg-white shadow-md fixed top-0 right-0 left-16 h-16 flex items-center justify-between px-6 z-40">
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 relative">
          <Image
            src="/favicon.ico"
            alt="School Favicon"
            layout="fill"
            objectFit="contain"
          />
        </div>
        <div className="flex relative text-cyan-900 text-2xl hover:text-cyan-700">
          <Link href={`/`}>
            <b>Your School Name</b>
          </Link>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Link href={`/pages/notification/userNotification`}>
          <button className="text-gray-600 hover:text-cyan-500 relative">
            <FaBell className="text-xl" />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </button>
        </Link>
        <div className="relative">
          <button
            onMouseEnter={() => setIsProfileMenuOpen(true)}
            onMouseLeave={() => setIsProfileMenuOpen(false)}
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center space-x-2 text-gray-600 hover:text-cyan-500 focus:outline-none"
          >
            <FaUserCircle className="text-2xl" />
            <span className="hidden md:inline">
              {session?.user?.name || "n/a"}
            </span>
          </button>
          {isProfileMenuOpen && (
            <div
              className="flex flex-col absolute right-0 pt-2 w-48 bg-gray-50 text-cyan-500 rounded-md shadow-lg py-1 z-50"
              onMouseEnter={() => setIsProfileMenuOpen(true)}
              onMouseLeave={() => setIsProfileMenuOpen(false)}
            >
              <Link
                href="/pages/profile"
                className="rounded m-1 p-2 bg-white hover:text-cyan-800"
              >
                Profile
              </Link>
              <Link
                href="/pages/settings/settingshub"
                className="rounded m-1 p-2 bg-white hover:text-cyan-800"
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="rounded m-1 p-2 text-red-400 bg-white hover:text-red-800"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;