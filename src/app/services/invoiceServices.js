// invoiceService.js

import { toast } from "react-toastify";
import { getApiUrl, INVOICE_DATA, LASTDOCNO } from "../api/api";

// Function to create a new invoice
const handleSubmit = async (invoiceData) => {
  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("Authorization token is missing");
    return null;
  }

  try {
    const response = await fetch(getApiUrl(INVOICE_DATA), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(invoiceData),
    });

    if (response.ok) {
      const result = await response.json();
      toast.success("Invoice created successfully");
      return result;
    } else {
      const error = await response.json();
      toast.error("Error: " + (error.message || "Failed to create invoice"));
      return null;
    }
  } catch (error) {
    console.error("Error creating invoice:", error);
    toast.error("An error occurred while creating the invoice.");
    return null;
  }
};

// Function to update an existing invoice by ID
const updateInvoice = async (invoiceId, invoiceData) => {
  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("Authorization token is missing");
    return null;
  }

  try {
    const response = await fetch(`${getApiUrl(INVOICE_DATA)}/${invoiceId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(invoiceData),
    });

    if (response.ok) {
      const result = await response.json();
      toast.success("Invoice updated successfully");
      return result;
    } else {
      const error = await response.json();
      toast.error("Error: " + (error.message || "Failed to update invoice"));
      return null;
    }
  } catch (error) {
    console.error("Error updating invoice:", error);
    toast.error("An error occurred while updating the invoice.");
    return null;
  }
};

const getLastDocNo = async () => {
  try {
    const apiUrl = getApiUrl(LASTDOCNO); // Replace with your endpoint
    const response = await fetch(apiUrl); // Fetch the API response
    const jsonResponse = await response.json(); // Convert response to JSON

    console.log("NewDocNo:", jsonResponse.newDocNo); // Log the actual 'newDocNo'
    return jsonResponse; // Return the full JSON response
  } catch (error) {
    console.error("Error fetching last doc no:", error);
    throw error;
  }
};

// Export services
const services = (object) => object[object];

export { handleSubmit, updateInvoice, services, getLastDocNo };
