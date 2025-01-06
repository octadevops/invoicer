"use client";

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getCollectionDocuments,
  updateCollectionStatus,
} from "../services/collectionService";
import { useAuth } from "@/src/context/AuthContext";

export default function CollectionsPage() {
  const { user } = useAuth(); // Logged-in user
  const [documents, setDocuments] = useState([]);
  const [columns, setColumns] = useState([]);
  const [collectionModal, setCollectionModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null); // Document to approve
  const [collectorDetails, setCollectorDetails] = useState({
    name: "",
    phone: "",
    nic: "",
    amount: "",
    remark: "",
  }); // Collector details

  const fetchDocuments = async () => {
    if (!user) {
      toast.error("No user found.");
      return;
    }

    try {
      const username = user?.username || "";
      let response;

      // Fetch documents based on user role
      if (user.role === "Cashier") {
        response = await getCollectionDocuments(7, username);
      } else {
        response = await getCollectionDocuments(7);
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
      if (
        user.role === "Administrator" ||
        user.role === "Manager" ||
        user.role === "Cashier"
      ) {
        fetchDocuments();
      } else {
        toast.error("Unauthorized Access.");
      }
    } else {
      toast.error("No user logged in.");
    }
  }, [user]);

  const validateCollectorDetails = () => {
    const newErrors = {};
    if (!collectorDetails.name.trim()) newErrors.name = "Name is required.";
    if (!collectorDetails.phone.trim())
      newErrors.phone = "Phone number is required.";
    if (!collectorDetails.nic.trim()) newErrors.nic = "NIC is required.";
    if (!collectorDetails.amount) newErrors.amount = "Amount is required.";

    // Display validation errors (optional)
    if (Object.keys(newErrors).length > 0) {
      Object.values(newErrors).forEach((error) => toast.error(error));
      return false;
    }
    return true;
  };

  const submitCollectionDetails = async () => {
    if (!validateCollectorDetails()) {
      toast.error("Please enter valid collector details.");
      return;
    }

    try {
      // Update collection details and status
      const response = await updateCollectionStatus(
        selectedDoc.id,
        "", // No PIN needed anymore
        {
          ...collectorDetails,
          status: 4, // Mark as collected
        }
      );

      if (response.success) {
        toast.success("Collection details recorded successfully!");
        fetchDocuments(); // Refresh the documents list
      } else {
        toast.error(response.message || "Failed to update status.");
      }
    } catch (error) {
      console.error("Error recording collection details:", error);
      toast.error("Error processing collection details.");
    } finally {
      setCollectionModal(false); // Close the modal
      setSelectedDoc(null); // Clear the selected document
      setCollectorDetails({
        name: "",
        phone: "",
        nic: "",
        amount: "",
        remark: "",
      }); // Reset collector details
    }
  };

  return (
    <div>
      <ToastContainer />
      <h2 className="text-lg font-semibold mb-4">Collection Process</h2>

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
                  {columns.map((col) => (
                    <td
                      key={`${doc.id}-${col}`}
                      className="px-4 py-2 border border-gray-300"
                    >
                      {String(doc[col]) || "-"}
                    </td>
                  ))}
                  <td className=" px-6 py-2 border border-gray-300">
                    {doc.Status === "3" ? (
                      <button
                        onClick={() => {
                          setSelectedDoc(doc);
                          setCollectionModal(true);
                        }}
                        className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-500 w-full"
                      >
                        Mark as Collected
                      </button>
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

      {/* Collector Details Modal */}
      {collectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Collector Details</h3>
            <input
              type="text"
              value={collectorDetails.name}
              onChange={(e) =>
                setCollectorDetails({
                  ...collectorDetails,
                  name: e.target.value,
                })
              }
              className="block w-full border border-gray-300 rounded py-2 px-3 mb-4"
              placeholder="Collector Name"
            />
            <input
              type="text"
              value={collectorDetails.phone}
              onChange={(e) =>
                setCollectorDetails({
                  ...collectorDetails,
                  phone: e.target.value,
                })
              }
              className="block w-full border border-gray-300 rounded py-2 px-3 mb-4"
              placeholder="Phone Number"
            />
            <input
              type="text"
              value={collectorDetails.nic}
              onChange={(e) =>
                setCollectorDetails({
                  ...collectorDetails,
                  nic: e.target.value,
                })
              }
              className="block w-full border border-gray-300 rounded py-2 px-3 mb-4"
              placeholder="NIC Number"
            />
            <input
              type="number"
              value={collectorDetails.amount}
              onChange={(e) =>
                setCollectorDetails({
                  ...collectorDetails,
                  amount: e.target.value,
                })
              }
              className="block w-full border border-gray-300 rounded py-2 px-3 mb-4"
              placeholder="Amount Collected"
            />
            <input
              type="text"
              value={collectorDetails.remark}
              onChange={(e) =>
                setCollectorDetails({
                  ...collectorDetails,
                  remark: e.target.value,
                })
              }
              className="block w-full border border-gray-300 rounded py-2 px-3 mb-4"
              placeholder="Remark"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setCollectionModal(false)}
                className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={submitCollectionDetails}
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
