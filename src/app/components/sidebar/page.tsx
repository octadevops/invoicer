// components/Sidebar.js
import Link from "next/link";
import React from "react";
import {
  HiOutlineClipboardDocumentList,
  HiOutlineUserGroup,
  HiOutlineUsers,
} from "react-icons/hi2";

const Sidebar = () => {
  const sidebarData = [
    {
      label: "Invoices",
      path: "/invoices",
      icon: <HiOutlineClipboardDocumentList />,
    },
    {
      label: "Suppliers",
      path: "/suppliers",
      icon: <HiOutlineUserGroup />,
    },
    {
      label: "Users",
      path: "/users",
      icon: <HiOutlineUsers />,
    },
    {
      label: "Master Records",
      path: "/MasterRecords",
      icon: <HiOutlineUsers />,
    },
  ];

  return (
    <aside className="w-64 bg-slate-800 min-h-screen py-4 px-6 text-slate-100">
      <ul className="space-y-2">
        {sidebarData.map((item, index) => (
          <li key={item.label}>
            <Link
              href={item.path}
              className="flex gap-4 p-2 hover:bg-gray-300 duration-500 ease-in-out rounded hover:text-gray-800"
            >
              <span className="text-xl ">{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
