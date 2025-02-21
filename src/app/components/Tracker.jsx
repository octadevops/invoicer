"use client";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SyncLoader } from "react-spinners";
import { HiMiniCheckCircle, HiOutlineClock } from "react-icons/hi2";
import { getDocStatus } from "../services/dashboardServices";

const Tracker = () => {
  const [docNumber, setDocNumber] = useState("");
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    if (!docNumber) {
      toast.error("Please enter a document number.");
      return;
    }

    setLoading(true);
    try {
      const response = await getDocStatus(docNumber);
      const { status, invoiceNo, docNo, company, remark, amount, isComplete } =
        response;

      // Map status codes to labels
      const statusMapping = {
        1: "Generated",
        2: "Received",
        3: "Payment Ready",
        4: "Collected",
      };

      const progress = ["Generated", "Received", "Payment Ready", "Collected"];
      const currentStatus = statusMapping[status];

      if (!currentStatus) {
        throw new Error("Invalid document status received from server.");
      }

      setTrackingData({
        status: currentStatus,
        progress,
        isComplete,
        invoiceNo,
        docNo,
        company,
        remark,
        amount,
      });
      toast.success("Document details fetched successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to fetch tracking details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:p-4 p-2 border border-cyan-600 rounded-xl w-full">
      <ToastContainer />
      <div className="flex flex-col items-center justify-center gap-3">
        <h2 className="text-lg font-semibold mb-4">Track Your Document</h2>

        <div className="flex flex-col gap-4 items-center">
          {/* Input Field */}
          <input
            type="text"
            value={docNumber}
            onChange={(e) => setDocNumber(e.target.value)}
            placeholder="Enter Document Number"
            className="block w-48 md:w-[500px] rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm"
          />

          {/* Track Button */}
          <button
            onClick={handleTrack}
            className="rounded-md bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-500 shadow-sm"
            disabled={loading}
          >
            {loading ? (
              <SyncLoader color="#ffffff" size={8} speedMultiplier={0.5} />
            ) : (
              "Track"
            )}
          </button>
        </div>

        {/* Tracking Status */}
        {trackingData && (
          <div className="mt-6 flex flex-col items-center justify-center">
            <h3 className="text-base text-center font-semibold mb-6">
              Tracking Progress
            </h3>
            <div className="flex md:flex-row flex-col items-center gap-4 relative">
              {trackingData.progress.map((step, index) => {
                const isCompleted =
                  trackingData.progress.indexOf(trackingData.status) >= index;

                return (
                  <div
                    key={step}
                    className="flex md:flex-row flex-col items-center md:gap-8 relative"
                  >
                    <div className="flex flex-col items-center justify-center z-10 bg-white">
                      <div
                        className={`${
                          isCompleted ? "text-green-500" : "text-gray-400"
                        }`}
                      >
                        {isCompleted ? (
                          <HiMiniCheckCircle size={24} />
                        ) : (
                          <HiOutlineClock size={24} />
                        )}
                      </div>
                      <span className="text-sm mt-2 bg-white px-2">{step}</span>
                    </div>

                    {index < trackingData.progress.length - 1 && (
                      <div
                        className={`
                        md:w-[150px] md:h-[2px]
                        w-[2px] h-[50px]
                        absolute
                        md:static
                        md:mt-0 mt-[-25px]
                        left-1/2 transform -translate-x-1/2
                        md:translate-x-0
                        ${isCompleted ? "bg-green-500" : "bg-gray-400"}
                      `}
                      ></div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-6 w-full">
              <h3 className="text-base text-center font-semibold mb-2">
                Document Data
              </h3>
              <div className="overflow-x-auto md:w-[98%] w-[200px]">
                <table className="min-w-full whitespace-nowrap border-collapse border border-gray-300 rounded-lg">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 bg-gray-50">
                        Invoice Number
                      </th>
                      <th className="border border-gray-300 px-4 py-2 bg-gray-50">
                        Supplier
                      </th>
                      <th className="border border-gray-300 px-4 py-2 bg-gray-50">
                        Remark
                      </th>
                      <th className="border border-gray-300 px-4 py-2 bg-gray-50">
                        Amount
                      </th>
                      <th className="border border-gray-300 px-4 py-2 bg-gray-50">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">
                        {trackingData.invoiceNo}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {trackingData.company}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {trackingData.remark}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Rs. {trackingData.amount}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {trackingData.status}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tracker;
