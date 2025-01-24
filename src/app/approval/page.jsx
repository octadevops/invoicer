"use client";

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getApprovalDocuments,
  updateDocumentStatus,
} from "../services/approvalService";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ApprovalPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [documents, setDocuments] = useState([]);
  const [columns, setColumns] = useState([]);
  const [pinModal, setPinModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [enteredPin, setEnteredPin] = useState("");
  const [actionType, setActionType] = useState("");

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const fetchDocuments = async () => {
    if (!user) {
      toast.error("No user found.");
      return;
    }

    try {
      const username = user?.username || "";
      let response;

      if (user.role === "Receiver") {
        response = await getApprovalDocuments(3, username);
      } else {
        response = await getApprovalDocuments(3);
      }

      if (response && response.length > 0) {
        setDocuments(response);
        setColumns(Object.keys(response[0]));
      } else {
        setDocuments([]);
        setColumns([]);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Failed to fetch documents.");
    }
  };

  useEffect(() => {
    if (user) {
      if (
        user.role === "Administrator" ||
        user.role === "Manager" ||
        user.role === "Receiver"
      ) {
        fetchDocuments();
      } else {
        toast.error("Unauthorized Access.");
      }
    } else {
      toast.error("No user logged in.");
    }
  }, [user]);

  // Decode the JWT token
  const decodeJwt = (token) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  };

  // Check token expiration and call logout if invalid
  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        toast.error("No authentication token found. Redirecting to login.");
        logout();
        return;
      }

      try {
        const decodedToken = decodeJwt(token);
        const exp = decodedToken.exp * 1000;
        const currentTime = Date.now();

        if (exp < currentTime) {
          localStorage.removeItem("authToken");
          toast.error("Session expired. Redirecting to login.");
          logout();
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        toast.error("Invalid authentication token. Redirecting to login.");
        localStorage.removeItem("authToken");
        logout();
      }
    };

    checkTokenExpiration();
  }, [logout]);

  return (
    <div>
      <ToastContainer />
      <h2 className="text-lg font-semibold mb-4">Approval Process</h2>

      {documents.length > 0 ? (
        <div className="overflow-x-auto w-full rounded-xl">
          <table className="w-full table-auto border-collapse border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-600 text-white text-sm uppercase font-medium">
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-4 py-2 border border-gray-300 text-left min-w-48"
                  >
                    {col.replace(/_/g, " ")}
                  </th>
                ))}
                <th className="px-4 py-2 border border-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr
                  key={doc.id}
                  className="bg-slate-100 hover:bg-gray-200 text-left min-w-48"
                >
                  {console.log(doc.status)}
                  {columns.map((col) => (
                    <td
                      key={`${doc.id}-${col}`}
                      className="px-4 py-2 border border-gray-300"
                    >
                      {String(doc[col]) || "-"}
                    </td>
                  ))}
                  <td className=" px-6 py-2 border border-gray-300">
                    {doc.status === "1" ? (
                      <div className="flex items-center justify-center gap-3 px-3">
                        <button
                          onClick={() => {
                            setSelectedDoc(doc);
                            setActionType("receive");
                            setPinModal(true);
                          }}
                          className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-500 w-full"
                        >
                          Receive
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDoc(doc);
                            setActionType("paymentReady");
                            setPinModal(true);
                          }}
                          className="px-3 py-1 bg-gray-400 text-white rounded cursor-not-allowed min-w-fit"
                          disabled
                        >
                          Payment Ready
                        </button>
                      </div>
                    ) : doc.status === "2" ? (
                      <div className="flex items-center justify-center gap-3 px-3">
                        <button
                          onClick={() => {
                            setSelectedDoc(doc);
                            setActionType("receive");
                            setPinModal(true);
                          }}
                          className="px-3 py-1 bg-gray-400 text-white rounded cursor-not-allowed w-full"
                          disabled
                        >
                          Receive
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDoc(doc);
                            setActionType("paymentReady");
                            setPinModal(true);
                          }}
                          className="px-3 py-1 bg-yellow-300 text-white rounded hover:bg-yellow-400 min-w-fit"
                        >
                          Payment Ready
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No pending documents to approve.</p>
      )}

      {/* PIN Validation Modal */}
      {pinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-sm">
            <h3 className="text-lg font-semibold mb-4">
              {actionType === "paymentReady"
                ? "Enter PIN to Mark as Payment Ready"
                : "Enter PIN to Mark as Received"}
            </h3>
            <input
              type="password"
              value={enteredPin}
              onChange={(e) => setEnteredPin(e.target.value)}
              className="block w-full border border-gray-300 rounded py-2 px-3 mb-4"
              placeholder="Enter your PIN"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setPinModal(false)}
                className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAction}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-500"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
