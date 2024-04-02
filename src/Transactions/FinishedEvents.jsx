import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import { getDatabase, ref, get } from "firebase/database";
import { Link, useNavigate } from "react-router-dom";

const FinishedEvents = () => {
  const navigate = useNavigate();
  const [finishedEvents, setFinishedEvents] = useState([]);

  useEffect(() => {
    const fetchFinishedEvents = async () => {
      const db = getDatabase();
      const finishedEventsRef = ref(db, "FinishedEvents");

      try {
        const snapshot = await get(finishedEventsRef);
        const finishedEventsData = [];
        snapshot.forEach((childSnapshot) => {
          finishedEventsData.push({
            id: childSnapshot.key,
            ...childSnapshot.val(),
          });
        });
        setFinishedEvents(finishedEventsData);
      } catch (error) {
        console.error("Error fetching finished events:", error);
      }
    };

    fetchFinishedEvents();
  }, []);

  return (
    <div className="h-screen flex overflow-hidden">
      <div className="sticky top-0 h-screen">
        <Sidebar />
      </div>
      <div className="flex-1 ml-64 bg-gray-100 p-6">
        <div className="flex justify-between items-center pb-6">
          <h1 className="text-xl font-bold">Finished Events</h1>
          <button
            className="bg-newpri hover:bg-jetblack text-white font-bold py-2 px-4 rounded"
            onClick={() => navigate("/about")}
          >
            Back to Events
          </button>
        </div>

        <div className="overflow-y-auto mt-6 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6 pb-5 pr-6">
          {finishedEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-md p-4">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h2 className="text-xl font-semibold">Event Title: {event.title}</h2>
              <p className="text-gray-600">Event Description: {event.description}</p>
              <p className="text-gray-600 mt-2">Date & Time: {event.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinishedEvents;
