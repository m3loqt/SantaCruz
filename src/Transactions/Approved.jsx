import React, { useState, useEffect } from "react";
import { getDatabase, ref, get, remove, set } from "firebase/database";
import Sidebar from "../Sidebar";

const Approved = () => {
  const [approvedData, setApprovedData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchApprovedData = async () => {
      try {
        const db = getDatabase();
        const approvedRef = ref(db, "Approved");
        const snapshot = await get(approvedRef);

        const data = [];
        snapshot.forEach((childSnapshot) => {
          data.push({ id: childSnapshot.val().id, ...childSnapshot.val() });
        });
        setApprovedData(data);
      } catch (error) {
        console.error("Error fetching approved data:", error);
      }
    };

    fetchApprovedData();
  }, []);

  const handleArchive = async (id, name, contact, category, email) => {
    if (window.confirm("Are you sure you want to archive this item?")) {
      try {
        const db = getDatabase();
        const approvedRef = ref(db, "Approved");

        // Get the snapshot of approved data
        const snapshot = await get(approvedRef);

        // Find the correct child node by matching the ID
        snapshot.forEach((childSnapshot) => {
          const childData = childSnapshot.val();
          if (childData.id === id) {
            const itemRef = ref(db, `Approved/${childSnapshot.key}`);

            // Remove the item from the Approved node
            remove(itemRef);

            // Archive the item
            const archivedRef = ref(db, "Archived/" + id);
            const itemToArchive = { name, contact, category, email };
            set(archivedRef, itemToArchive);
          }
        });

        // Update the local state to remove the archived item
        setApprovedData((prevData) =>
          prevData.filter((item) => item.id !== id)
        );

        alert("Item archived successfully!");
      } catch (error) {
        console.error("Error archiving item:", error);
      }
    }
  };

  // Filter approvedData based on searchQuery
  const filteredApprovedData = approvedData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePrintAll = () => {
    const printableContent =
      document.getElementById("printable-content").innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printableContent;
    window.print();
    document.body.innerHTML = originalContent;
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex">
     <div className="sticky top-0 h-screen">
      <Sidebar />
      </div>
      <div className="ml-64 p-8 w-full">
        <h1 className="text-3xl mb-6 font-semibold">Approved Requests</h1>
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

        <div
          id="printable-content"
          className="overflow-x-auto shadow-md sm:rounded-lg "
        >
          <h1 className="text-3xl mb-6 font-semibold text-center ">
            Approved Transactions
          </h1>
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
                <th scope="col" className="px-8 py-4 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredApprovedData.map((item) => (
                <tr key={item.id} className="bg-white">
                  <td className="px-8 py-4">{item.name}</td>
                  <td className="px-8 py-4">{item.contact}</td>
                  <td className="px-8 py-4">{item.email}</td>
                  <td className="px-8 py-4">{item.category}</td>
                  <td className="px-8 py-4">
                    <div className="flex justify-center">
                      <button
                        className="w-24 bg-jetblack hover:jetblack-600 text-white py-2 px-4 rounded-md"
                        onClick={() =>
                          handleArchive(
                            item.id,
                            item.name,
                            item.contact,
                            item.email,
                            item.category
                          )
                        }
                      >
                        Archive
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
              width: 100
              %;
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

export default Approved;
