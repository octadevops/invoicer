"use client";

import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { HiPhoto } from "react-icons/hi2";
import { v4 as uuidv4 } from "uuid"; // For auto-generating invoice numbers

export default function SupplierForm() {
  const [isComplete, setIsComplete] = useState(false);
  const [paymentType, setPaymentType] = useState("advance");

  return (
    <form className="p-4 border border-cyan-600 rounded-xl">
      <div className="space-y-12 ">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Supplier Manager
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            This form will be used to register new Suppliers.
          </p>

          <div className="mt-10 grid grid-cols-4 gap-x-6 gap-y-8 sm:grid-cols-6">
            {/* Supplier Dropdown */}

            {/* Invoice No (Auto-generated) */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Supplier Code
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  value="supplier"
                  className="block w-full rounded-md border border-cyan-600 py-1.5 px-2 text-gray-900"
                />
              </div>
            </div>

            {/* Company Name */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Company
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
                Supplier Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  value="supplier name"
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
                <select className="block w-full rounded-md border border-cyan-600 py-1.5 px-2 text-gray-900">
                  <option value="LKR">LKR</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>

            {/* Payment Terms */}
            {/* <div className="sm:col-span-2">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Payment Terms
              </label>
              <div className="mt-2">
                <select className="block w-full rounded-md border border-cyan-600 py-1.5 px-2 text-gray-900">
                  {paymentTerms.map((term) => (
                    <option key={term}>{term}</option>
                  ))}
                </select>
              </div>
            </div> */}

            {/* Created User (Auto-selected) */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Created By
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  value=""
                  readOnly
                  disabled
                  className="block w-full rounded-md border border-cyan-600 py-1.5 px-2 text-gray-900"
                />
              </div>
            </div>

            {/* Created At (Auto-generated) */}

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
                for="file_input"
              >
                Upload file
              </label>
              <input
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                aria-describedby="file_input_help"
                id="file_input"
                type="file"
              />
              <p
                className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                id="file_input_help"
              >
                SVG, PNG, JPG or GIF (MAX. File size 2MB).
              </p>
            </div>

            {/* Remarks */}
            <div className="sm:col-span-4">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Remarks
              </label>
              <div className="mt-2">
                <textarea
                  rows="4"
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
  );
}
