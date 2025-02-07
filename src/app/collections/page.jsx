"use client";

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getCollectionDocuments,
  updateCollectionStatus,
} from "../services/collectionService";
import { useAuth } from "@/src/context/AuthContext";
import { HiArrowNarrowUp } from "react-icons/hi";

export default function CollectionsPage() {
  const { user } = useAuth(); // Logged-in user
  const [documents, setDocuments] = useState([]);
  const [columns, setColumns] = useState([]);
  const [collectionModal, setCollectionModal] = useState(false);
  const [pinModal, setPinModal] = useState(false); // Pin Modal state
  const [selectedDoc, setSelectedDoc] = useState(null); // Document to approve
  const [collectorDetails, setCollectorDetails] = useState({
    name: "",
    phone: "",
    nic: "",
    amount: "",
    remark: "",
  }); // Collector details
  const [enteredPin, setEnteredPin] = useState(""); // Pin state
  const [nicError, setNicError] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

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

  const handleCollectionSubmit = async () => {
    if (!validateCollectorDetails()) {
      toast.error("Please enter valid collector details.");
      return;
    }

    // Open PIN modal before submitting the collection details
    setPinModal(true);
  };

  const submitCollectionWithPin = async () => {
    if (!enteredPin) {
      toast.error("Please enter your PIN.");
      return;
    }

    try {
      const payload = {
        name: collectorDetails.name.trim(),
        phone: collectorDetails.phone.trim(),
        nic: collectorDetails.nic.trim(),
        amount: Number(collectorDetails.amount),
        remark: collectorDetails.remark.trim(),
        status: 4, // Mark as collected
        pin: enteredPin, // Include the entered PIN in the request
      };

      console.log("Submitting payload:", { id: selectedDoc.id, ...payload });

      const response = await updateCollectionStatus(selectedDoc.id, payload);

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
      setPinModal(false); // Close the PIN modal
      setCollectionModal(false);
      setSelectedDoc(null);
      setCollectorDetails({
        name: "",
        phone: "",
        nic: "",
        amount: "",
        remark: "",
      });
      setEnteredPin(""); // Clear entered PIN
    }
  };
  const handleNICChange = (e) => {
    let input = e.target.value;

    // Allow only numbers and V/X as input
    if (!/^[0-9VXvx]*$/.test(input)) {
      return;
    }

    // Determine length restrictions based on prefix
    if (input.startsWith("19") || input.startsWith("20")) {
      if (input.length > 12) return; // Restrict to 12 characters
    } else {
      if (input.length > 10) return; // Restrict to 10 characters
    }

    setCollectorDetails({ ...collectorDetails, nic: input });

    // Validate NIC format
    if (/^(19|20)\d{10}$/.test(input)) {
      setNicError(""); // Valid 12-digit NIC for 19/20 prefix
    } else if (/^\d{9}[VXvx]$/.test(input)) {
      setNicError(""); // Valid 9-digit NIC ending with V or X
    } else {
      setNicError("Invalid NIC format.");
    }
  };

  const sortedDocuments = React.useMemo(() => {
    if (sortConfig.key) {
      return [...documents].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return documents;
  }, [documents, sortConfig]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
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
                    className="px-4 py-2 border border-gray-300 text-left min-w-48 cursor-pointer"
                    onClick={() => requestSort(col)}
                  >
                    {col.replace(/_/g, " ")}
                    {sortConfig.key === col ? (
                      sortConfig.direction === "asc" ? (
                        <HiArrowNarrowUp className="ml-3 inline-block" />
                      ) : (
                        <HiArrowNarrowUp className="ml-3 inline-block transform rotate-180 duration-300 ease-in-out" />
                      )
                    ) : null}
                  </th>
                ))}
                <th className="px-4 py-2 border border-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedDocuments.map((doc) => (
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
          <div className="bg-white rounded-lg p-6 max-w-lg">
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
              onChange={(e) => {
                const input = e.target.value;
                if (/^\d{0,10}$/.test(input)) {
                  setCollectorDetails({
                    ...collectorDetails,
                    phone: input,
                  });
                }
              }}
              className="block w-full border border-gray-300 rounded py-2 px-3 mb-4"
              placeholder="Phone Number"
            />
            <input
              type="text"
              value={collectorDetails.nic}
              onChange={handleNICChange}
              className="block w-full border border-gray-300 rounded py-2 px-3 mb-1"
              placeholder="NIC Number"
            />
            {nicError && (
              <p className="text-red-500 text-sm pb-2 ">{nicError}</p>
            )}
            <input
              type="number"
              value={collectorDetails.amount}
              min={0}
              required
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
                onClick={handleCollectionSubmit}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-500"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pin Modal */}
      {pinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Enter PIN</h3>
            <input
              type="password"
              value={enteredPin}
              onChange={(e) => setEnteredPin(e.target.value)}
              className="block w-full border border-gray-300 rounded py-2 px-3 mb-4"
              placeholder="Enter PIN"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setPinModal(false)}
                className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={submitCollectionWithPin}
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
