"use client";

import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getSupplier } from "../services/supplierService";
import { getInvoices } from "../services/reportServices";
import { PuffLoader } from "react-spinners";

export default function Reports() {
  const [handoverDate, setHandoverDate] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [grnNumber, setGrnNumber] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [data, setData] = useState([]); // Table data
  const [previewImg, setPreviewImg] = useState(null); // State for image preview
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Define column order
  const columns = [
    "id",
    "date",
    "invoiceNo",
    "docNo",
    "Company",
    "Amount",
    "payment_terms",
    "handover_date",
    "handover_to",
    "GRN",
    "Remark",
    "created_user",
    "isAdvance_payment",
    "isComplete",
    "upload_img",
    "status",
    "approval_date",
    "approver_id",
    "payment_type",
    "created_at",
    "currency",
    "modified_at",
    "modified_by",
  ];

  // Fetch suppliers
  const fetchSuppliers = async () => {
    try {
      const response = await getSupplier();
      setSuppliers(response.data || response);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("Error fetching suppliers");
      }
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Handle filter form submit
  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    try {
      const filteredData = await getInvoices({
        formId: 1, // Set formId 1 for filter
        supplier: selectedSupplier || null,
        invoiceNo: invoiceNo || null,
        grnNumber: grnNumber || null,
        handoverDate: handoverDate || null,
      });

      if (filteredData && filteredData.length > 0) {
        setData(filteredData);
      } else {
        setData([]);
        toast.info("No data found for the selected filters.");
      }
    } catch (error) {
      console.error("Error fetching filtered data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="flex md:flex-row flex-col justify-between mb-2 p-4 border border-cyan-600 rounded-xl">
        <div className="items-start">
          <h2 className="text-base text-center md:text-left font-semibold leading-4 text-gray-900">
            Finder
          </h2>
          <p className="mt-1 text-sm text-center md:text-left leading-4 text-gray-600">
            Filter invoices
          </p>
        </div>

        {/* Filter Form */}
        <form onSubmit={handleFilterSubmit} className="p-4">
          <div className="md:grid flex flex-col grid-cols-5 gap-x-6 gap-y-8 items-center">
            {/* Supplier Dropdown */}
            <div className="col-span-1">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Supplier
              </label>
              <select
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                className="block w-full rounded-md border border-cyan-600 py-1.5 px-2 text-gray-900"
              >
                <option value="" disabled>
                  Select a supplier
                </option>
                {suppliers.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.company}
                  </option>
                ))}
              </select>
            </div>

            {/* Invoice No */}
            <div className="col-span-1">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Invoice No
              </label>
              <input
                type="text"
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
                className="block w-full rounded-md border border-cyan-600 py-1.5 px-2 text-gray-900"
              />
            </div>

            {/* GRN Number */}
            <div className="col-span-1">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                GRN Number
              </label>
              <input
                type="text"
                value={grnNumber}
                onChange={(e) => setGrnNumber(e.target.value)}
                className="block w-full rounded-md border border-cyan-600 py-1.5 px-2 text-gray-900"
              />
            </div>

            {/* Handover Date */}
            <div className="col-span-1">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Handover Date
              </label>
              <div className="flex items-center space-x-2">
                <DatePicker
                  selected={handoverDate}
                  onChange={(date) => setHandoverDate(date)}
                  isClearable // Enables the built-in clear functionality
                  placeholderText="Select a date" // Optional placeholder
                  className="block w-full rounded-md border border-cyan-600 py-1.5 px-2 text-gray-900"
                />
              </div>
            </div>

            {/* Filter Button */}
            <div className="col-span-1 pt-5">
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                Filter
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Table Component */}
      <div>
        <h2 className="text-lg font-normal mb-4">Report Details</h2>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <PuffLoader color="#4f46e5" size={50} />
          </div>
        ) : data.length > 0 ? (
          <div className="overflow-x-auto w-full rounded-xl">
            <table className="w-full table-auto border-collapse border border-gray-300 rounded-lg">
              <thead>
                <tr className="bg-gray-600 text-white">
                  {columns.map((col) => (
                    <th
                      key={col}
                      className="px-4 py-2 border border-gray-300 text-left min-w-52"
                    >
                      {col.replace(/_/g, " ").toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="bg-slate-100 hover:bg-gray-200 min-w-52"
                  >
                    {columns.map((col, colIndex) => (
                      <td
                        key={colIndex}
                        className="px-4 py-2 border border-gray-300"
                      >
                        {col === "upload_img" && row[col] ? (
                          <div>
                            {(() => {
                              const imgData = row[col];

                              if (typeof imgData === "string") {
                                // Ensure imgData is a string
                                const isBase64WithPrefix =
                                  imgData.startsWith("data:image/");
                                const isPureBase64 = /^[A-Za-z0-9+/=]+$/.test(
                                  imgData
                                );

                                if (isBase64WithPrefix) {
                                  return (
                                    <button
                                      onClick={() => setPreviewImg(imgData)}
                                      className="text-blue-500 underline"
                                    >
                                      View Image
                                    </button>
                                  );
                                } else if (isPureBase64) {
                                  const formattedImg = `data:image/jpeg;base64,${imgData}`;
                                  return (
                                    <button
                                      onClick={() =>
                                        setPreviewImg(formattedImg)
                                      }
                                      className="text-blue-500 underline"
                                    >
                                      View Image
                                    </button>
                                  );
                                } else {
                                  return (
                                    <span className="text-red-500">
                                      Invalid Image
                                    </span>
                                  );
                                }
                              } else {
                                return (
                                  <span className="text-red-500">
                                    Invalid Image Data
                                  </span>
                                ); // Handle if imgData is not a string
                              }
                            })()}
                          </div>
                        ) : (
                          row[col] || "N/A"
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No data available for this report.</p>
        )}
      </div>

      {/* Image Preview Modal */}
      {previewImg && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-md">
            <img
              src={previewImg}
              alt="Preview"
              className="max-w-full max-h-screen"
            />
            <button
              onClick={() => setPreviewImg(null)}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
