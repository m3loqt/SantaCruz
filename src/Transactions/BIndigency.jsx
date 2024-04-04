import React, { useState, useEffect } from "react";
import { getDatabase, ref, get, push, remove } from "firebase/database";
import Sidebar from "../Sidebar";
import {
  FaCheck,
  FaTimes,
  FaPrint,
  FaCheckCircle,
  FaTimesCircle,
  FaUserCheck,
} from "react-icons/fa"; // Import the new icon
import emailjs from "@emailjs/browser";
import logo from "../assets/log.png";
import signature from "../assets/signature.png"

emailjs.init("xwRPlofu2gTI6nT-F");

const BIndigency = () => {
  const [indigencies, setIndigencies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [verificationResults, setVerificationResults] = useState({});
  const [verificationPopup, setVerificationPopup] = useState(false); // State for controlling verification pop-up

  useEffect(() => {
    const fetchIndigencies = async () => {
      try {
        const db = getDatabase();
        const indigenciesRef = ref(db, "Indigencies");
        const snapshot = await get(indigenciesRef);

        const indigencyData = [];
        snapshot.forEach((childSnapshot) => {
          indigencyData.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });
        setIndigencies(indigencyData);
      } catch (error) {
        console.error("Error fetching indigencies:", error);
      }
    };

    fetchIndigencies();
  }, []);

  const filteredIndigencies = indigencies.filter((indigency) =>
    indigency.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApprove = async (index) => {
    if (
      window.confirm("Are you sure you want to approve this indigency request?")
    ) {
      const approvedData = filteredIndigencies[index];
      const indigencyId = approvedData.id;

      approvedData.category = "Barangay Indigency";
      try {
        const db = getDatabase();
        const approvedRef = ref(db, "Approved");

        await push(approvedRef, approvedData);

        const originalRef = ref(db, `Indigencies/${indigencyId}`);
        await remove(originalRef);

        setIndigencies(indigencies.filter((_, i) => i !== index));

        // Send email using EmailJS
        const templateParams = {
          name: approvedData.name,
          email: approvedData.email,
          category: approvedData.category,
        };

        await emailjs.send(
          "service_dr2yedj",
          "template_6m94ekc",
          templateParams
        );

        alert("Email sent successfully!");
      } catch (error) {
        console.error("Error approving indigency:", error);
        console.error("EmailJS Error Response:", error.response);
      }
    }
  };

  const handleDeny = async (index) => {
    if (
      window.confirm("Are you sure you want to deny this indigency request?")
    ) {
      const deniedData = { ...filteredIndigencies[index] };
      const indigencyId = deniedData.id;

      deniedData.category = "Barangay Indigency";

      try {
        const db = getDatabase();
        const deniedRef = ref(db, "Denied");

        await push(deniedRef, deniedData);

        const originalRef = ref(db, `Indigencies/${indigencyId}`);
        await remove(originalRef);

        setIndigencies(indigencies.filter((_, i) => i !== index));

        // Send email using EmailJS for denial
        const templateParams = {
          name: deniedData.name,
          category: deniedData.category,
          email: deniedData.email,
        };

        await emailjs.send(
          "service_dr2yedj",
          "template_sx8sevr",
          templateParams
        );

        alert("Email sent successfully for denial!");
      } catch (error) {
        console.error("Error denying indigency:", error);
      }
    }
  };

  const printRow = (index) => {
    const selectedIndigency = filteredIndigencies[index];
    const { name, age, gender, status } = selectedIndigency;
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()} of ${currentDate.toLocaleString(
      "en-US",
      { month: "long" }
    )}, ${currentDate.getFullYear()}`;
    const certificationContent = `
    <div class="text-center" style="font-family: Arial, sans-serif; text-align: justify;">
      &nbsp;<br />
      &nbsp;<br /> 
      <img src="${logo}" alt="Logo" style="margin: 0 auto; max-width: 100px;"/>
      <p>Republic of the Philippines</p>
      <p>Province of Cebu</p>
      <p>Municipality of Cebu City</p>
      <p>BARANGAY SANTA CRUZ</p>
      &nbsp;<br />
      &nbsp;&nbsp;&nbsp;&nbsp; <p style="font-weight: bold;">OFFICE OF THE PUNONG BARANGAY</p>
      &nbsp;<br />
      <p style="font-weight: bold;">CERTIFICATE OF INDIGENCY</p>
      &nbsp;<br />
      <p>To Whom It May Concern:</p>
      &nbsp;<br />
      <p>This is to certify that ${name}, of legal age, ${gender}, ${status}, Filipino, is a resident of this Barangay and is one of the indigents in our barangay.</p>
      &nbsp;<br />
      <p>This certification is being issued upon the request of the above-named person for whatever legal purpose it may serve her best.</p>
      &nbsp;<br />
      <p>Issued this ${formattedDate} at the Office of the Punong Barangay, Barangay Santa Cruz, Cebu City, Philippines.</p>
      &nbsp;<br />
      &nbsp;<br />
      &nbsp;<br />
      <p style="font-weight: bold;">SAMPLE OFFICER</p>
      <img src="${signature}" alt="Jerome Lim's Signature" style="max-width: 200px"/>
      <p>Officer In Charge</p>
    </div>
  `;

    const printWindow = window.open("", "_blank");
    printWindow.document.open();
    printWindow.document.write(certificationContent);
    printWindow.document.close();

    // Print the content
    printWindow.print();
  };

  const handleVerify = async (index) => {
    const selectedIndigency = filteredIndigencies[index];
    if (!selectedIndigency || !selectedIndigency.name) {
      console.error("Error: Selected indigency or name is undefined.");
      return;
    }

    const nameToVerify = selectedIndigency.name.toLowerCase();

    try {
      const db = getDatabase();
      const residentsRef = ref(db, "Residents");
      const snapshot = await get(residentsRef);

      if (!snapshot.exists()) {
        console.error("Error: Residents snapshot does not exist.");
        return;
      }

      let foundMatch = false;
      snapshot.forEach((childSnapshot) => {
        const residentData = childSnapshot.val();
        if (!residentData || !residentData.name) {
          console.error(
            "Error: Resident data or name is undefined.",
            residentData
          );
          return;
        }

        const residentName = residentData.name.toLowerCase();
        if (residentName === nameToVerify) {
          foundMatch = true;
          return;
        }
      });

      // Set verification result based on whether a match was found
      setVerificationResults((prevState) => ({
        ...prevState,
        [index]: foundMatch ? "CHECK" : "NO_CHECK",
      }));

      // Open verification pop-up
      setVerificationPopup(true);
    } catch (error) {
      console.error("Error verifying resident:", error);
    }
  };

  const closeVerificationPopup = () => {
    setVerificationResults({});
    setVerificationPopup(false);
  };

  return (
    <div className="flex flex-col sm:flex-row">
      <div className="sticky top-0 h-1/6 sm:h-screen w-full sm:w-64">
        <Sidebar />
      </div>
      <div className="w-full sm:ml-0 p-4 sm:p-8">
        <h1 className="ml-5 text-xl sm:text-3xl mb-4 sm:mb-6 font-semibold">
          Indigency Requests
        </h1>
        <div className="ml-5 relative overflow-x-hidden shadow-md sm:rounded-lg">
          <div className="pb-4 sm:pb-6 bg-white dark:bg-gray-900">
            <label htmlFor="table-search" className="sr-only">
              Search
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-2 sm:ps-4 pointer-events-none">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400"
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
                className="block pt-1 pb-2 ps-8 sm:ps-10 text-base sm:text-lg text-gray-900 border border-gray-300 rounded-lg w-full sm:w-96 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search for applicant"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <table className=" w-full text-base sm:text-lg text-left rtl:text-right  text-gray-600 dark:text-gray-400">
            <thead className="text-sm sm:text-base text-gray-800 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-2 sm:px-4 py-2 sm:py-4">
                  Name
                </th>
                <th scope="col" className="px-2 sm:px-1 py-2 sm:py-4">
                  Age
                </th>
                <th scope="col" className="px-2 sm:px-3 py-2 sm:py-4">
                  Gender
                </th>
                <th scope="col" className="px-2 sm:px-1 py-2 sm:py-4">
                  Contact
                </th>
                <th scope="col" className="px-0 sm:px-0 py-2 sm:py-4">
                  Email
                </th>
                <th scope="col" className="px-0 sm:px-0 py-2 sm:py-4">
                  Address
                </th>
                <th scope="col" className="px-2 sm:px-3 py-2 sm:py-4">
                  Status
                </th>
                <th scope="col" className="px-2 sm:px-1 py-2 sm:py-4">
                  Category
                </th>
                <th
                  scope="col"
                  className="px-1 sm:px-1 py-2 sm:py-4 text-center"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredIndigencies.map((indigency, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                >
                  <td className="px-2 sm:px-4 py-2 sm:py-4">
                    {indigency.name}
                  </td>
                  <td className="px-2 sm:px-1 py-2 sm:py-4">{indigency.age}</td>
                  <td className="px-2 sm:px-3 py-2 sm:py-4">
                    {indigency.gender}
                  </td>
                  <td className="px-2 sm:px-1 py-2 sm:py-4">
                    {indigency.contact}
                  </td>
                  <td className="px-0 sm:px-0 py-2 sm:py-4">
                    {indigency.email}
                  </td>
                  <td className="px-0 sm:px-0 py-2 sm:py-4">
                    {indigency.address}
                  </td>
                  <td className="px-2 sm:px-3 py-2 sm:py-4">
                    {indigency.status}
                  </td>
                  <td className="px-2 sm:px-1 py-2 sm:py-4">
                    Barangay Indigency
                  </td>
                  <td className="px-2 sm:px-3 py-2 sm:py-4 text-center">
                    <div className="flex justify-center">
                      <div className="flex space-x-2 sm:space-x-4">
                        {verificationResults[index] === "CHECK" ? (
                          <FaCheckCircle className="w-3 h-3 sm:w-5 sm:h-5 text-green-500" />
                        ) : verificationResults[index] === "NO_CHECK" ? (
                          <FaTimesCircle className="w-3 h-3 sm:w-5 sm:h-5 text-red-500" />
                        ) : (
                          <FaUserCheck
                            className="w-3 h-3 sm:w-5 sm:h-5 text-blue-500 hover:text-blue-600 cursor-pointer"
                            onClick={() => handleVerify(index)}
                          />
                        )}
                        <button
                          className="focus:outline-none"
                          onClick={() => handleApprove(index)}
                        >
                          <FaCheck className="w-3 h-3 sm:w-5 sm:h-5 text-green-500 hover:text-green-600 cursor-pointer" />
                        </button>
                        <FaTimes
                          className="w-6 h-6 sm:w-5 sm:h-5 text-red-500 hover:text-red-600 cursor-pointer"
                          onClick={() => handleDeny(index)}
                        />
                        <FaPrint
                          className="w-6 h-6 sm:w-5 sm:h-5 text-blue-500 hover:text-blue-600 cursor-pointer"
                          onClick={() => printRow(index)}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Verification Pop-up */}
      {verificationPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg max-w-md text-center">
            {Object.keys(verificationResults).map((index) => (
              <div key={index}>
                {verificationResults[index] === "CHECK" ? (
                  <div>
                    {/* Verified */}
                    <FaCheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4" />
                    <p className="text-lg font-semibold mb-2">Verified</p>
                    <p>The applicant is a resident of the barangay!</p>
                  </div>
                ) : verificationResults[index] === "NO_CHECK" ? (
                  <div>
                    {/* Not Verified */}
                    <FaTimesCircle className="w-24 h-24 text-red-500 mx-auto mb-4" />
                    <p className="text-lg font-semibold mb-2">Not Verified</p>
                    <p>The applicant is not a resident of the barangay!</p>
                  </div>
                ) : null}
              </div>
            ))}
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none"
              onClick={closeVerificationPopup}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BIndigency;
