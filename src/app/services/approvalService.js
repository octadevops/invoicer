import { getApiUrl, GET_APPROVAL_DOCS, UPDATE_APPROVAL } from "../api/api";

// Fetch approval documents (status = 1) for the logged-in user
export const getApprovalDocuments = async (formID = 3, userId) => {
  //   console.log("Auth token before API call:", localStorage.getItem("authToken"));
  try {
    const urlWithParams = `${getApiUrl(
      GET_APPROVAL_DOCS
    )}?FormID=${formID}&UserID=${userId}`;
    const response = await fetch(urlWithParams, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Ensure token is being passed here
      },
    });
    // console.log(localStorage.getItem("authToken"));

    return await response.json(); // Ensure the response is parsed as JSON
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
};

// Update document status after validating the PIN
export const updateDocumentStatus = async (documentId, pin) => {
  try {
    const response = await fetch(getApiUrl(UPDATE_APPROVAL), {
      method: "POST", // Specify the method
      headers: {
        "Content-Type": "application/json", // Set the correct content type
        Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Pass the token here
      },
      body: JSON.stringify({ id: documentId, pin }), // Send the data in the body as JSON
    });
    return await response.json(); // Assuming the response is JSON
  } catch (error) {
    console.error("Error updating document status:", error);
    throw error;
  }
};
