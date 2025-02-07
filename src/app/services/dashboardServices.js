import { DOCSTATUS, getApiUrl, TRACKER } from "../api/api";

export const getDocStatus = async (docNumber) => {
  if (!docNumber) {
    throw new Error("Invoice number is required");
  }

  try {
    const apiUrl = `${getApiUrl(TRACKER)}?invoiceNo=${encodeURIComponent(
      docNumber
    )}`;
    const response = await fetch(apiUrl);

    if (response.ok) {
      return await response.json();
    } else {
      const error = await response.json();
      console.error("Error:", error);
      throw new Error(error.error || "Failed to fetch document status");
    }
  } catch (error) {
    console.error("Error fetching document status:", error);
    throw error;
  }
};

export const getDocCount = async (formId) => {
  try {
    if (!formId) {
      throw new Error("formId is required");
    }

    // Append formId as a query parameter
    const apiUrl = `${getApiUrl(DOCSTATUS)}?formId=${formId}`;
    const response = await fetch(apiUrl);

    if (response.ok) {
      return await response.json();
    } else {
      const error = await response.json();
      console.error("Error:", error);
      throw new Error(error.error || "Failed to fetch document count");
    }
  } catch (error) {
    console.error("Error fetching document count:", error);
    throw error;
  }
};
