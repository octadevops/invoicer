"use client";

import React, { useEffect, useState } from "react";
import { fetchLastSupplier, handleSubmit } from "../services/supplierService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/src/context/AuthContext";
import { HiOutlinePlusSmall } from "react-icons/hi2";

export default function SupplierForm() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [supplierNo, setSupplierNo] = useState("");
  // const [submissionCount, setSubmissionCount] = useState(0);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [email, setEmail] = useState("");
  const [taxId, setTaxId] = useState("");
  const [company, setCompany] = useState("");
  const [type, setType] = useState("2");
  const { user } = useAuth();

  useEffect(() => {
    const date = new Date();
    const formattedDate = date.toISOString().split("T")[0];
    setCurrentDate(formattedDate);
    fetchLastSupplierCode();
  }, []);

  const handleNewButtonClick = async () => {
    setIsFormVisible(true);
    await fetchLastSupplierCode();
    console.log("Supplier Number after Fetch:", supplierNo);
  };

  useEffect(() => {
    if (supplierNo) {
      console.log("Supplier Number Updated:", supplierNo); // Debugging
    }
  }, [supplierNo]);

  const fetchLastSupplierCode = async () => {
    try {
      const response = await fetchLastSupplier();
      console.log("Fetch Response:", response);
      const lastSupplierCode = response?.last_code;
      console.log("Last Supplier:", lastSupplierCode);
      const newCode = generateNextSupplierCode(lastSupplierCode);
      console.log("Generated Supplier Code : ", newCode);
      setSupplierNo(newCode);
    } catch (error) {
      console.error("Error fetching last supplier:", error);
      toast.error("Failed to fetch last supplier code.");
    }
  };

  const generateNextSupplierCode = (lastCode = "") => {
    const defaultPrefix = "SUP";

    const dateStr = new Date().toISOString().split("T")[0].replace(/-/g, "");

    if (!lastCode) {
      return `${defaultPrefix}${dateStr}-01`;
    }

    const [prefix, datePart, countPart] = lastCode.split("-");

    if (!prefix || !datePart || !countPart) {
      console.error("Invalid last code format:", lastCode);
      return `${defaultPrefix}-${dateStr}-01`;
    }

    if (dateStr === datePart) {
      const nextCount = parseInt(countPart, 10) + 1;
      const countStr = nextCount.toString().padStart(2, "0");
      return `${prefix}-${datePart}-${countStr}`;
    } else {
      return `${prefix}-${dateStr}-01`;
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const supplierData = {
      SupplierCode: supplierNo,
      Name: name,
      Address: address,
      ContactNo: contactNo,
      Email: email,
      Tax_ID: taxId,
      Company: company,
      IsActive: isActive,
      Type: type,
      Created_user: user?.username || "",
      Created_Date: currentDate,
      Modified_user: user?.username || "",
      Modified_Date: currentDate,
    };

    try {
      const result = await handleSubmit(supplierData);
      toast.success("Supplier Created Successfully");
      console.log(result);
      await fetchLastSupplierCode();

      resetForm();
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  };

  const resetForm = () => {
    setName("");
    setAddress("");
    setContactNo("");
    setEmail("");
    setTaxId("");
    setCompany("");
    setType("2");
    setIsActive(false);
  };

  const handleClear = () => {
    setIsFormVisible(false);
    resetForm();
    window.location.reload();
  };

  const validateForm = () => {
    if (!name) {
      toast.error("Name is required");
      return false;
    }
    if (!contactNo) {
      toast.error("Contact No is required");
      return false;
    }
    if (!email) {
      toast.error("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Email is not valid");
      return false;
    }
    if (!type) {
      toast.error("Type is required");
      return false;
    }
    return true;
  };

  return (
    <div>
      <ToastContainer />
      <div className="flex justify-between items-center mb-4 p-4 border border-cyan-600 rounded-xl">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Supplier Manager
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            This form will be used to register new Suppliers.
          </p>
        </div>
        <button
          onClick={handleNewButtonClick}
          className="flex gap-2 items-center justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 duration-300 ease-in-out"
        >
          New
          <HiOutlinePlusSmall className="text-xl font-bold" />
        </button>
      </div>
      {isFormVisible && (
        <form
          className="p-4 border border-cyan-600 rounded-xl"
          onSubmit={handleSubmitForm}
        >
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <div className="mt-10 grid grid-cols-4 gap-x-6 gap-y-8 sm:grid-cols-6">
                {/* Supplier Code (Auto-generated) */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Supplier Code
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={supplierNo || ""}
                      readOnly
                      disabled
                      className="block w-full rounded-md border border-cyan-600 py-1.5 px-2 text-gray-900"
                    />
                  </div>
                </div>

                {/* Supplier Name */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Contact Person
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full rounded-md border border-cyan-600 py-1.5 px-2 text-gray-900"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Address
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="block w-full rounded-md border border-cyan-600 py-1.5 px-2 text-gray-900"
                    />
                  </div>
                </div>

                {/* Contact No */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Contact No
                  </label>
                  <div className="mt-2">
                    <input
                      type="text" // Changed to text for better handling
                      value={contactNo}
                      onChange={(e) => setContactNo(e.target.value)}
                      className="block w-full rounded-md border border-cyan-600 py-1.5 px-2 text-gray-900"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Email Address
                  </label>
                  <div className="mt-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-md border border-cyan-600 py-1.5 px-2 text-gray-900"
                    />
                  </div>
                </div>

                {/* Tax ID */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Tax ID
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      className="block w-full rounded-md border border-cyan-600 py-1.5 px-2 text-gray-900"
                    />
                  </div>
                </div>

                {/* Company */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Company
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="block w-full rounded-md border border-cyan-600 py-1.5 px-2 text-gray-900"
                    />
                  </div>
                </div>

                {/* Type */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Type
                  </label>
                  <div className="mt-2">
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="block w-full rounded-md border border-cyan-600 py-1.5 px-2 text-gray-900"
                    >
                      <option value="2">Non Trading</option>
                      <option value="1">Trading</option>
                    </select>
                  </div>
                </div>

                {/* Created User */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Created User
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={user?.username || ""}
                      disabled
                      className="block w-full rounded-md border border-cyan-600 py-1.5 px-2 text-gray-900 capitalize"
                    />
                  </div>
                </div>

                {/* Is Active */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Status
                  </label>
                  <div className="mt-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={() => setIsActive(!isActive)}
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      <span className="ml-3 text-sm font-medium text-gray-900">
                        {isActive ? (
                          <span className="text-green-400">Active</span>
                        ) : (
                          <span className="text-red-400">Inactive</span>
                        )}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              onClick={handleClear}
              className="rounded-md border border-red-600 px-3 py-2 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 duration-300 ease-in-out"
            >
              Clear
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 duration-300 ease-in-out"
            >
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
