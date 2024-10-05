import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Utility function to get days in a month
const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

// MyEventsWidget component
const MyEventsWidget = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({ title: '', emoji: '', date: '', priority: 'medium', frequency: 'none', description: '' });
    const [isOpen, setIsOpen] = useState(false);

    const priorities = ['low', 'medium', 'high'];
    const frequencies = ['none', 'daily', 'weekly', 'monthly', 'yearly'];

    // Function to change month
    const changeMonth = (direction) => {
        setCurrentDate(prev => {
            let newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + direction);
            return newDate;
        });
    };

    // Add event handler
    const handleAddEvent = () => {
        if (newEvent.title && newEvent.date) {
            setEvents([...events, { ...newEvent, date: new Date(newEvent.date) }]);
            setIsOpen(false);
            setNewEvent({ title: '', emoji: '', date: '', priority: 'medium', frequency: 'none', description: '' });
        }
    };

    // Render calendar days
    const renderDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        let days = [];
        for (let day = 1; day <= daysInMonth(year, month); day++) {
            const dayEvents = events.filter(e => new Date(e.date).getDate() === day && new Date(e.date).getMonth() === month);
            const priorityColor = dayEvents.length ? { 'low': 'bg-green-100', 'medium': 'bg-yellow-100', 'high': 'bg-red-100' }[dayEvents[0].priority] : 'bg-white';

            days.push(
                <div key={day} className={`p-2 border ${priorityColor} text-center`}>
                    {day}
                    {dayEvents.map((event, idx) => (
                        <Popover key={idx}>
                            <PopoverTrigger>{idx === 0 ? event.emoji : '☰'}</PopoverTrigger>
                            <PopoverContent>
                                <div>{event.title}</div>
                            </PopoverContent>
                        </Popover>
                    ))}
                </div>
            );
        }
        return days;
    };

    // Event summary
    const eventSummary = () => {
        const currentMonthEvents = events.filter(event =>
            event.date.getMonth() === currentDate.getMonth() && event.date.getFullYear() === currentDate.getFullYear()
        );
        return {
            total: currentMonthEvents.length,
            passed: currentMonthEvents.filter(e => e.date < new Date()).length,
            upcoming: currentMonthEvents.filter(e => e.date >= new Date()).length
        };
    };

    return (
        <div className="p-4 max-w-lg mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>My Events</CardTitle>
                    <div className="flex justify-between items-center">
                        <Button onClick={() => changeMonth(-1)}>⬅️</Button>
                        <span>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                        <Button onClick={() => changeMonth(1)}>➡️</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-7 gap-1">
                        {renderDays()}
                    </div>
                    <div className="mt-4">
                        <p>Total Events: {eventSummary().total}</p>
                        <p>Passed: {eventSummary().passed}</p>
                        <p>Upcoming: {eventSummary().upcoming}</p>
                    </div>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button>Add Event</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <Input value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} placeholder="Event Title" />
                            {/* Include other fields like emoji selection, date, priority, frequency, and description similarly */}
                            <Button onClick={handleAddEvent}>Save Event</Button>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
        </div>
    );
};

export default MyEventsWidget;