// invoiceService.js

import { toast } from "react-toastify";

// Function to handle the form submission
const handleSubmit = async (invoiceData) => {
  try {
    // Send POST request to the backend
    const response = await fetch("http://localhost:5000/api/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invoiceData),
    });

    if (response.ok) {
      const result = await response.json();
      toast.success("Invoice Created Successfully");
      return result;
    } else {
      const error = await response.json();
      toast.error("Error: " + error.message);
      return null;
    }
  } catch (error) {
    console.error("Error creating invoice:", error);
    toast.error("An error occurred while creating the invoice.");
    return null;
  }
};

const services = (object) => object[object];

export { handleSubmit, services };
