"use client";

import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  HiOutlinePlayCircle,
  HiOutlinePlusCircle,
  HiOutlinePlusSmall,
} from "react-icons/hi2";
import { getLastDocNo, handleSubmit } from "../services/invoiceServices";
import { getSupplier } from "../services/supplierService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUser } from "../services/userService";
import { useAuth } from "@/src/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

export default function InvoiceForm() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [handoverDate, setHandoverDate] = useState(null);
  const [amount, setAmount] = useState("");
  const [isAdvancePayment, setIsAdvancePayment] = useState(false); // Change to boolean
  const [isComplete, setIsComplete] = useState(false);
  const [paymentType, setPaymentType] = useState("advance");
  const [currencyType, setCurrencyType] = useState("");
  const [image, setImage] = useState(null);
  const [invoiceNo, setInvoiceNo] = useState("");
  const [docNo, setDocNo] = useState("");
  const [submissionCount] = useState(0);
  const [imageBinary, setImageBinary] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [receivers, setReceivers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedReceiver, setSelectedReceiver] = useState("");
  const [remark, setRemark] = useState("");
  // const [isUpdateClicked, setIsUpdateClicked] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [enterInvoiceNumber, setEnterInvoiceNumber] = useState("");

  const { user } = useAuth();

  const pathname = usePathname();
  const fetchSuppliers = async () => {
    try {
      const response = await getSupplier();
      // console.log("fetched suppliers : ", response);
      setSuppliers(response.data || response);
      // console.log("Suppliers state updated: ", response.data || response);
    } catch (error) {
      toast.error("Error fetching suppliers");
      console.error("Error fetching suppliers", error);
    }
  };
  const fetchReceivers = async () => {
    try {
      const response = await getUser();
      // console.log("fetched users : ", response);
      setReceivers(response.data || response);
      // console.log("Receivers state updated: ", response.data || response);
    } catch (error) {
      toast.error("Error fetching suppliers");
      console.error("Error fetching suppliers", error);
    }
  };
  const fetchNewDocNo = async () => {
    try {
      const response = await getLastDocNo(); // API call returns the JSON response

      console.log("API Response:", response); // Should show { newDocNo: "DOC-20241216-0002" }

      // Check and return 'newDocNo' directly
      if (response && response.newDocNo) {
        console.log("Generated docNo:", response.newDocNo);
        return response.newDocNo;
      } else {
        console.error("Invalid response structure", response);
        return null;
      }
    } catch (error) {
      console.error("Error fetching newDocNo", error);
      return null;
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        const newDocNo = await fetchNewDocNo();
        if (newDocNo) {
          setDocNo(newDocNo); // Bind the docNo to state
        } else {
          toast.error("Failed to fetch the document number from the server.");
        }

        await fetchSuppliers();
        await fetchReceivers();
      } catch (error) {
        console.error("Error initializing data", error);
        toast.error("Failed to load initial data.");
      }
    };

    initializeData();
  }, []);

  const paymentTerms = ["Net 30", "Net 60", "Due on Receipt", "Custom Terms"];

  // const generateDocNumber = () => {
  //   const dateStr = new Date().toISOString().split("T")[0].replace(/-/g, "");
  //   const countStr = (submissionCount + 1).toString().padStart(2, "0");
  //   const generatedDocNo = `DOC-${dateStr}-${countStr}`;
  //   return generatedDocNo;
  // };

  const validateForm = () => {
    if (!docNo) {
      toast.error("Document number is not available. Please try again.");
      return false;
    }
    if (!amount) {
      toast.error("Amount is required");
      return false;
    }
    if (!handoverDate) {
      toast.error("Handover date is required");
      return false;
    }
    if (!image) {
      toast.error("Please upload an image");
      return false;
    }
    return true;
  };

  const handleNewButtonClick = () => {
    setIsFormVisible(true);
    // setIsUpdateClicked(false);
  };

  // const handleEditButtonClick = () => {
  //   setIsUpdateClicked(true);
  //   setShowInvoiceModal(true);
  // };

  const validateUpdateInput = () => {
    if (!enterInvoiceNumber.trim()) {
      toast.error("Invoice number cannot be empty for an update.");
      return false;
    }
    return true;
  };

  const handleModelSubmit = () => {
    if (!validateUpdateInput()) return; // Stop if validation fails

    setInvoiceNo(enterInvoiceNumber);
    setIsFormVisible(true);
    setShowInvoiceModal(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result;
        if (typeof base64data === "string") {
          const binaryData = base64data.split(",")[1];
          setImageBinary(binaryData);
        } else {
          console.error("Failed to read the file as a Base64 string");
        }
      };
      reader.readAsDataURL(file);
    } else {
      console.error("No file selected");
    }
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const invoiceData = {
      invoiceNo: invoiceNo,
      docNo: docNo,
      amount: amount,
      currency: currencyType,
      paymentTerms: paymentType,
      handoverDate: (handoverDate ?? new Date()).toISOString().split("T")[0],
      handoverTo: selectedReceiver,
      createdBy: {
        username: user?.username || "Guest", // Pass only the username
      },
      isAdvancePayment: isAdvancePayment,
      isComplete: isComplete,
      remarks: remark,
      supplierId: selectedSupplier,
      imageBinary: imageBinary,
    };

    try {
      const result = await handleSubmit(invoiceData);

      if (result) {
        toast.success("Invoice created successfully");

        // Clear all the fields
        setAmount("");
        setIsAdvancePayment(false);
        setIsComplete(false);
        setImage(null);
        setImageBinary(null);
        setInvoiceNo("");
        setHandoverDate(null);
        setSelectedSupplier("");
        setSelectedReceiver("");
        setRemark("");

        // Fetch a new document number
        const newDocNo = await fetchNewDocNo();
        if (newDocNo) {
          setDocNo(newDocNo); // Update the docNo with the new value
        } else {
          toast.error("Failed to generate new document number");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to create invoice");
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="flex justify-between items-center mb-4 p-4 border border-cyan-600 rounded-xl">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Invoice Manager
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            This form will be used to register new Suppliers.
          </p>
        </div>
        <div className="flex gap-3 items-center justify-center">
          <button
            onClick={handleNewButtonClick}
            className="flex gap-2 items-center justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 duration-300 ease-in-out"
          >
            New
            <HiOutlinePlusSmall className="text-xl font-bold" />
          </button>
        </div>
      </div>

      {/* Invoice Number Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-1/3">
            <h2 className="text-lg font-semibold mb-4">Enter invoice number</h2>
            <input
              type="text"
              value={enterInvoiceNumber}
              className="w-full p-2 border rounded mb-4"
              onChange={(e) => setEnterInvoiceNumber(e.target.value)}
              placeholder="Invoice Number"
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setShowInvoiceModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleModelSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {isFormVisible && (
        <form
          className="p-4 border border-cyan-600 rounded-xl"
          onSubmit={onFormSubmit}
        >
          <div className="space-y-12 ">
            <div className="border-b border-gray-900/10 pb-12">
              <div className="mt-10 grid grid-cols-4 gap-x-6 gap-y-8 sm:grid-cols-6">
                {/* Supplier Dropdown */}
                <div className="sm:col-span-2">
                  <label className="flex items-center  gap-2 text-sm font-medium leading-6 text-gray-900">
                    Supplier
                    <div>
                      <Link href={"/suppliers"}>
                        <HiOutlinePlusCircle
                          className="text-blue-500 text-lg cursor-pointer"
                          data-tooltip-id="supplier-tooltip"
                          data-tooltip-content="Add Supplier"
                        />
                      </Link>
                    </div>
                    <Tooltip id="supplier-tooltip" place="top" effect="solid" />
                  </label>
                  <div className="mt-2">
                    <select
                      value={selectedSupplier}
                      onChange={(e) => setSelectedSupplier(e.target.value)}
                      className="block w-full rounded-md border border-cyan-600 py-1.5 px-2 text-gray-900"
                    >
                      <option value="" disabled>
                        Select a supplier
                      </option>
                      {suppliers && suppliers.length > 0 ? (
                        suppliers.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.company}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          No suppliers available
                        </option>
                      )}
                    </select>
                  </div>
                </div>

                {/* Invoice No (Auto-generated) */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Doc. No
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={docNo}
                      readOnly
                      disabled
                      placeholder="Fetching document number..."
                      className="block w-full rounded-md border border-cyan-600 py-1.5 px-2 text-gray-900"
                    />
                  </div>
                </div>

                {/* Invoice Number */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Invoice Number
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={invoiceNo}
                      onChange={(e) => setInvoiceNo(e.target.value)}
                      className="block w-full rounded-md border border-cyan-600 py-1.5 px-2 text-gray-900"
                    />
                  </div>
                </div>
                {/* GRN Number */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    GRN Number
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      className="block w-full rounded-md border border-cyan-600 py-1.5 px-2 text-gray-900"
                    />
                  </div>
                </div>

                {/* Amount */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Amount
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="block w-full rounded-md border border-cyan-600 py-1.5 px-2 text-gray-900"
                    />
                  </div>
                </div>

                {/* Currency */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Currency
                  </label>
                  <div className="mt-2">
                    <select
                      required
                      value={currencyType}
                      onChange={(e) => setCurrencyType(e.target.value)}
                      className="block w-full rounded-md border border-cyan-600 py-1.5 px-2 text-gray-900"
                    >
                      <option value="" disabled>
                        Select Currency
                      </option>
                      <option value="LKR">LKR</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                </div>

                {/* Payment Terms */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Payment Terms
                  </label>
                  <div className="mt-2">
                    <select
                      required
                      onChange={(e) => setPaymentType(e.target.value)}
                      className="block w-full rounded-md border border-cyan-600 py-1.5 px-2 text-gray-900"
                    >
                      {paymentTerms.map((term) => (
                        <option key={term} value={term}>
                          {term}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Handover Date */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Handover Date
                  </label>
                  <div className="mt-2">
                    <DatePicker
                      selected={handoverDate}
                      onChange={(date) => setHandoverDate(date || new Date())}
                      className="block w-full rounded-md border border-cyan-600 py-1.5 px-2 text-gray-900"
                    />
                  </div>
                </div>

                {/* Handover To */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Handover To
                  </label>
                  <div className="mt-2">
                    <select
                      required
                      value={selectedReceiver}
                      onChange={(e) => setSelectedReceiver(e.target.value)}
                      className="block w-full rounded-md border border-cyan-600 py-1.5 px-2 text-gray-900"
                    >
                      <option value="" disabled>
                        Select a receiver
                      </option>
                      {receivers && receivers.length > 0 ? (
                        receivers.map((item, index) => (
                          <option key={index} value={item.id}>
                            {item.name}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          No receivers available
                        </option>
                      )}
                    </select>
                  </div>
                </div>

                {/* Created User (Auto-selected) */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Created By
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={user?.username || ""}
                      readOnly
                      disabled
                      className="block w-full rounded-md border border-cyan-600 py-1.5 px-2 text-gray-900"
                    />
                  </div>
                </div>

                {/* Created At (Auto-generated) */}

                {/* Advance Payment */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Advance Payment
                  </label>
                  <div className="mt-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAdvancePayment}
                        onChange={() => setIsAdvancePayment(!isAdvancePayment)}
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      <span className="ml-3 text-sm font-medium text-gray-900">
                        {isAdvancePayment ? "" : ""}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Complete Status - Toggle Switch */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Complete
                  </label>
                  <div className="mt-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isComplete}
                        onChange={() => setIsComplete(!isComplete)}
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      <span className="ml-3 text-sm font-medium text-gray-900">
                        {isComplete ? "" : ""}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Image Upload */}
                <div className="sm:col-span-2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    htmlFor="file_input"
                  >
                    Upload file
                  </label>
                  <input
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    aria-describedby="file_input_help"
                    id="file_input"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <p
                    className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                    id="file_input_help"
                  >
                    PNG or JPG (MAX. File size 2MB).
                  </p>
                </div>

                {/* Remarks */}
                <div className="sm:col-span-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Remarks
                  </label>
                  <div className="mt-2">
                    <textarea
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      rows={4}
                      className="block w-full rounded-md border border-cyan-600 py-1.5 text-gray-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="button"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
