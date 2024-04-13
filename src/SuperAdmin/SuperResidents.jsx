import React, { useState, useEffect } from "react";
import { getDatabase, ref, push, onValue } from "firebase/database";
import { MdCheckCircle } from "react-icons/md";
import SuperSidebar from "./SuperSidebar";

const SuperResidents = () => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [residents, setResidents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false); // New state variable

  useEffect(() => {
    const fetchData = async () => {
      const db = getDatabase();
      const residentsRef = ref(db, "Residents");
      onValue(residentsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const residentsList = Object.entries(data).map(([key, value]) => ({ id: key, ...value }));
          setResidents(residentsList);
        }
      });
    };
    fetchData();
  }, []);

  const handleAddResident = () => {
    setShowForm(true);
    clearFormFields();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const db = getDatabase();
    const residentsRef = ref(db, "Residents");
  
    const newResidentData = {
      name,
      dateOfBirth,
      address,
      contactNumber,
      email,
    };
  
    try {
      await push(residentsRef, newResidentData);
      setShowForm(false);
      clearFormFields();
      setShowConfirmation(true); // Show confirmation dialog
    } catch (error) {
      console.error("Error saving resident data:", error);
    }
  };
  
  const handleCancel = () => {
    setShowForm(false);
    clearFormFields();
  };

  const clearFormFields = () => {
    setName("");
    setDateOfBirth("");
    setAddress("");
    setContactNumber("");
    setEmail("");
  };

  const filteredResidents = residents.filter((resident) =>
    resident.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex">
      <SuperSidebar />
      <div className="ml-64 p-8 w-full">
        <h1 className="text-3xl mb-6 font-semibold">Residents</h1>
        <div className="flex justify-between mb-4">
          <div>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-64 pl-2.5 pr-8 py-2.5 border rounded-md"
            />
          </div>
          <div>
            <button
              className="bg-newpri hover:bg-jetblack text-white py-2 px-4 rounded-md mr-4"
              onClick={handleAddResident}
            >
              Add Resident
            </button>
          </div>
        </div>
        {showForm && (
          <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-md" style={{ width: '600px' }}>
              <h2 className="text-2xl font-semibold mb-6">Registration Info</h2> 

              <form className="grid grid-cols-1 gap-6" onSubmit={handleFormSubmit}>
                <div>
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                    Name:
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    required 
                  />
                </div>
                <div>
                  <label htmlFor="dateOfBirth" className="block text-gray-700 font-medium mb-2">
                    Date of Birth:
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-gray-700 font-medium mb-2">
                    Address:
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="contactNumber" className="block text-gray-700 font-medium mb-2">
                    Contact Number:
                  </label>
                  <input
                    type="text"
                    id="contactNumber"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    Email:
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-newpri hover:bg-jetblack text-white py-2 px-4 rounded-md mt-4 mr-2"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-300 hover:bg-jetblack py-2 px-4 rounded-md mt-4 text-white"
                  >
                    Exit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Confirmation Dialog */}
        {showConfirmation && (
          <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-md text-center" style={{ width: '320px' }}>
              <div className="flex justify-center mb-4">
                <MdCheckCircle className="text-green-500 w-16 h-16" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">Success!</h2>
              <p className="text-lg">Resident added successfully!</p>
              <button
                className="bg-newpri hover:bg-jetblack text-white py-2 px-4 rounded-md mt-10"
                onClick={() => setShowConfirmation(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
        {/* End Confirmation Dialog */}
        {/* Displaying tables fetching all data from the Residents node */}
        <div className="mt-8">
          
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Birth</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Number</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResidents.map((resident, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">{resident.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{resident.dateOfBirth}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{resident.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{resident.contactNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{resident.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* End of tables */}
      </div>
    </div>
  );
};

export default SuperResidents;
