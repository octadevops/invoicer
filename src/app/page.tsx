"use client";

import React, { useEffect, useState } from "react";
import Card from "./components/CardComp";
import Tracker from "./components/Tracker";
import { getDocCount } from "./services/dashboardServices"; // Assume this function accepts `formId` as a parameter
import { PuffLoader } from "react-spinners";

export default function Home() {
  const [receivePending, setReceivePending] = useState(null);
  const [readyToCollect, setReadyToCollect] = useState(null);
  const [totalExpenses, setTotalExpenses] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data for a specific formId
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [pending, ready, expenses] = await Promise.all([
          getDocCount(4), // Fetch data for formId = 4
          getDocCount(5), // Fetch data for formId = 5
          getDocCount(6), // Fetch data for formId = 6
        ]);

        const extractValue = (data) =>
          (Array.isArray(data) && data[0]?.Value) || 0;

        setReceivePending(extractValue(pending));
        setReadyToCollect(extractValue(ready));
        setTotalExpenses(extractValue(expenses));
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatNumber = (value) => {
    if (value == null || isNaN(value)) {
      return "0.00"; // Default for null, undefined, or invalid numbers
    }
    if (value >= 1_000_000) {
      return (value / 1_000_000).toFixed(2) + "M"; // For millions
    } else if (value >= 1_000) {
      return (value / 1_000).toFixed(2) + "K"; // For thousands
    } else {
      return value.toFixed(2); // For values below 1000
    }
  };

  const Total = formatNumber(totalExpenses);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PuffLoader />
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        <p>Error: {error}</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-4 mb-4 p-4 border border-cyan-600 rounded-xl w-full min-h-screen">
      {/* Tracker Section */}
      <div className="w-full flex items-center justify-center">
        <Tracker />
      </div>

      {/* Cards Section */}
      <div className="flex items-center justify-center gap-3">
        <Card title="Receive Pending" className="w-[400px] h-[200px]">
          <div className="text-5xl text-gray-500 font-bold">
            <p>{receivePending}</p>
          </div>
        </Card>
        <Card title="Ready to Collect Payment" className="w-[400px] h-[200px]">
          <div className="text-5xl text-gray-500 font-bold">
            <p>{readyToCollect}</p>
          </div>
        </Card>
        <Card title="Total Invoices" className="w-[400px] h-[200px]">
          <div className="text-5xl text-gray-500 font-bold">
            <p>{Total}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
