// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { getApiUrl, LOGIN } from "../api/api";
// import Banner from "../assets/Invoice Book Login@4x.png";
// import Image from "next/image";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
// import { useAuth } from "@/src/context/AuthContext";

// export default function LoginPage() {
//   const { login, setIsAuthenticated } = useAuth();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const router = useRouter();

//   useEffect(() => {
//     const userString = localStorage.getItem("user");
//     if (userString) {
//       // const user = JSON.parse(userString);
//       setIsAuthenticated(true);
//       router.push("/"); // Redirect to home if user is already authenticated
//     }
//   }, [setIsAuthenticated, router]);

//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const response = await fetch(getApiUrl(LOGIN), {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ username, password }),
//       });

//       if (response.ok) {
//         const data = await response.json();

//         localStorage.setItem("authToken", data.token); // Store token
//         localStorage.setItem("user", JSON.stringify(data.user));

//         login({ token: data.token, user: data.user });

//         setIsAuthenticated(true);
//         toast.success("Login successful!");
//         setTimeout(() => {
//           router.push("/");
//         }, 1000);
//       } else {
//         const errorData = await response.json();
//         setError(errorData.error || "Login failed");
//         toast.error("Login failed");
//       }
//     } catch (error) {
//       if (error instanceof Error) {
//         setError(error.message);
//         toast.error(error.message);
//       } else {
//         setError("An unknown error occurred. Please try again.");
//         toast.error("An unknown error occurred. Please try again.");
//       }
//     }

//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-900 ">
//         {/* Toastify Container */}
//         <ToastContainer />

//         <div className="w-full max-w-md p-4 space-y-8 bg-slate-100 rounded-l-xl shadow-md h-96 flex flex-col items-center justify-center">
//           <h2 className="text-2xl font-bold text-center text-purple-900">
//             Login
//           </h2>
//           {error && <p className="text-red-500 text-center">{error}</p>}
//           <form onSubmit={handleLogin} className="space-y-4 w-full px-6">
//             <div>
//               <label
//                 htmlFor="username"
//                 className="block text-sm font-medium text-purple-900"
//               >
//                 Username
//               </label>
//               <input
//                 type="text"
//                 id="username"
//                 placeholder="Enter username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 className="w-full p-2 border border-purple-400 rounded"
//                 required
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="password"
//                 className="block text-sm font-medium text-purple-900 "
//               >
//                 Password
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 placeholder="Enter Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full p-2 border border-purple-400 rounded"
//                 required
//               />
//             </div>
//             <button
//               type="submit"
//               className="w-full p-2 text-white bg-purple-600 rounded hover:bg-purple-700 duration-300 ease-in-out"
//             >
//               Login
//             </button>
//           </form>
//         </div>
//         <div className="w-full max-w-md p-8 space-y-8 bg-slate-950 rounded-r-xl shadow-md h-96 flex items-center justify-center">
//           <Image
//             src={Banner}
//             alt="Banner Image"
//             // className="w-[300px]"
//             height={200}
//             width={300}
//             priority={true}
//           />
//         </div>
//       </div>
//     );
//   };
// }
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getApiUrl, LOGIN } from "../api/api";
import Banner from "../assets/Invoice Book Login@4x.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import { useAuth } from "@/src/context/AuthContext";
import Image from "next/image";

export default function LoginPage() {
  const { login, setIsAuthenticated } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userString = localStorage.getItem("user");
      if (userString) {
        setIsAuthenticated(true);
        router.push("/"); // Redirect to home if user is already authenticated
      }
    }
  }, [setIsAuthenticated, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(getApiUrl(LOGIN), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();

        localStorage.setItem("authToken", data.token); // Store token
        localStorage.setItem("user", JSON.stringify(data.user));

        login({ token: data.token, user: data.user });

        setIsAuthenticated(true);
        toast.success("Login successful!");
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        const errorData = await response.json();
        setError(errorData?.error || "Login failed");
        toast.error(errorData?.error || "Login failed");
      }
    } catch (error) {
      setError(error.message || "An unknown error occurred. Please try again.");
      toast.error(
        error.message || "An unknown error occurred. Please try again."
      );
    }
  };

  return (
    <div className="flex flex-row items-center justify-center min-h-screen bg-gray-900">
      {/* Toastify Container */}
      <ToastContainer />

      <div className="w-full max-w-md p-4 space-y-8 bg-slate-100 rounded-l-xl shadow-md h-96 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-center text-purple-900">
          Login
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4 w-full px-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-purple-900"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-purple-400 rounded"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-purple-900"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-purple-400 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 text-white bg-purple-600 rounded hover:bg-purple-700 duration-300 ease-in-out"
          >
            Login
          </button>
        </form>
      </div>
      <div className="w-full max-w-md p-8 space-y-8 bg-slate-950 rounded-r-xl shadow-md h-96 flex items-center justify-center">
        <Image
          src={Banner}
          alt="Banner Image"
          className="w-[300px]"
          priority={true}
          unoptimized
        />
      </div>
    </div>
  );
}
