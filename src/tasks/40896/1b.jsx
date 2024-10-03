import React, { useState, useEffect } from 'react';
import {
    Card, CardContent, CardHeader, CardTitle,
    CardFooter, CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const emojis = [
    '🎂', '🎉', '💍', '🎈', '🎁', '🍰', '🎊', '🥳', '🌟', '🎓'
];

function Event({ event, onDelete }) {
    return (
        <div className="mb-2 p-2 bg-purple-100 rounded flex justify-between items-center">
            <span>{event.emoji} {event.name}</span>
            <Button size="icon" variant="ghost" onClick={() => onDelete(event)}>
                ❌
            </Button>
        </div>
    );
}

function CalendarDay({ day, events, currentMonth }) {
    const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
    return (
        <div className={`p-2 text-center ${!isCurrentMonth ? 'text-gray-400' : ''}`}>
            <span>{day.getDate()}</span>
            {events.map((event, idx) => (
                <div key={idx} className="tooltip" data-tip={event.name}>
                    {event.emoji}
                </div>
            ))}
        </div>
    );
}

function MyEvents() {
    const [events, setEvents] = useState([]);
    const [open, setOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({ emoji: '🎂', name: '', date: '', description: '' });
    const currentDate = new Date();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    const addEvent = () => {
        if (newEvent.name && newEvent.date) {
            setEvents([...events, { ...newEvent, date: new Date(newEvent.date) }]);
            setOpen(false);
            setNewEvent({ emoji: '🎂', name: '', date: '', description: '' });
        }
    };

    const deleteEvent = (eventToDelete) => {
        setEvents(events.filter(event => event !== eventToDelete));
    };

    const currentMonthEvents = events.filter(event =>
        event.date.getMonth() === currentDate.getMonth() && event.date.getFullYear() === currentDate.getFullYear()
    );

    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle>My Events</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-7 gap-2">
                        {[...Array(daysInMonth)].map((_, index) => {
                            const day = new Date(currentDate.getFullYear(), currentDate.getMonth(), index + 1);
                            const dayEvents = events.filter(e => e.date.getDate() === day.getDate() &&
                                e.date.getMonth() === day.getMonth());
                            return <CalendarDay key={day} day={day} events={dayEvents} currentMonth={currentDate} />;
                        })}
                    </div>
                </CardContent>
                <CardFooter>
                    <p>Events this month: {currentMonthEvents.length}</p>
                    <p>Upcoming: {currentMonthEvents.filter(e => e.date > currentDate).length}</p>
                    <p>Passed: {currentMonthEvents.filter(e => e.date <= currentDate).length}</p>
                </CardFooter>
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button className="mt-4">Add Event</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <h2>Add New Event</h2>
                    </DialogHeader>
                    <Input
                        value={newEvent.name}
                        onChange={e => setNewEvent({...newEvent, name: e.target.value})}
                        placeholder="Event Name"
                    />
                    <Select onValueChange={emoji => setNewEvent({...newEvent, emoji})}>
                        <SelectTrigger className="w-full mt-2">
                            <SelectValue placeholder="Select an emoji" />
                        </SelectTrigger>
                        <SelectContent>
                            {emojis.map(emoji => <SelectItem key={emoji} value={emoji}>{emoji}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Input
                        type="date"
                        className="mt-2"
                        value={newEvent.date}
                        onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                    />
                    <Textarea
                        className="mt-2"
                        value={newEvent.description}
                        onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                        placeholder="Description"
                    />
                    <Button onClick={addEvent} className="mt-2">Save Event</Button>
                </DialogContent>
            </Dialog>

            <div className="mt-4">
                {currentMonthEvents.map(event => <Event key={event.name} event={event} onDelete={deleteEvent} />)}
            </div>
        </div>
    );
}

export default function App() {
    return <MyEvents />;
}