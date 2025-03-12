"use client";

import React, { useEffect, useState } from "react";
import {
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlinePlusSmall,
} from "react-icons/hi2";
import { toast, ToastContainer } from "react-toastify";
import {
  registerUser,
  resetUserPassword,
  resetAuthCode,
  getUsers,
  getDepartments,
} from "../services/userService";
import "react-toastify/dist/ReactToastify.css";
import Modal from "../components/Modal";
import KEY_GENERATOR from "../functions/functions";

export default function UserForm() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [authKey, setAuthKey] = useState("");
  const [role, setRole] = useState("Administrator");
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "password" or "authCode"
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newValue, setNewValue] = useState("");
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const openModal = (type, userId) => {
    setModalType(type);
    setSelectedUserId(userId);
    setNewValue(""); // Clear input for new value
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType("");
    setSelectedUserId(null);
    setNewValue("");
  };

  const saveModal = async () => {
    if (!newValue) {
      toast.error(`Please enter a new ${modalType}`);
      return;
    }

    try {
      if (modalType === "password") {
        await resetUserPassword(selectedUserId, newValue);
        toast.success("Password reset successfully");
      } else if (modalType === "authCode") {
        await resetAuthCode(selectedUserId, newValue);
        toast.success("Auth Code reset successfully");
      }
      await fetchUsers();
      closeModal();
    } catch (error) {
      toast.error(`Failed to reset ${modalType}`);
      console.log("Reset Failed", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    if (!username) {
      toast.error("Username is required");
      return false;
    }
    if (!email) {
      toast.error("Email is required");
      return false;
    }
    if (!authKey) {
      toast.error("Auth Key is required");
      return false;
    }
    if (!password) {
      toast.error("Password is required");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    if (!selectedDepartment) {
      toast.error("Department is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const user_id = Math.floor(Math.random() * 10000); // Example user ID, replace with actual logic

    const created_at = new Date().toISOString(); // ISO format for consistency
    const last_login = new Date().toISOString(); // Set last login to current time, or leave as null

    // const roleValue = role === "Administrator" ? 1 : 2;

    const userData = {
      user_id,
      username,
      email,
      password,
      created_at,
      last_login,
      isActive,
      authKey,
      role: role, //: roleValue,
      DID: selectedDepartment,
    };

    try {
      const response = await registerUser(userData);

      if (response.ok) {
        toast.success("User Registered Successfully");
        // Reset form values
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setEmail("");
        setAuthKey("");
        setIsActive(false);
        setTimeout(() => {
          window.location.reload();
        }, 10000);
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Duplicate user detected") {
          toast.error("This user already exists.");
        } else {
          toast.error("Failed to Register User");
        }
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  const handleButtonClick = () => {
    setIsFormVisible(true);
    // setIsUpdateClicked(false);
  };

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      // console.log("fetched users : ", response);
      setUsers(response.data || response);
      // console.log("Receivers state updated: ", response.data || response);
    } catch (error) {
      toast.error("Error fetching Users");
      console.error("Error fetching Users", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await getDepartments();
      setDepartments(response.data || response);
    } catch (error) {
      toast.error("Error fetching Users");
      console.error("Error fetching Users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, []);

  return (
    <div>
      <ToastContainer />
      <Modal
        isOpen={isModalOpen}
        title={`Reset ${modalType === "password" ? "Password" : "Auth Code"}`}
        onClose={closeModal}
        onSave={saveModal}
      >
        <div>
          <label className="block text-sm font-medium text-gray-900">
            New {modalType === "password" ? "Password" : "Auth Code"}
          </label>
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="mt-2 block w-full rounded-md border border-gray-300 py-1.5 px-2 text-gray-900"
          />
        </div>
      </Modal>

      <div className="flex md:flex-row flex-col justify-between items-center mb-4 p-4 border border-cyan-600 rounded-xl">
        <div>
          <h2 className="text-base text-center md:text-left font-semibold leading-7 text-gray-900">
            User Manager
          </h2>
          <p className="mt-1 text-sm text-center md:text-left leading-6 text-gray-600">
            This form will be used to register new users.
          </p>
        </div>
        <div className="flex gap-3 items-center justify-center">
          <button
            onClick={handleButtonClick}
            className="flex gap-2 items-center justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 duration-300 ease-in-out"
          >
            New
            <HiOutlinePlusSmall className="text-xl font-bold" />
          </button>
        </div>
      </div>
      {isFormVisible && (
        <form
          onSubmit={handleSubmit}
          className="p-4 border border-cyan-600 rounded-xl"
        >
          <div className="space-y-12 ">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-xl font-semibold leading-7 text-gray-900">
                Users
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                This form will be used to register new users.
              </p>

              <div className="mt-10 grid grid-cols-4 gap-x-6 gap-y-8 sm:grid-cols-6">
                {/* Username */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Username
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="block w-full rounded-md border border-cyan-600 py-1.5 px-2 text-gray-900"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                  <div className="mt-2 relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-md border border-cyan-600 py-1.5 px-2 text-gray-900"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                    >
                      {showPassword ? <HiOutlineEye /> : <HiOutlineEyeSlash />}{" "}
                      {/* Eye icon for showing/hiding password */}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Confirm Password
                  </label>
                  <div className="mt-2 relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full rounded-md border border-cyan-600 py-1.5 px-2 text-gray-900"
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <HiOutlineEye />
                      ) : (
                        <HiOutlineEyeSlash />
                      )}{" "}
                      {/* Separate icon for confirm password */}
                    </button>
                  </div>
                </div>

                {/* Email */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-md border border-cyan-600 py-1.5 px-2 text-gray-900"
                    />
                  </div>
                </div>

                {/* Role */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Role
                  </label>
                  <div className="mt-2">
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="block w-full rounded-md border border-cyan-600 py-1.5 px-2 text-gray-900"
                    >
                      <option value="Administrator">Administrator</option>
                      <option value="Manager">Manager</option>
                      <option value="Executive">Executive</option>
                      <option value="Receiver">Receiver</option>
                      <option value="Cashier">Cashier</option>
                    </select>
                  </div>
                </div>
                {/* Department */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Department
                  </label>
                  <div className="mt-2 max-h-[150px]">
                    <select
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="block w-full rounded-md border border-cyan-600 py-1.5 px-2 text-gray-900 max-h-[150px] overflow-y-auto z-0"
                      style={{ maxHeight: "150px" }}
                    >
                      <option value="" disabled>
                        Select Department
                      </option>
                      {departments.map((dept) => (
                        <option
                          key={dept.DID}
                          value={dept.DID}
                          className="px-2 max-h-[150px]"
                        >
                          {dept.Department}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Secret Key */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Auth Key
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={authKey}
                      onChange={(e) => setAuthKey(e.target.value)}
                      className="block w-full rounded-md border border-cyan-600 py-1.5 px-2 text-gray-900"
                    />
                  </div>
                </div>

                {/* Active Status - Toggle Switch */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Status
                  </label>
                  <div className="mt-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={() => setIsActive(!isActive)}
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      <span className="ml-3 text-sm font-medium text-gray-900">
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="button"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      )}
      <div className="flex justify-between items-center mb-4 p-4 border border-cyan-600 rounded-xl">
        <div className="overflow-x-auto w-full rounded-xl">
          <div className="mt-2">
            <h2 className="text-lg font-semibold">Registered Users</h2>
            <table className="min-w-full mt-4 table-auto border-collapse rounded">
              <thead>
                <tr>
                  <th className="border px-4 py-2 disabled:">ID</th>
                  <th className="border px-4 py-2">Username</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Role</th>
                  <th className="border px-4 py-2">Auth Code</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={KEY_GENERATOR(user.user_id)}>
                    <td className="border px-4 py-2">{user.id}</td>
                    <td className="border px-4 py-2">{user.name}</td>
                    <td className="border px-4 py-2">{user.email}</td>
                    <td className="border px-4 py-2">{user.role}</td>
                    <td className="border px-4 py-2">{user.authKey}</td>
                    <td className="flex items-center justify-center gap-3 border px-2 py-2">
                      <button
                        onClick={() => openModal("password", user.id)}
                        className="bg-yellow-500 text-white py-1 px-3 rounded"
                      >
                        Reset Password
                      </button>
                      <button
                        onClick={() => openModal("authCode", user.id)}
                        className="bg-blue-500 text-white py-1 px-3 rounded ml-2"
                      >
                        Reset Auth Code
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
