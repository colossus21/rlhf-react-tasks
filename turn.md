### Code Plan

1. Create the main `VIPCountdown` component
2. Implement `EventCard` component for displaying event details
3. Create `Countdown` component for timer functionality
4. Develop `AddEventForm` component for adding new events
5. Set up state management for events and current event index
6. Implement navigation logic for Previous and Next buttons
7. Create info section for displaying today's events and current month's event count
8. Style the app using Tailwind CSS with purple and indigo color scheme
9. Ensure mobile responsiveness using Tailwind's responsive classes
10. Use Shadcn components for UI elements (Card, Button, Dialog, Input, Select)

### Code

```jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const emojis = ['🎂', '🎉', '🎊', '🎁', '🍾', '💍', '🏆', '🎓', '🎭', '🎨'];

const EventCard = ({ event }) => {
  if (!event) return null;
  return (
      <div className="text-center text-2xl font-bold">
        <span>{event.emoji}</span> {event.name}
      </div>
  );
};

const Countdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.total <= 0) {
    return <div className="text-4xl font-bold">Event Started!</div>;
  }

  return (
      <div className="text-4xl font-bold text-center">
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      </div>
  );
};

const AddEventForm = ({ onAddEvent, onClose }) => {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && emoji && date) {
      onAddEvent({ name, emoji, date });
      onClose();
    }
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
            type="text"
            placeholder="Event Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
        />
        <Select onValueChange={setEmoji} required>
          <SelectTrigger>
            <SelectValue placeholder="Select Emoji" />
          </SelectTrigger>
          <SelectContent>
            {emojis.map((e) => (
                <SelectItem key={e} value={e}>
                  {e}
                </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
        />
        <Button type="submit" className="w-full">Add Event</Button>
      </form>
  );
};

const VIPCountdown = () => {
  const [events, setEvents] = useState([
    { emoji: '🎂', name: "Joe's Birthday", date: "2024-13-01" }
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
  const futureEvents = sortedEvents.filter(event => new Date(event.date) > new Date());

  const currentEvent = futureEvents[currentEventIndex];

  const todayEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    return eventDate.getDate() === today.getDate() &&
        eventDate.getMonth() === today.getMonth() &&
        eventDate.getFullYear() === today.getFullYear();
  });

  const currentMonthEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    return eventDate.getMonth() === today.getMonth() &&
        eventDate.getFullYear() === today.getFullYear();
  });

  const addEvent = (newEvent) => {
    setEvents([...events, newEvent]);
  };

  const handlePrevious = () => {
    setCurrentEventIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentEventIndex(prev => Math.min(futureEvents.length - 1, prev + 1));
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/90 shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-purple-800">VIP Countdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentEvent ? (
                <>
                  <EventCard event={currentEvent} />
                  <Countdown targetDate={currentEvent.date} />
                  <div className="flex justify-between">
                    <Button
                        onClick={handlePrevious}
                        disabled={currentEventIndex === 0}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      Previous
                    </Button>
                    <Button
                        onClick={handleNext}
                        disabled={currentEventIndex === futureEvents.length - 1}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      Next
                    </Button>
                  </div>
                </>
            ) : (
                <div className="text-2xl font-bold text-center">No events!</div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 w-full max-w-md">
          <Card className="bg-white/90 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-purple-800">Event Info</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Events today: {todayEvents.length}</p>
              <p>Events this month: {currentMonthEvents.length}</p>
              <ul className="list-disc list-inside">
                {todayEvents.map((event, index) => (
                    <li key={index}>{event.emoji} {event.name}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white">Add Event</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
            </DialogHeader>
            <AddEventForm onAddEvent={addEvent} onClose={() => setIsOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
  );
};

function calculateTimeLeft(targetDate) {
  const difference = +new Date(targetDate) - +new Date();
  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      total: difference,
    };
  }

  return timeLeft;
}

export default VIPCountdown;
```

### Explanation

1. The widget shows a large countdown at the center of the page, with the event name above it. The Previous and Next buttons are displayed below the countdown, with their active/inactive state managed based on event availability.

2. The widget displays only one countdown for the next upcoming event. If an event finishes, it automatically shows the timer for the next closest event. When there are no events to show, it displays "No events!" instead of a timer.

3. Events are structured as requested: `{ emoji: '🎂', name: "Joe's Birthday", date: "2024-13-01" }`.

4. Below the main widget, there's an info section showing a list of today's events and the number of events in the current month.

5. Users can add events through a modal dialog, which includes fields for setting the title, selecting an emoji from a dropdown (with 10 emojis provided), and choosing a date.

6. The app uses a purple and indigo color scheme, implemented with Tailwind CSS classes.

The provided code implements the "VIP Countdown" widget following the code plan outlined.