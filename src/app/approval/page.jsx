"use client";

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getApprovalDocuments,
  updateDocumentStatus,
} from "../services/approvalService";
import { useAuth } from "@/src/context/AuthContext";

export default function ApprovalPage() {
  const { user } = useAuth(); // Logged-in user
  const [documents, setDocuments] = useState([]);
  const [columns, setColumns] = useState([]);
  const [pinModal, setPinModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null); // Document to approve
  const [enteredPin, setEnteredPin] = useState(""); // PIN entered by user
  const [actionType, setActionType] = useState("");

  const fetchDocuments = async () => {
    if (!user) {
      toast.error("No user found.");
      return;
    }

    try {
      const username = user?.username || "";
      let response;

      // Fetch documents based on user role
      if (user.role === "Receiver") {
        // For Receiver, only fetch documents related to their user ID
        response = await getApprovalDocuments(3, username);
      } else {
        // For Administrator or Manager, fetch all documents
        response = await getApprovalDocuments(3);
      }

      if (response && response.length > 0) {
        setDocuments(response);
        setColumns(Object.keys(response[0])); // Extract keys as column names
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
      // Restrict access based on user roles
      if (
        user.role === "Administrator" ||
        user.role === "Manager" ||
        user.role === "Receiver"
      ) {
        fetchDocuments();
      } else {
        toast.error("Unauthorized Access.");
        setLoading(false);
      }
    } else {
      toast.error("No user logged in.");
      setLoading(false);
    }
  }, [user]);

  // Handle approval process
  const handleAction = async () => {
    if (!selectedDoc || !enteredPin) {
      toast.error("Please enter your PIN.");
      return;
    }

    try {
      const requiredStatus = actionType === "paymentReady" ? "2" : "1"; // Check required status
      if (selectedDoc.status !== requiredStatus) {
        toast.error(
          `Cannot mark as ${
            actionType === "paymentReady" ? "Payment Ready" : "Received"
          } without completing the previous step.`
        );
        return;
      }

      const response = await updateDocumentStatus(selectedDoc.id, enteredPin);
      if (response.success) {
        toast.success(
          `Document marked as ${
            actionType === "paymentReady" ? "Payment Ready" : "Received"
          }!`
        );
        fetchDocuments(); // Refresh the documents list
      } else {
        toast.error(response.message || "Failed to update status.");
      }
    } catch (error) {
      console.error("Error approving document:", error);
      toast.error("Error processing approval.");
    } finally {
      setPinModal(false); // Close the modal
      setSelectedDoc(null);
      setEnteredPin("");
    }
  };
  // Decode the JWT token to read the 'exp' claim
  const decodeJwt = (token) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  };

  const checkTokenExpiration = () => {
    const token = localStorage.getItem("authToken");
    // console.log("token : ", localStorage.getItem("authToken"));

    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    const decodedToken = decodeJwt(token);
    const exp = decodedToken.exp * 1000; // Convert exp to milliseconds
    const currentTime = Date.now();

    if (exp < currentTime) {
      console.log("Token is expired.");
      // Optionally, you can log out the user or refresh the token here
      localStorage.removeItem("authToken"); // Optionally clear expired token
    } else {
      console.log("Token is still valid.");
    }
  };

  // Call this function periodically or before making API requests
  checkTokenExpiration();

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
