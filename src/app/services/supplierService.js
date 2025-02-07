import { getApiUrl, LAST_SUP, SUPPLIER } from "../api/api";

// supplierService.js
const handleSubmit = async (supplierData) => {
  try {
    const response = await fetch(getApiUrl(SUPPLIER), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(supplierData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result.message);
      return result; // Return result for further processing if needed
    } else {
      const error = await response.json();
      console.error("Error:", error);
      throw new Error(error.message || "Failed to submit data");
    }
  } catch (error) {
    console.error("Error:", error);
    throw error; // Rethrow error for handling in the calling function
  }
};

const services = (object) => object[object];

export { handleSubmit, services };

export const fetchLastSupplier = async () => {
  try {
    const apiUrl = getApiUrl(LAST_SUP);
    const response = await fetch(apiUrl);
    if (response.ok) return await response.json();
    else {
      const error = await response.json();
      console.error("Error:", error);
      throw new Error(error.message || "Failed to fetch last supplier");
    }
  } catch (error) {
    console.error("Error fetching last supplier:", error);
    throw error;
  }
};
export const getSupplier = async () => {
  try {
    const apiUrl = getApiUrl(SUPPLIER);
    const response = await fetch(apiUrl);
    if (response.ok) return await response.json();
    else {
      const error = await response.json();
      console.error("Error:", error);
      throw new Error(error.message || "Failed to fetch suppliers");
    }
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    throw error;
  }
};
