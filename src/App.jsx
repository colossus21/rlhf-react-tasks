// App.jsx
import React, { useState, useEffect } from 'react';
import CountdownDisplay from './CountdownDisplay';
import EventControls from './EventControls';
import EventInfo from './EventInfo';
import AddEventModal from './AddEventModal';

const events = [
  { emoji: '🎂', name: "Joe's Birthday", date: '2024-01-13' },
  // Add more events here for testing
];

export default function App() {
  const [eventList, setEventList] = useState(events);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentEvent = eventList[currentEventIndex];

  const updateCountdown = () => {
    if (!currentEvent) return;
    const now = new Date();
    const eventDate = new Date(currentEvent.date);
    if (now > eventDate) {
      setCurrentEventIndex((prev) => (prev + 1) % eventList.length);
    }
  };

  useEffect(() => {
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [currentEvent]);

  const handleAddEvent = (newEvent) => {
    setEventList([...eventList, newEvent]);
    setIsModalOpen(false);
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-600 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <CountdownDisplay event={currentEvent} />
          <EventControls
              onNext={() => setCurrentEventIndex((currentEventIndex + 1) % eventList.length)}
              onPrev={() => setCurrentEventIndex((currentEventIndex - 1 + eventList.length) % eventList.length)}
              canNext={eventList.length > 1}
              canPrev={eventList.length > 1}
          />
          <EventInfo events={eventList} />
          <button onClick={() => setIsModalOpen(true)} className="mt-4 w-full bg-indigo-500 text-white p-2 rounded">Add Event</button>
          {isModalOpen && <AddEventModal onClose={() => setIsModalOpen(false)} onAdd={handleAddEvent} />}
        </div>
      </div>
  );
}

// Components like CountdownDisplay, EventControls, EventInfo, AddEventModal would follow here with similar structure using React, Tailwind, and Shadcn UI components.