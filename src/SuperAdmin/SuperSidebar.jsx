import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiLogOut } from 'react-icons/fi';
import image from "../assets/logo.png"


const SuperSidebar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="bg-newpri h-screen w-64 text-white absolute top-0 left-0">
      <div className="flex flex-col p-4">
      <img src={image} alt="Logo" className="w-28 h-28 mt-2 "/> {/* Logo */}
        <h1 className="text-4xl font-bold p-2 mt-4">Santa Cruz</h1>
        <ul className="mt-6 space-y-2">
        <li className="flex items-center hover:bg-primary rounded-md p-2">
            <NavLink
              to="/superadmin"
              activeClassName="text-yellow-500"
              exact
              className="flex-grow"
            >
              <div className="flex gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
                Dashboard
              </div>
            </NavLink>
          </li>
          <li className="flex items-center hover:bg-primary rounded-md p-2">
            <NavLink
              to="/admins"
              activeClassName="text-yellow-500"
              exact
              className="flex-grow"
            >
              <div className="flex gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
                Admins
              </div>
            </NavLink>
          </li>
          <li className="flex items-center hover:bg-primary rounded-md p-2">
            <NavLink
              to="/superresident"
              activeClassName="text-yellow-500"
              exact
              className="flex-grow"
            >
              <div className="flex gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
                Residents
              </div>
            </NavLink>
          </li>

          <li className="flex items-center hover:bg-primary rounded-md p-2">
            <NavLink
              to="/superevent"
              activeClassName="text-yellow-500"
              exact
              className="flex-grow"
            >
              <div className="flex gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                  />
                </svg>
                Events
              </div>
            </NavLink>
          </li>
          <li className="relative">
            <button
              type="button"
              onClick={toggleDropdown}
              className="flex items-center w-full p-2 text-base text-white transition duration-75 rounded-lg group  hover:bg-primary dark:text-white dark:hover:bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                />
              </svg>

              <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                Transactions
              </span>
              <svg
                className={`w-3 h-3 ${
                  isDropdownOpen ? "transform rotate-180" : ""
                }`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
            {isDropdownOpen && (
              <ul className="py-2 space-y-2">
                <li>
                  <NavLink
                    to="/sbi"
                    className="flex items-center w-full p-2 text-white-900 transition duration-75 rounded-lg pl-11 group hover:bg-primary dark:text-white dark:hover:bg-gray-700"
                  >
                    Barangay Indigency
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/sbc"
                    className="flex items-center w-full p-2 text-white-900 transition duration-75 rounded-lg pl-11 group hover:bg-primary dark:text-white dark:hover:bg-gray-700"
                  >
                    Barangay Clearance
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/sgm"
                    className="flex items-center w-full p-2 text-white-900 transition duration-75 rounded-lg pl-11 group hover:bg-primary dark:text-white dark:hover:bg-gray-700"
                  >
                    Good Moral
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
          <li className="flex items-center hover:bg-primary rounded-md p-2">
            <NavLink
              to="/superapproved"
              activeClassName="text-yellow-500"
              exact
              className="flex-grow"
            >
              <div className="flex gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12"
                  />
                </svg>
                Approved Requests
              </div>
            </NavLink>
          </li>
          <li className="flex items-center hover:bg-primary rounded-md p-2">
            <NavLink
              to="/superdenied"
              activeClassName="text-yellow-500"
              exact
              className="flex-grow"
            >
              <div className="flex gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                  />
                </svg>
                Denied Requests
              </div>
            </NavLink>
          </li>
          <li className="flex items-center hover:bg-primary rounded-md p-2">
            <NavLink
              to="/superarchived"
              activeClassName="text-yellow-500"
              exact
              className="flex-grow"
            >
              <div className="flex gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                  />
                </svg>
                Archived Requests
              </div>
            </NavLink>
          </li>
        </ul>
        <button
          className="bg-jetblack text-white py-3 hover:bg-red-500 px-4 flex items-center justify-center absolute bottom-4 left-4 w-56 rounded-md"
          onClick={handleLogout}
        >
          <FiLogOut className="w-6 h-6 mr-2" /> {/* Logout Icon */}
          Logout
        </button>
      </div>
    </div>
  );
};

export default SuperSidebar;
