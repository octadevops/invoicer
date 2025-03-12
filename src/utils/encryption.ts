import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "";

if (!SECRET_KEY) {
  console.error("Encryption key not found in environment variables!");
}

// Create a consistent key using SHA256
const KEY = CryptoJS.SHA256(SECRET_KEY);

export const encryptData = (data: any): string => {
  try {
    const jsonString = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonString, KEY.toString()).toString();
  } catch (error) {
    console.error("Encryption error:", error);
    throw error;
  }
};

export const decryptData = (encryptedData: string): any => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, KEY.toString());
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error("Decryption error:", error);
    throw error;
  }
};
