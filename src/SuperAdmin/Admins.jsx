import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push, onValue, remove } from 'firebase/database';
import { MdCheckCircle } from 'react-icons/md';
import SuperSidebar from './SuperSidebar';

const Admins = () => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false); // New state variable

  useEffect(() => {
    const fetchData = async () => {
      const db = getDatabase();
      const adminsRef = ref(db, 'Admin');
      onValue(adminsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const adminsList = Object.entries(data).map(([key, value]) => ({ id: key, ...value }));
          setAdmins(adminsList);
        }
      });
    };
    fetchData();
  }, []);

  const handleAddAdmin = () => {
    setShowForm(true);
    clearFormFields();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const db = getDatabase();
    const adminRef = ref(db, 'Admin');

    const newAdminData = {
      name,
      email,
      username,
      password
    };

    try {
      await push(adminRef, newAdminData);
      setShowForm(false);
      clearFormFields();
      setShowConfirmation(true); // Show confirmation dialog
    } catch (error) {
      console.error('Error saving admin data:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    clearFormFields();
  };

  const clearFormFields = () => {
    setName('');
    setEmail('');
    setUsername('');
    setPassword('');
  };

  const filteredAdmins = admins.filter((admin) =>
  admin && admin.name && admin.name.toLowerCase().includes(searchTerm.toLowerCase())
);


  const handleDeleteAdmin = async (adminId) => {
    const db = getDatabase();
    const adminRef = ref(db, `Admin/${adminId}`);
    await remove(adminRef);
  };

  return (
    <div className="flex">
      <SuperSidebar />
      <div className="ml-64 p-8 w-full">
        <h1 className="text-3xl mb-6 font-semibold">Admins</h1>
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
              onClick={handleAddAdmin}
            >
              Add Admin
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
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    Email:
                  </label>
                  <input
                    type="text"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
                    Username:
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                    Password:
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              <p className="text-lg">Admin added successfully!</p>
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
        {/* Displaying tables fetching all data from the Admin node */}
        <div className="mt-8">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Username
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Password
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAdmins.map((admin, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">{admin.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{admin.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{admin.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{admin.password}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => handleDeleteAdmin(admin.id)}>Delete</button>
                  </td>
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

export default Admins;
