import React from "react";
import { HiOutlineBell, HiOutlineUserCircle } from "react-icons/hi2";
import Image from "next/image";
import Logo from "@/src/app/images/NLM LOGO.png";

export default function Navbar() {
  return (
    <nav className="bg-slate-800 shadow-lg p-4 flex justify-between items-center">
      <div className="text-lg font-bold">
        <Image src={Logo} alt="Logo" width={200} height={10} className="" />
      </div>
      <div className="flex items-center space-x-4 text-white">
        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-400 rounded-md p-2 bg-transparent bg-blur"
        />
        <div className="relative">
          <button className="focus:outline-none">
            <HiOutlineBell className="text-2xl font-semibold" />
          </button>
        </div>
        <div className="relative">
          <button className="focus:outline-none">
            <HiOutlineUserCircle className="text-2xl font-semibold" />
          </button>
        </div>
      </div>
    </nav>
  );
}
