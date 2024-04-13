import React, { useState, useEffect } from "react";
import { getDatabase, ref, get } from "firebase/database";
import Sidebar from "../Sidebar";
import SuperSidebar from "./SuperSidebar";

const SuperArchived = () => {
  const [archivedData, setArchivedData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchArchivedData = async () => {
      try {
        const db = getDatabase();
        const archivedRef = ref(db, "Archived");
        const snapshot = await get(archivedRef);

        const data = [];
        snapshot.forEach((childSnapshot) => {
          data.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });
        setArchivedData(data);
      } catch (error) {
        console.error("Error fetching archived data:", error);
      }
    };

    fetchArchivedData();
  }, []);

  const handlePrintAll = () => {
    const printableContent = document.getElementById("printable-content").innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printableContent;
    window.print();
    document.body.innerHTML = originalContent;
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex">
     <div className="sticky top-0 h-screen">
      <SuperSidebar />
      </div>
      <div className="ml-64 p-8 w-full">
        <h1 className="text-3xl mb-6 font-semibold">Archived Requests</h1>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          {/* Search input */}
          <div className="pb-6 bg-white dark:bg-gray-900">
            <label htmlFor="table-search" className="sr-only">
              Search
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-4 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="table-search"
                className="block pt-2 pb-2 ps-10 text-lg text-gray-900 border border-gray-300 rounded-lg w-96 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search for transaction"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
          className="mt-4 bg-newpri hover:bg-blue-600 text-white py-2 px-4 rounded-md"
          onClick={handlePrintAll}
        >
          Print All
        </button>
          </div>
          {/* Table */}
          <div id="printable-content">
            {/* Header for printing */}
            <h1 className="text-3xl mb-6 font-semibold text-center ">Archived Transactions</h1>
            {/* Current date */}
            <p className="text-center mb-4">{currentDate}</p>
            <table className="w-full text-lg text-left rtl:text-right text-gray-600 dark:text-gray-400">
              <thead className="text-sm text-gray-800 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-8 py-4">
                    Name
                  </th>
                  <th scope="col" className="px-8 py-4">
                    Contact
                  </th>
                  <th scope="col" className="px-8 py-4">
                    Email
                  </th>
                  <th scope="col" className="px-8 py-4">
                    Category
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Map through archivedData filtered by searchQuery */}
                {archivedData
                  .filter((item) =>
                    item.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((item) => (
                    <tr key={item.id} className="bg-white">
                      <td className="px-8 py-4">{item.name}</td>
                      <td className="px-8 py-4">{item.contact}</td>
                    
                      <td className="px-8 py-4">{item.category}</td>
                      <td className="px-8 py-4">{item.email}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
       
      </div>
      {/* Print styles */}
      <style>
        {`
          @media print {
            /* Example print styles */
            body {
              font-size: 14px;
            }
            table {
              width: 100%;
            }
            th, td {
              padding: 8px;
            }
            .flex {
              display: block;
            }
            .ml-64, .p-8 {
              margin-left: 0;
              padding: 0;
            }
            .bg-white, .dark:bg-gray-900 {
              background-color: transparent !important;
            }
            .border {
              border: none !important;
            }
            .text-lg {
              font-size: inherit !important;
            }
            .focus\:ring-blue-500, .focus\:ring-blue-600, .dark:focus\:ring-blue-500, .dark:focus\:ring-blue-600 {
              box-shadow: none !important;
            }
            /* Hide search input */
            #table-search {
              display: none;
            }
            /* Hide Print All button */
            .bg-blue-500, .hover\:bg-blue-600 {
              display: none;
            }
          }
        `}
      </style>
    </div>
  );
};

export default SuperArchived;
