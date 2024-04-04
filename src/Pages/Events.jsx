import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import { useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, get, remove, update, onValue } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

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

const Events = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [finishedEventsCount, setFinishedEventsCount] = useState(0); // State variable for finished events count
  const [showForm, setShowForm] = useState(false);
  const [eventImage, setEventImage] = useState(null);
  const [eventImageURL, setEventImageURL] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDateTime, setEventDateTime] = useState("");
  const [editEventId, setEditEventId] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const db = getDatabase();
      const eventsRef = ref(db, "Events");
      try {
        const snapshot = await get(eventsRef);
        const eventData = [];
        snapshot.forEach((childSnapshot) => {
          eventData.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });
        setEvents(eventData);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    const fetchFinishedEventsCount = async () => {
      const db = getDatabase();
      const finishedEventsRef = ref(db, "FinishedEvents");
      try {
        onValue(finishedEventsRef, (snapshot) => {
          if (snapshot.exists()) {
            const finishedEventsData = snapshot.val();
            const count = Object.keys(finishedEventsData).length;
            setFinishedEventsCount(count);
          } else {
            setFinishedEventsCount(0);
          }
        });
      } catch (error) {
        console.error("Error fetching finished events count:", error);
      }
    };

    fetchEvents();
    fetchFinishedEventsCount();
  }, []);

  const clearForm = () => {
    setEventTitle("");
    setEventDescription("");
    setEventDateTime("");
    setEventImage(null);
    setEventImageURL("");
  };

  const handleAddOrUpdateEvent = async () => {
    if (!eventImage && !editEventId) {
      alert("Image is required for adding a new event.");
      return;
    }
    if (!eventDescription || !eventDateTime) {
      alert("Description and Date & Time are required!");
      return;
    }

    const storage = getStorage();
    const storageRef2 = storageRef(storage, `event_images/${eventImage.name}`);

    try {
      await uploadBytesResumable(storageRef2, eventImage);
      const imageURL = await getDownloadURL(storageRef2);

      const newEvent = {
        title: eventTitle,
        description: eventDescription,
        date: eventDateTime,
        image: imageURL,
        finished: false,
      };

      const db = getDatabase();
      if (editEventId) {
        await update(ref(db, `Events/${editEventId}`), {
          title: eventTitle,
          description: eventDescription,
          date: eventDateTime,
          image: imageURL,
        });
        setEditEventId(null);
        alert("Event updated successfully!");
      } else {
        await push(ref(db, "Events"), newEvent);
        alert("Event added successfully!");
      }

      setShowForm(false);
      clearForm();
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleEditEvent = (eventId, title, description, date, image) => {
    setEditEventId(eventId);
    setEventTitle(title);
    setEventDescription(description);
    setEventDateTime(date);
    setEventImageURL(image);
    setShowForm(true);
  };

  const handleFinishEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to finish this event?")) {
      const db = getDatabase();
      const eventRef = ref(db, `Events/${eventId}`);

      try {
        const snapshot = await get(eventRef);
        const eventData = snapshot.val();

        if (eventData) {
          const finishedEventsRef = ref(db, "FinishedEvents");
          await push(finishedEventsRef, eventData); // Push event data to FinishedEvents
          await remove(eventRef); // Remove the event from the Events node

          // Fetch updated events from database after finishing an event
          const updatedEventsSnapshot = await get(ref(db, "Events"));
          const updatedEventsData = [];
          updatedEventsSnapshot.forEach((childSnapshot) => {
            updatedEventsData.push({
              id: childSnapshot.key,
              ...childSnapshot.val(),
            });
          });
          setEvents(updatedEventsData); // Update state with updated events

          alert("Event finished successfully!");
        } else {
          console.error("Event data is null.");
        }
      } catch (error) {
        console.error("Error finishing event:", error);
      }
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      <div className="sticky top-0 h-screen">
        <Sidebar />
      </div>
      <div className="flex-1 ml-64 bg-gray-100 p-6">
        <div className="flex justify-between items-center pb-6">
          <h1 className="text-xl font-bold">Events</h1>
          
        </div>

        <div className="-mt-3 -mb-7 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-2">
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="font-bold text-gray-700">Number of Events</p>
            <h2 className="text-xl font-semibold text-gray-900">
              {events.length}
            </h2>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="font-bold text-gray-700">Finished Events</p>
            <h2 className="text-xl font-semibold text-gray-900">
              {finishedEventsCount}
            </h2>
          </div>
        </div>
        <div className=" mt-12 ">
          <button
            className="bg-newpri hover:bg-jetblack text-white font
            -bold py-2 px-4 rounded"
            onClick={() => setShowForm(true)}
          >
            Add New Event
          </button>
          <button
            className="bg-red-500 hover:bg-jetblack text-white font-bold py-2 px-4 rounded ml-4"
            onClick={() => navigate("/finished")}
          >
            Ended Events
          </button>
        </div>

        <div
          className="overflow-y-auto mt-6 grid grid-cols-1 md:grid-cols-4 lg:grid-cols
          -4 gap-6 pb-5 pr-6"
          style={{ maxHeight: "calc(100vh - 250px)" }}
        >
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-md p-4">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h2 className="text-xl font-semibold">
                Event Title: {event.title}
              </h2>
              <p className="text-gray-600">
                Event Description: {event.description}
              </p>
              <p className="text-gray-600 mt-2">Date & Time: {event.date}</p>
              {!event.finished && (
                <div className="text-center space-x-4">
                  <button
                    className="mt-4 inline-flex items-center bg-newpri hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleFinishEvent(event.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2V3zm2 2v2h6V5H8zm-2 4v8h12V9H6zm3 2a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9zm0 4a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    End Event
                  </button>
                  <button
                    className="mt-4 inline-flex items-center bg-newpri hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() =>
                      handleEditEvent(
                        event.id,
                        event.title,
                        event.description,
                        event.date,
                        event.image
                      )
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.707 3.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-.39.242l-4 1a1 1 0 0 1-1.22-1.22l1-4a1 1 0 0 1 .242-.39l9-9zM13 6l-1-1 3-3 1 1-3 3z"
                      />
                    </svg>
                    Edit Event
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">
                {editEventId ? "Edit" : "Add"} Event
              </h2>
              {eventImageURL && (
                <img
                  src={eventImageURL}
                  alt="Event Image"
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              <label className="block mb-2">Event Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setEventImage(e.target.files[0]);
                  setEventImageURL(URL.createObjectURL(e.target.files[0]));
                }}
                className="w-full mb-2 p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Event Title"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="w-full mb-2 p-2 border rounded"
              />
              <textarea
                placeholder="Event Description"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                className="w-full mb-2 p-2 border rounded"
              ></textarea>
              <input
                type="datetime-local"
                value={eventDateTime}
                onChange={(e) => setEventDateTime(e.target.value)}
                className="w-full mb-4 p-2 border rounded"
              />
              <div className="flex justify-end">
                <button
                  className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handleAddOrUpdateEvent}
                >
                  {editEventId ? "Update" : "Add"}
                </button>
                <button
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => {
                    setShowForm(false);
                    setEditEventId(null);
                    clearForm(); // Clear form fields when canceling
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
