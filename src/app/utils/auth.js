// utils/auth.ts
export function isAuthenticated() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("user") !== null;
  }
  return false;
}

export function getUser() {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem("user") || "{}");
  }
  return null;
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
    window.location.href = "/login";
  }
}
