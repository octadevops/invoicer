"use client";
import React, { useState } from "react";
import { HiOutlineBell, HiOutlineUserCircle } from "react-icons/hi2";
import Image from "next/image";
import NavLogo from "@/src/app/images/NLM LOGO.png";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const router = useRouter();

  // console.log("Username:", user?.username);
  // console.log("Role:", user?.role);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-800 shadow-lg p-4 flex justify-between items-center">
      <div className="text-lg font-bold">
        <Image src={NavLogo} alt="Logo" className="w-[200px]" unoptimized />
      </div>
      <div className="flex items-center space-x-4 text-white">
        {/* <input
          type="text"
          placeholder="Search..."
          className="border border-gray-400 rounded-md p-2 bg-transparent bg-blur"
        /> */}
        <div className="relative">
          <button className="focus:outline-none">
            <HiOutlineBell className="text-2xl font-semibold" />
          </button>
        </div>
        <div className="relative">
          {/* Profile Icon with Tooltip */}
          <button
            className="focus:outline-none"
            onClick={() => setTooltipVisible(!tooltipVisible)}
          >
            <HiOutlineUserCircle className="text-2xl font-semibold" />
          </button>

          {/* Tooltip Content */}
          {tooltipVisible && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg p-4 z-50 text-black">
              <div className="font-semibold capitalize">{user?.username}</div>
              <div className="pb-2 font-light">{user?.role}</div>

              <button
                onClick={handleLogout}
                className="font-semibold border border-red-500 text-red-500 w-full hover:text-white hover:bg-red-600 text-sm p-2 rounded-lg cursor-pointer duration-300 ease-in-out "
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
