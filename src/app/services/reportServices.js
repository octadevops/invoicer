import { getApiUrl, GETDATA } from "../api/api";

export const getInvoices = async (params) => {
  const { formId, supplier, invoiceNo, grnNumber, handoverDate } = params;

  try {
    const apiUrl = getApiUrl(GETDATA);
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        formId,
        supplier,
        invoiceNo,
        grnNumber,
        handoverDate,
      }),
    });

    if (response.ok) return await response.json();
    else {
      const error = await response.json();
      console.error("Error:", error);
      throw new Error(error.message || "Failed to fetch invoices");
    }
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};
