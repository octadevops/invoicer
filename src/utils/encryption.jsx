import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "";

if (!SECRET_KEY) {
  console.error("Encryption key not found in environment variables!");
}

export const encryptData = (data) => {
  try {
    const jsonString = JSON.stringify(data);
    console.log("Data to encrypt:", jsonString);

    // Use WordArray for consistent encoding
    const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
    const encrypted = CryptoJS.AES.encrypt(jsonString, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });

    console.log("Encrypted data:", encrypted.toString());
    return encrypted.toString();
  } catch (error) {
    console.error("Encryption error:", error);
    throw error;
  }
};

export const decryptData = (encryptedData) => {
  try {
    const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
};
