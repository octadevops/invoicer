import { COLLECTIONSTATUS, PENDINGCOLLECTIONS, getApiUrl } from "../api/api";

export const getCollectionDocuments = async (formID = 7) => {
  try {
    const urlWithParams = `${getApiUrl(PENDINGCOLLECTIONS)}?formId=${formID}`;
    const response = await fetch(urlWithParams, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching documents: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
};

export const updateCollectionStatus = async (
  documentId,
  collectorDetails
) => {
  try {
    const response = await fetch(getApiUrl(COLLECTIONSTATUS), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({ id: documentId, ...collectorDetails }),
    });

    if (!response.ok) {
      throw new Error(`Error updating document status: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating document status:", error);
    throw error;
  }
};
