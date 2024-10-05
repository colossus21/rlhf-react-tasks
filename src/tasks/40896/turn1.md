### Code Plan:

1. Set up state variables for current date, events, and new event form
2. Create helper functions for date calculations and event management
3. Implement the calendar rendering logic
4. Create the event summary section
5. Develop the add event modal with form inputs
6. Implement month navigation functionality
7. Add color coding for event priorities
8. Handle recurring events based on frequency
9. Implement multi-event display with hamburger icon
10. Set up event details popover on emoji click

### Code:

```jsx
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getMonthName = (month) => new Date(2000, month, 1).toLocaleString('default', { month: 'long' });

const emojis = ['🎂', '🎉', '💍', '🎓', '🏆', '🎄', '🎃', '🥳', '🍾', '💼'];
const priorities = ['low', 'medium', 'high'];
const recurrenceOptions = ['none', 'daily', 'weekly', 'monthly', 'yearly'];

const priorityColors = {
    low: 'bg-green-200',
    medium: 'bg-yellow-200',
    high: 'bg-red-200'
};

const MyEventsWidget = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({
        name: '',
        emoji: '',
        date: '',
        description: '',
        priority: 'medium',
        recurrence: 'none'
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const addEvent = useCallback(() => {
        if (newEvent.name && newEvent.emoji && newEvent.date) {
            const baseEvent = { ...newEvent, date: new Date(newEvent.date) };
            const newEvents = [baseEvent];

            // Generate recurring events
            if (baseEvent.recurrence !== 'none') {
                const endDate = new Date(baseEvent.date);
                endDate.setFullYear(endDate.getFullYear() + 1); // Generate events for up to one year

                let currentDate = new Date(baseEvent.date);
                while (currentDate < endDate) {
                    currentDate = new Date(currentDate);
                    switch (baseEvent.recurrence) {
                        case 'daily':
                            currentDate.setDate(currentDate.getDate() + 1);
                            break;
                        case 'weekly':
                            currentDate.setDate(currentDate.getDate() + 7);
                            break;
                        case 'monthly':
                            currentDate.setMonth(currentDate.getMonth() + 1);
                            break;
                        case 'yearly':
                            currentDate.setFullYear(currentDate.getFullYear() + 1);
                            break;
                    }
                    if (currentDate < endDate) {
                        newEvents.push({ ...baseEvent, date: new Date(currentDate) });
                    }
                }
            }

            setEvents(prevEvents => [...prevEvents, ...newEvents]);
            setNewEvent({
                name: '',
                emoji: '',
                date: '',
                description: '',
                priority: 'medium',
                recurrence: 'none'
            });
            setIsDialogOpen(false);
        }
    }, [newEvent]);

    const isCurrentMonth = useCallback((date) => {
        return date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear();
    }, [currentDate]);

    const changeMonth = useCallback((increment) => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() + increment);
            return newDate;
        });
    }, []);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventCounts = {
        total: events.filter(e => isCurrentMonth(e.date)).length,
        passed: events.filter(e => isCurrentMonth(e.date) && e.date < today).length,
        upcoming: events.filter(e => isCurrentMonth(e.date) && e.date >= today).length
    };

    const renderCalendar = useCallback(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const totalDays = daysInMonth(year, month);
        const weeks = Math.ceil((totalDays + firstDay) / 7);

        return Array.from({ length: weeks }).map((_, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1">
                {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const day = weekIndex * 7 + dayIndex - firstDay + 1;
                    const currentMonthEvents = events.filter(e =>
                        e.date.getDate() === day &&
                        e.date.getMonth() === month &&
                        e.date.getFullYear() === year
                    );

                    const bgColor = currentMonthEvents.length > 0
                        ? priorityColors[currentMonthEvents.reduce((acc, event) =>
                                priorities.indexOf(event.priority) > priorities.indexOf(acc) ? event.priority : acc
                            , 'low')]
                        : 'bg-white bg-opacity-50';

                    return (
                        <div key={dayIndex} className={`h-14 border rounded-md p-1 text-xs ${bgColor}`}>
                            {day > 0 && day <= totalDays && (
                                <Popover>
                                    <PopoverTrigger className="w-full h-full">
                                        <div className="flex flex-col items-center justify-between h-full">
                                            <span className="font-semibold">{day}</span>
                                            {currentMonthEvents.length > 0 && (
                                                <span className="text-lg">
                          {currentMonthEvents.length > 1 ? '☰' : currentMonthEvents[0].emoji}
                        </span>
                                            )}
                                        </div>
                                    </PopoverTrigger>
                                    {currentMonthEvents.length > 0 && (
                                        <PopoverContent>
                                            {currentMonthEvents.map((event, index) => (
                                                <div key={index} className="mb-2">
                                                    <p className="font-semibold">
                                                        {event.emoji} {event.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">{event.date.toLocaleDateString()}</p>
                                                    <p className="text-sm mt-1">{event.description}</p>
                                                    <p className="text-sm mt-1">Priority: {event.priority}</p>
                                                    <p className="text-sm">Recurrence: {event.recurrence}</p>
                                                </div>
                                            ))}
                                        </PopoverContent>
                                    )}
                                </Popover>
                            )}
                        </div>
                    );
                })}
            </div>
        ));
    }, [currentDate, events]);

    return (
        <div className="p-4 max-w-md mx-auto">
            <Card className="bg-gradient-to-br from-indigo-100 to-purple-100">
                <CardHeader className="bg-indigo-200 bg-opacity-70 rounded-t-lg">
                    <CardTitle className="text-2xl font-bold text-indigo-800">My Events</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-indigo-50 bg-opacity-70 rounded-lg p-4 mt-4">
                        <div className="flex justify-between items-center mb-4">
                            <button onClick={() => changeMonth(-1)} className="text-2xl text-indigo-600 hover:text-indigo-800">
                                ◀️
                            </button>
                            <h3 className="text-xl font-semibold text-center text-indigo-800">
                                {getMonthName(currentDate.getMonth())} {currentDate.getFullYear()}
                            </h3>
                            <button onClick={() => changeMonth(1)} className="text-2xl text-indigo-600 hover:text-indigo-800">
                                ▶️
                            </button>
                        </div>
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
                                <div>
                                    <Label className="text-sm font-medium">Priority</Label>
                                    <RadioGroup
                                        value={newEvent.priority}
                                        onValueChange={(value) => setNewEvent({ ...newEvent, priority: value })}
                                        className="flex space-x-4 mt-1"
                                    >
                                        {priorities.map((priority) => (
                                            <div key={priority} className="flex items-center space-x-2">
                                                <RadioGroupItem value={priority} id={`priority-${priority}`} />
                                                <Label htmlFor={`priority-${priority}`} className={priority === 'low' ? 'pl-0.5' : ''}>
                                                    {priority}
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                                <Select
                                    value={newEvent.recurrence}
                                    onValueChange={(value) => setNewEvent({ ...newEvent, recurrence: value })}
                                >
                                    <SelectTrigger className="bg-white">
                                        <SelectValue placeholder="Select recurrence" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {recurrenceOptions.map((option) => (
                                            <SelectItem key={option} value={option}>{option}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
  - Includes inputs for event name, date, emoji (from dropdown), priority, frequency, and description
- State management with `useState` hooks for events, current date, and modal state
- Consistent purple and indigo color scheme throughout
- Mobile-responsive design using Tailwind CSS classes
- Event data structure includes name, emoji, date, description, priority, and recurrence
- Month navigation implemented with left and right arrow emojis
- Color coding for event priorities (green for low, yellow for medium, red for high)
- Hamburger icon (☰) used for multiple events on the same day
- Recurring events are generated based on the specified frequency

This plan implements the calendar display, event management, color coding, recurring events, and mobile responsiveness for the "My Events" widget.