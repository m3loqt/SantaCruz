import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, get } from "firebase/database";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [challenge, setChallenge] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    generateChallenge();
  }, []); // Generate challenge on component mount

  // Function to handle login
  const handleLogin = async (event) => {
    event.preventDefault();
  
    // Check if the user's answer matches the challenge
    if (!checkAnswer()) {
      setError('Incorrect challenge answer. Please try again.');
      generateChallenge();
      return;
    }
  
    const db = getDatabase();
    const adminRef = ref(db, 'Admin');
    const superAdminRef = ref(db, 'Super');
  
    try {
      const adminSnapshot = await get(adminRef);
      const superAdminSnapshot = await get(superAdminRef);
  
      const adminData = adminSnapshot.val();
      const superAdminData = superAdminSnapshot.val();
  
      // Check if any admin matches the entered username
      const matchedAdmin = Object.values(adminData).find(admin => admin.username === username);
      
      // If no admin matches the username or the password is incorrect, check super admin credentials
      if (!matchedAdmin || matchedAdmin.password !== password) {
        // Check if the username and password match for super admin
        if (superAdminData && superAdminData.Username === username && superAdminData.Password === password) {
          navigate('/superadmin');
        } else {
          setError('Incorrect username or password. Please try again.');
          generateChallenge();
        }
      } else {
        // If username and password are correct, navigate to appropriate dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error retrieving admin data:', error);
      setError('An error occurred. Please try again later.');
      generateChallenge();
    }
  };
  

  // Function to generate a challenge
  const generateChallenge = () => {
    const randomNumber = Math.floor(Math.random() * 1000);
    const randomLetters = Math.random().toString(36).substr(2, 5).toUpperCase();
    const challengeString = `${randomNumber} - ${randomLetters}`;
    setChallenge(challengeString);
  };

  // Function to check if the user's answer matches the challenge
  const checkAnswer = () => {
    return userAnswer.trim().toUpperCase() === challenge.split(' - ')[1];
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-md rounded-lg shadow-xl bg-white backdrop-filter backdrop-blur-md px-8 py-12">
        <h2 className="text-center font-bold text-2xl mb-10">Admin Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-6 text-center">
            <label htmlFor="challenge" className="block text-sm font-bold text-gray-700 mb-2">
              I'm not a robot:
            </label>
            <div className="flex items-center justify-center mb-2">
              <img src={`https://via.placeholder.com/300x100.png?text=${challenge}`} alt="Challenge" className="mb-2 challenge-image" style={{ backgroundColor: 'white' }} />
            </div>
            <input
              type="text"
              id="challenge"
              className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter the letters after the hyphen"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md bg-newpri text-white font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-gray-500 text-sm">All rights reserved 2024</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
