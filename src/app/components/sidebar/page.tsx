"use client";

import Link from "next/link";
import React, { useState } from "react";
import {
  HiOutlineBars3BottomRight,
  HiOutlineBars4,
  HiOutlineCheckCircle,
  HiOutlineClipboardDocumentList,
  HiOutlineDocumentChartBar,
  HiOutlineDocumentText,
  HiOutlineRectangleGroup,
  HiOutlineUserGroup,
  HiOutlineUsers,
} from "react-icons/hi2";
import { useAuth } from "@/src/context/AuthContext"; // Import useAuth to access user context
import { usePathname } from "next/navigation";
import { HiOutlineCollection } from "react-icons/hi";
import { LuFileCheck } from "react-icons/lu";

const Sidebar = () => {
  const { user } = useAuth(); // Get the current user from the context
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  // Define the sidebar menu items with roles that are allowed to view them
  const sidebarData = [
    {
      label: "Dashboard",
      path: "/",
      icon: <HiOutlineRectangleGroup />,
      roles: ["Administrator", "Executive", "Manager", "Receiver"], // Allowed roles
    },
    {
      label: "Invoices",
      path: "/invoices",
      icon: <HiOutlineClipboardDocumentList />,
      roles: ["Administrator", "Executive", "Manager"], // Allowed roles
    },
    {
      label: "Suppliers",
      path: "/suppliers",
      icon: <HiOutlineUserGroup />,
      roles: ["Administrator", "Executive", "Manager"], // Only Administrators can see this
    },
    {
      label: "Users",
      path: "/users",
      icon: <HiOutlineUsers />,
      roles: ["Administrator"], // Only Administrators can see this
    },
    {
      label: "Reports",
      path: "/reports",
      icon: <HiOutlineDocumentChartBar />,
      roles: ["Administrator", "Executive", "Manager"], // Only Administrators can see this
    },
    {
      label: "Approval",
      path: "/approval",
      icon: <HiOutlineCheckCircle />,
      roles: ["Administrator", "Receiver", "Manager"], // Only Receivers can see this
    },
    {
      label: "Collection",
      path: "/collections",
      icon: <HiOutlineCollection />,
      roles: ["Administrator", "Cashier", "Manager"], // Only Receivers can see this
    },
    {
      label: "Purchase Order",
      path: "/po",
      icon: <HiOutlineDocumentText />,
      roles: ["Administrator", "Executive", "Manager"], // Only Receivers can see this
    },
    {
      label: "PO Approval",
      path: "/po-approvals",
      icon: <LuFileCheck />,
      roles: ["Administrator", "Manager"], // Only Receivers can see this
    },
  ];

  // Render sidebar items based on the user's role
  return (
    <aside
      className={`sticky  left-0 top-0 ${
        collapsed ? "w-16" : "w-64"
      } bg-slate-800 h-screen py-4 px-2 text-slate-100 transition-all duration-300`}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mb-4 px-2 py-1   text-white rounded w-full flex items-center justify-end"
      >
        {collapsed ? (
          <HiOutlineBars3BottomRight className="w-6 h-6 text-xl hover:bg-gray-600 rounded" />
        ) : (
          <p className="flex items-center justify-between w-full">
            Menus
            <HiOutlineBars4 className="w-6 h-6 text-xl hover:bg-gray-600 rounded" />
          </p>
        )}
      </button>
      <ul className="space-y-2">
        {sidebarData.map(
          (item) =>
            user &&
            item.roles.includes(user.role) && ( // Check if user role is allowed
              <li key={item.label} className="relative group">
                <Link
                  href={item.path}
                  className={`flex items-center gap-4 px-4 py-2 rounded ${
                    pathname === item.path
                      ? "bg-gray-500 text-white"
                      : "hover:bg-gray-300 hover:text-gray-800"
                  } duration-300`}
                >
                  <span className="text-xl text-center">{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </Link>
                {collapsed && (
                  <span className="absolute  left-full top-1/2 transform -translate-y-1/2 ml-3 bg-gray-700 text-white text-sm rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </li>
            )
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;
