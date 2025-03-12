"use client";

import Image from "next/image";
import React from "react";

function SessionAlert({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <div className="w-full h-48 flex justify-center mb-4">
          <Image
            src="https://ik.imagekit.io/nlmcdn/INVOICER/sessionEnd.gif?updatedAt=1741063187166"
            width={240}
            height={100}
            alt="Session Expired"
            priority
            unoptimized
          />
        </div>
        <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
          Oops!!! Session Expired
        </h2>
        <p className="mb-6 text-gray-600 text-center">
          Your session has expired due to inactivity. Please log in again.
        </p>
        <button
          onClick={() => {
            onClose?.();
            window.location.reload();
          }}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200"
        >
          Okay
        </button>
      </div>
    </div>
  );
}

export default SessionAlert;
