import React, { useState, useEffect } from "react";
import { getDatabase, ref, get, push, remove } from "firebase/database";
import Sidebar from "../Sidebar";
import { FaCheck, FaTimes, FaPrint, FaUserCheck, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Import the new icons
import emailjs from '@emailjs/browser';
import logo from "../assets/log.png";
import signature from "../assets/signature.png"
import SuperSidebar from "./SuperSidebar";
emailjs.init("xwRPlofu2gTI6nT-F");

const SGM = () => {
  const [morals, setMorals] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [verificationResults, setVerificationResults] = useState({});
  const [verificationPopup, setVerificationPopup] = useState(false);

  useEffect(() => {
    const fetchMorals = async () => {
      try {
        const db = getDatabase();
        const moralsRef = ref(db, "GMoral");
        const snapshot = await get(moralsRef);

        const moralsData = [];
        snapshot.forEach((childSnapshot) => {
          moralsData.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });
        setMorals(moralsData);
      } catch (error) {
        console.error("Error fetching morals:", error);
      }
    };

    fetchMorals();
  }, []);

  const filteredMorals = morals.filter((moral) =>
    moral.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApprove = async (index) => {
    if (window.confirm("Are you sure you want to approve this good moral request?")) {
      const approvedData = filteredMorals[index];
      const moralId = approvedData.id;
  
      // Add category information to the approved data
      approvedData.category = "Good Moral";
  
      try {
        const db = getDatabase();
        const approvedRef = ref(db, "Approved");
  
        await push(approvedRef, approvedData);
  
        // Remove the approved row from the original node
        const originalRef = ref(db, `GMoral/${moralId}`);
        await remove(originalRef);
  
        // Update state to reflect the removal of the approved row
        setMorals(morals.filter((_, i) => i !== index));
  
        // Send email using EmailJS
        const templateParams = {
          name: approvedData.name,
          email: approvedData.email, 
          category: approvedData.category
        };
  
        await emailjs.send("service_dr2yedj", "template_6m94ekc", templateParams);
  
        alert("Email sent successfully!");
      } catch (error) {
        console.error("Error approving moral:", error);
      }
    }
  };

  const handleDeny = async (index) => {
    if (window.confirm("Are you sure you want to deny this good moral request?")) {
      const deniedData = filteredMorals[index];
      const moralId = deniedData.id;
  
      // Add category information to the denied data
      deniedData.category = "Good Moral";
  
      try {
        const db = getDatabase();
        const deniedRef = ref(db, "Denied");
  
        // Update the denied node with the denied data
        await push(deniedRef, deniedData);
  
        // Remove the denied row from the original node
        const originalRef = ref(db, `GMoral/${moralId}`);
        await remove(originalRef);
  
        // Update state to reflect the removal of the denied row
        setMorals(morals.filter((_, i) => i !== index));
  
        // Send email using EmailJS
        const templateParams = {
          name: deniedData.name,
          email: deniedData.email, 
          category: deniedData.category
        };
  
        await emailjs.send("service_dr2yedj", "template_sx8sevr", templateParams);
  
        alert("Email sent successfully for denial!");
      } catch (error) {
        console.error("Error denying moral:", error);
      }
    }
  };

  const printRow = (index) => {
    const selectedMoral = filteredMorals[index];
    const { name, age, contact, email, purpose } = selectedMoral;
    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
    const goodMoralLetterContent = `
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
      <p style="font-weight: bold;">CERTIFICATE OF GOOD MORAL</p>
      &nbsp;<br />
        <p>This is to certify that <strong>${name}</strong> has been found to possess exemplary moral character and conduct.</p>
        &nbsp;<br />
        <p>Given this ${currentDate} at the Office of the Punong Barangay, Barangay Santa Cruz, Cebu City, Philippines.</p>
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
    printWindow.document.write(goodMoralLetterContent);
    printWindow.document.close();

    printWindow.print();
  };

  const handleVerify = async (index) => {
    const selectedMoral = filteredMorals[index];
    if (!selectedMoral || !selectedMoral.name) {
      console.error("Error: Selected moral or name is undefined.");
      return;
    }

    const nameToVerify = selectedMoral.name.toLowerCase();

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
    <div className="flex">
      <div className="sticky top-0 h-screen">
        <SuperSidebar />
      </div>
      <div className="ml-64 p-8 w-full">
        <h1 className="text-3xl mb-6 font-semibold">Good Moral Requests</h1>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
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
                placeholder="Search for applicant"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <table className="w-full text-lg text-left rtl:text-right text-gray-600 dark:text-gray-400">
            <thead className="text-sm text-gray-800 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-4 py-4">
                  Name
                </th>
                <th scope="col" className="px-4 py-4">
                  Age
                </th>
                <th scope="col" className="px-4 py-4">
                  Contact
                </th>
                <th scope="col" className="px-4 py-4">
                  Email
                </th>
                <th scope="col" className="px-4 py-4">
                  Purpose
                </th>
                <th scope="col" className="px-4 py-4">
                  Category
                </th>
                <th scope="col" className="px-4 py-4 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMorals.map((moral, index) => (
                <tr
                  key={moral.id}
                  className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
                >
                  <td className="px-4 py-4">{moral.name}</td>
                  <td className="px-4 py-4">{moral.age}</td>
                  <td className="px-4 py-4">{moral.contact}</td>
                  <td className="px-4 py-4">{moral.email}</td>
                  <td className="px-4 py-4">{moral.purpose}</td>
                  <td className="px-4 py-4">Good Moral</td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center items-center space-x-4">
                    <FaUserCheck
                        className="w-6 h-6 text-blue-500 cursor-pointer"
                        onClick={() => handleVerify(index)}
                      />
                      <FaCheck
                        className="w-6 h-6 text-green-500 cursor-pointer"
                        onClick={() => handleApprove(index)}
                      />
                      <FaTimes
                        className="w-6 h-6 text-red-500 cursor-pointer"
                        onClick={() => handleDeny(index)}
                      />
                      <button
                        className="w-6 h-6 text-blue-500 cursor-pointer"
                        onClick={() => printRow(index)}
                      >
                        <FaPrint className="mr-2" />
                      </button>
                     
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
                {verificationResults[index] === 'CHECK' ? (
                  <div>
                    
                    {/* Verified */}
                    <FaCheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4" />
                    <p className="text-lg font-semibold mb-2">Verified</p>
                    <p>The applicant is a resident of the barangay!</p>
                  </div>
                ) : verificationResults[index] === 'NO_CHECK' ? (
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

export default SGM;
