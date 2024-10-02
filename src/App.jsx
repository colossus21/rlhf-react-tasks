import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectItem } from "@/components/ui/select";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";

const emojis = [
  { emoji: '🎂', label: 'Birthday' },
  { emoji: '💍', label: 'Anniversary' },
  { emoji: '🎉', label: 'Party' },
  { emoji: '🏖️', label: 'Vacation' },
  { emoji: '🎓', label: 'Graduation' },
  { emoji: '🎄', label: 'Christmas' },
  { emoji: '🎃', label: 'Halloween' },
  { emoji: '🍻', label: 'Celebration' },
  { emoji: '💼', label: 'Meeting' },
  { emoji: '🏀', label: 'Sports' },
];

function Calendar({ events }) {
  const [currentDate] = useState(new Date());
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  return (
      <div className="grid grid-cols-7 gap-1 text-center">
        {Array.from({ length: firstDay }).map((_, idx) => <div key={`empty-${idx}`}></div>)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dayEvents = events.filter(e => new Date(e.date).getDate() === day);
          return (
              <div key={day} className="relative">
                <span>{day}</span>
                {dayEvents.map(e => (
                    <span
                        key={e.id}
                        className="cursor-pointer text-lg"
                        title={e.name}
                    >
                {e.emoji}
              </span>
                ))}
              </div>
          );
        })}
      </div>
  );
}

function EventInfo({ events }) {
  const [currentDate] = useState(new Date());
  const currentMonthEvents = events.filter(event => new Date(event.date).getMonth() === currentDate.getMonth());
  const upcoming = currentMonthEvents.filter(event => new Date(event.date) >= currentDate);
  const passed = currentMonthEvents.length - upcoming.length;

  return (
      <div className="mt-4 text-sm">
        <p>Total Events: {currentMonthEvents.length}</p>
        <p>Upcoming Events: {upcoming.length}</p>
        <p>Passed Events: {passed}</p>
      </div>
  );
}

function AddEventModal({ isOpen, onClose, onAddEvent }) {
  const [event, setEvent] = useState({ name: '', emoji: '', date: '', description: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddEvent({ ...event, id: Date.now(), date: new Date(event.date).toISOString().split('T')[0] });
    onClose();
  };

  return (
      <Modal open={isOpen} onOpenChange={onClose}>
        <ModalContent>
          <ModalHeader className="space-y-1">
            <CardTitle>Add New Event</CardTitle>
          </ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <Input
                  value={event.name}
                  onChange={e => setEvent({...event, name: e.target.value})}
                  placeholder="Event Name"
                  required
              />
              <Select
                  onValueChange={emoji => setEvent({...event, emoji})}
                  defaultValue={event.emoji}
                  className="my-2"
              >
                {emojis.map(e => <SelectItem key={e.emoji} value={e.emoji}>{e.emoji} {e.label}</SelectItem>)}
              </Select>
              <Input
                  type="date"
                  value={event.date}
                  onChange={e => setEvent({...event, date: e.target.value})}
                  required
              />
              <Textarea
                  value={event.description}
                  onChange={e => setEvent({...event, description: e.target.value})}
                  placeholder="Description"
                  className="mt-2"
              />
              <Button type="submit" className="mt-4">Add Event</Button>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
  );
}

export default function App() {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddEvent = (newEvent) => {
    setEvents([...events, newEvent]);
  };

  return (
      <div className="flex justify-center p-4 sm:p-8 bg-indigo-50 min-h-screen">
        <Card className="w-full max-w-lg bg-purple-50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-indigo-600">My Events</CardTitle>
            <CardDescription>Manage your events for this month</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar events={events} />
            <EventInfo events={events} />
          </CardContent>
          <CardFooter>
            <Button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">Add Event</Button>
          </CardFooter>
          <AddEventModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onAddEvent={handleAddEvent}
          />
        </Card>
      </div>
  );
}