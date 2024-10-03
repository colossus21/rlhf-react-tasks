Here's a self-contained React application for the "My Events" widget:

```jsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getMonthName = (month) => new Date(2000, month, 1).toLocaleString('default', { month: 'long' });

const emojis = ['🎂', '🎉', '💍', '🎓', '🏆', '🎄', '🎃', '🥳', '🍾', '💼'];

const MyEventsWidget = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({ name: '', emoji: '', date: '', description: '' });
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const addEvent = () => {
        if (newEvent.name && newEvent.emoji && newEvent.date) {
            setEvents([...events, { ...newEvent, date: new Date(newEvent.date) }]);
            setNewEvent({ name: '', emoji: '', date: '', description: '' });
            setIsDialogOpen(false);
        }
    };

    const isCurrentMonth = (date) => {
        return date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear();
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventCounts = {
        total: events.filter(e => isCurrentMonth(e.date)).length,
        passed: events.filter(e => isCurrentMonth(e.date) && e.date < today).length,
        upcoming: events.filter(e => isCurrentMonth(e.date) && e.date >= today).length
    };

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const totalDays = daysInMonth(year, month);
        const weeks = Math.ceil((totalDays + firstDay) / 7);

        return Array.from({ length: weeks }).map((_, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1">
                {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const day = weekIndex * 7 + dayIndex - firstDay + 1;
                    const currentMonthEvent = events.find(e =>
                        e.date.getDate() === day &&
                        e.date.getMonth() === month &&
                        e.date.getFullYear() === year
                    );

                    return (
                        <div key={dayIndex} className="h-14 border rounded-md p-1 text-xs bg-white bg-opacity-50">
                            {day > 0 && day <= totalDays && (
                                <Popover>
                                    <PopoverTrigger className="w-full h-full">
                                        <div className="flex flex-col items-center justify-between h-full">
                                            <span className="font-semibold">{day}</span>
                                            {currentMonthEvent && (
                                                <span className="text-lg">{currentMonthEvent.emoji}</span>
                                            )}
                                        </div>
                                    </PopoverTrigger>
                                    {currentMonthEvent && (
                                        <PopoverContent>
                                            <p className="font-semibold">{currentMonthEvent.name}</p>
                                            <p className="text-sm text-gray-500">{currentMonthEvent.date.toLocaleDateString()}</p>
                                            {currentMonthEvent.description && (
                                                <p className="text-sm mt-2">{currentMonthEvent.description}</p>
                                            )}
                                        </PopoverContent>
                                    )}
                                </Popover>
                            )}
                        </div>
                    );
                })}
            </div>
        ));
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <Card className="bg-gradient-to-br from-indigo-100 to-purple-100">
                <CardHeader className="bg-indigo-200 bg-opacity-70 rounded-t-lg">
                    <CardTitle className="text-2xl font-bold text-indigo-800">My Events</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-indigo-50 bg-opacity-70 rounded-lg p-4 mt-4">
                        <h3 className="text-xl font-semibold mb-4 text-center text-indigo-800">
                            {getMonthName(currentDate.getMonth())} {currentDate.getFullYear()}
                        </h3>
                        {renderCalendar()}
                    </div>
                    <div className="bg-purple-50 bg-opacity-70 rounded-lg p-4">
                        <h4 className="font-semibold mb-2 text-purple-800">Event Summary for {getMonthName(currentDate.getMonth())}</h4>
                        <p className="text-indigo-700">Passed events this month: {eventCounts.passed}</p>
                        <p className="text-indigo-700">Upcoming events this month: {eventCounts.upcoming}</p>
                        <p className="text-indigo-700">Total events this month: {eventCounts.total}</p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">Add New Event</Button>
                        </DialogTrigger>
                        <DialogContent className="bg-purple-50">
                            <DialogHeader>
                                <DialogTitle className="text-indigo-800">Add New Event</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                                <Input
                                    placeholder="Event name"
                                    value={newEvent.name}
                                    onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                                    className="bg-white"
                                />
                                <Select onValueChange={(value) => setNewEvent({ ...newEvent, emoji: value })}>
                                    <SelectTrigger className="bg-white">
                                        <SelectValue placeholder="Select emoji" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {emojis.map((emoji) => (
                                            <SelectItem key={emoji} value={emoji}>{emoji}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Input
                                    type="date"
                                    value={newEvent.date}
                                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                    className="bg-white"
                                />
                                <Textarea
                                    placeholder="Event description"
                                    value={newEvent.description}
                                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                    className="bg-white"
                                />
                                <Button onClick={addEvent} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">Add Event</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
        </div>
    );
};

export default MyEventsWidget;
```

### Explanation:

- Main component structure uses Shadcn UI's Card with a purple and indigo gradient background
- Calendar display:
  - Shows days of the month in a grid
  - Displays emojis for days with events
  - Uses Popover to show event details on emoji click
- Event summary section below calendar shows:
  - Total events this month
  - Passed events this month
  - Upcoming events this month
- Add Event functionality:
  - Uses Dialog component for modal
  - Includes inputs for event name, date, emoji (from dropdown), and description
- State management with `useState` hooks for events, current date, and modal state
- Event data structure includes name, emoji, date, and description

This implementation covers calendar display, event summary, add event functionality using ReactJS, Shadcn UI and TailwindCSS.