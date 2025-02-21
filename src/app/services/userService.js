import { toast } from "react-toastify";
import {
  AUTHCODERESET,
  DEPARTMENTS,
  getApiUrl,
  PASSWORDRESET,
  RECEIVER,
  USER,
  USERS,
} from "../api/api";

const API_URL = getApiUrl(USER);

export const registerUser = async (userData) => {
  console.log("Sending User data:", userData);
  console.log("API Url:", API_URL);
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error.includes("duplicate")) {
        // Adjust this condition based on your API response
        throw new Error("Duplicate user detected");
      }
      throw new Error(
        `Network response was not ok: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    toast.success("User Registered Successfully");
    window.location.reload();
    return data;
  } catch (error) {
    console.error("Error registering user:", error);
    toast.error("Error Registering User");
    throw error; // Rethrow the error for handling in the calling component
  }
};

export const getUser = async () => {
  try {
    const apiUrl = getApiUrl(RECEIVER);
    const response = await fetch(apiUrl);
    if (response.ok) return await response.json();
    else {
      const error = await response.json();
      console.error("Error:", error);
      throw new Error(error.message || "Failed to fetch users");
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
export const resetUserPassword = async (userId, password) => {
  try {
    const apiUrl = getApiUrl(PASSWORDRESET).replace("<user_id>", userId);
    const response = await fetch(apiUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error resetting password:", errorData);
      throw new Error("Failed to reset password");
    }

    toast.success("Password reset successfully");
    return await response.json(); // You can return any updated data here
  } catch (error) {
    console.log("Error resetting password:", error);
    toast.error("Error resetting password");
    throw error;
  }
};

// Reset user auth code
export const resetAuthCode = async (userId, authCode) => {
  try {
    const apiUrl = getApiUrl(AUTHCODERESET).replace("<user_id>", userId);
    const response = await fetch(apiUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ authCode }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error resetting auth code:", errorData);
      throw new Error("Failed to reset auth code");
    }

    toast.success("Auth code reset successfully");
    return await response.json(); // Return the updated user data, if applicable
  } catch (error) {
    console.log("Error resetting auth code:", error);
    toast.error("Error resetting auth code");
    throw error;
  }
};
export const getUsers = async () => {
  try {
    const apiUrl = getApiUrl(USERS);
    const response = await fetch(apiUrl);
    if (response.ok) return await response.json();
    else {
      const error = await response.json();
      console.error("Error:", error);
      throw new Error(error.message || "Failed to fetch Users");
    }
  } catch (error) {
    console.error("Error fetching Users:", error);
    throw error;
  }
};

export const getDepartments = async (formID = 9) => {
  try {
    const urlWithParams = `${getApiUrl(DEPARTMENTS)}?formId=${formID}`;
    console.log("Fetching departments from:", urlWithParams); // Debug log

    const response = await fetch(urlWithParams, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Updated to match the correct token key
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching departments: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Departments fetched:", data); // Debug log
    return data;
  } catch (error) {
    console.error("Error fetching departments:", error);
    throw error;
  }
};
