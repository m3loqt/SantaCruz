import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import { getDatabase, ref, onValue, get } from "firebase/database";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAOW8-bsgmp1NWhlj65Kc_URybr4UDmMRg",
  authDomain: "santacruz-16ea3.firebaseapp.com",
  databaseURL: "https://santacruz-16ea3-default-rtdb.firebaseio.com",
  projectId: "santacruz-16ea3",
  storageBucket: "santacruz-16ea3.appspot.com",
  messagingSenderId: "1061941671287",
  appId: "1:1061941671287:web:368d7ee5d627e6f5bedd72",
  measurementId: "G-3K05JNQ0K8",
};

const app = initializeApp(firebaseConfig);

const Dashboard = () => {
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const [formCount, setFormCount] = useState(0); // Separate useState for counting forms
  const [feedbacks, setFeedbacks] = useState([]);
  const [eventsCount, setEventsCount] = useState(0);
  const [approvedCounts, setApprovedCounts] = useState({
    indigencies: 0,
    clearances: 0,
    gMoral: 0,
  });
  const [deniedCounts, setDeniedCounts] = useState({
    indigencies: 0,
    clearances: 0,
    gMoral: 0,
  });
  const [newProcessCount, setNewProcessCount] = useState(0);
  
    

  useEffect(() => {
    const database = getDatabase(app);
    const approvedRef = ref(database, "Approved");
    const deniedRef = ref(database, "Denied");
    const indigencysss = ref (database, "Indigencies");
    const gmoralsss = ref (database, "GMoral");
    const clearsss = ref (database, "Clearances");
    let indigencyCountss = 0;
    let gmoralCountss = 0;
     let clearanceCountss = 0;

     const fetchCounts = async () => {
      const indigencySnapshot = await get(indigencysss);
      const gmoralSnapshot = await get(gmoralsss);
      const clearanceSnapshot = await get(clearsss);
    
      if (indigencySnapshot.exists()) {
        indigencyCountss = Object.keys(indigencySnapshot.val()).length;
      }
    
      if (gmoralSnapshot.exists()) {
        gmoralCountss = Object.keys(gmoralSnapshot.val()).length;
      }
    
      if (clearanceSnapshot.exists()) {
        clearanceCountss = Object.keys(clearanceSnapshot.val()).length;
      }
    
      const totalFormsCount = indigencyCountss + gmoralCountss + clearanceCountss;
      setNewProcessCount(totalFormsCount);
    };
    

    fetchCounts();

    // Fetch count of approved requests
    onValue(approvedRef, (snapshot) => {
      if (snapshot.exists()) {
        const approvedData = snapshot.val();
        let indigencies = 0;
        let clearances = 0;
        let gMoral = 0;

        for (const key in approvedData) {
          const category = approvedData[key].category;
          if (category === "Barangay Indigency") {
            indigencies++;
          } else if (category === "Barangay Clearance") {
            clearances++;
          } else if (category === "Good Moral") {
            gMoral++;
          }
        }

        setApprovedCounts({ indigencies, clearances, gMoral });
        setFormCount(indigencies + clearances + gMoral);
      } else {
        setApprovedCounts({ indigencies: 0, clearances: 0, gMoral: 0 });
        setFormCount(0);
      }
    });

    // Fetch count of denied requests
    onValue(deniedRef, (snapshot) => {
      if (snapshot.exists()) {
        const deniedData = snapshot.val();
        let indigencies = 0;
        let clearances = 0;
        let gMoral = 0;

        for (const key in deniedData) {
          const category = deniedData[key].category;
          if (category === "Barangay Indigency") {
            indigencies++;
          } else if (category === "Barangay Clearance") {
            clearances++;
          } else if (category === "Good Moral") {
            gMoral++;
          }
        }

        setDeniedCounts({ indigencies, clearances, gMoral });
      } else {
        setDeniedCounts({ indigencies: 0, clearances: 0, gMoral: 0 });
      }
    });

    const eventsRef = ref(database, "Events");

    onValue(eventsRef, (snapshot) => {
      const eventsData = snapshot.val();
      if (eventsData) {
        const eventsArray = Object.values(eventsData);
        setEventsCount(eventsArray.length);
      } else {
        setEventsCount(0);
      }
    });

    const feedbacksRef = ref(database, "Feedbacks");
    onValue(feedbacksRef, (snapshot) => {
      const feedbacksData = snapshot.val();
      if (feedbacksData) {
        const feedbacksArray = Object.values(feedbacksData);
        setFeedbacks(feedbacksArray);
      } else {
        setFeedbacks([]);
      }
    });
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      const myChart = new Chart(chartRef.current, {
        type: "bar",
        data: {
          labels: ["Barangay Indigency", "Barangay Clearance", "Good Moral"],
          datasets: [
            {
              label: "Approved",
              data: [
                approvedCounts.indigencies,
                approvedCounts.clearances,
                approvedCounts.gMoral,
              ],
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
              ],
              borderWidth: 1,
            },
            {
              label: "Denied",
              data: [
                deniedCounts.indigencies,
                deniedCounts.clearances,
                deniedCounts.gMoral,
              ],
              backgroundColor: [
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
              ],
              borderColor: [
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      return () => {
        myChart.destroy();
      };
    }
  }, [approvedCounts, deniedCounts]);

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar /> 
      <div className="flex-1 ml-64 bg-gray-100 p-6"> 
        <div className="flex justify-between items-center pb-6"> 
          <div className="flex items-center space-x-4"> 
            <h1 className="text-2xl font-semibold">Dashboard</h1> 
            <p className="text-gray-600">Good Day Admin!</p> 
          </div> 
          <button 
            className="p-2 px-4 bg-red-500 text-white rounded-md hover:bg-jetblack focus:outline-none" 
            onClick={handleLogout} 
          > 
            Logout 
          </button> 
        </div> 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> 
          <div className="bg-white  rounded-lg shadow-md p-4">
            <p className="font-bold text-gray-700">Number of Events</p>
            <h2 className="text-2xl font-semibold text-gray-900">{eventsCount}</h2>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="font-bold text-gray-700">Forms to Process</p>
            <h2 className="text-2xl font-semibold text-gray-900">{newProcessCount}</h2>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="font-bold text-gray-700">Approved Requests</p>
            <h2 className="text-2xl font-semibold text-gray-900">
              {approvedCounts.indigencies + approvedCounts.clearances + approvedCounts.gMoral}
            </h2>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="font-bold text-gray-700">Denied Requests</p>
            <h2 className="text-2xl font-semibold text-gray-900">
              {deniedCounts.indigencies + deniedCounts.clearances + deniedCounts.gMoral}
            </h2>
          </div>
        </div> 
        <div className="flex mt-6"> 
          <div className="flex-1 mr-6">
            {/* Chart  */}
            <div className="  p-4"> 
              <div className="-mt-5" style={{ maxWidth: "100%", margin: "0 auto" }}>
                <canvas ref={chartRef} style={{ maxWidth: "100%", height: "175px" }}></canvas>
              </div>
            </div>
          </div> 
          <div className="w-1/4 mt-6 overflow-y-auto" style={{ maxHeight: "650px" }}>
            {/* Feedbacks */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold">Feedbacks</h2>
              <div className="mt-4">
                {feedbacks.map((feedback, index) => (
                  <div key={index} className="mb-4"> 
                    <p className="font-semibold">Name: {feedback.name}</p>
                    <p className="font-semibold">Email: {feedback.email}</p>
                    <p>Feedback: {feedback.feedback}</p> 
                  </div>
                ))}
              </div>
            </div>
          </div> 
        </div> 
      </div>
    </div>
  );
  
};

export default Dashboard;
