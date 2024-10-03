import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import { format, differenceInSeconds } from 'date-fns';

const emojis = ['🎂', '🎉', '💍', '🎓', '🎁', '🎈', '🍰', '🎊', '🎇', '🥳'];

function App() {
    const [events, setEvents] = useState([]);
    const [currentEventIndex, setCurrentEventIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({ emoji: '🎂', name: '', date: '' });

    useEffect(() => {
        const timer = setInterval(() => {
            setEvents(currentEvents => currentEvents.map(event => ({
                ...event,
                timeUntil: event.date ? differenceInSeconds(new Date(event.date), new Date()) : 0
            })));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const addEvent = () => {
        setEvents([...events, { ...newEvent, date: new Date(newEvent.date).toISOString() }]);
        setIsModalOpen(false);
        setNewEvent({ emoji: '🎂', name: '', date: '' });
    };

    const nextEvent = () => {
        if (currentEventIndex < events.length - 1) setCurrentEventIndex(currentEventIndex + 1);
    };

    const prevEvent = () => {
        if (currentEventIndex > 0) setCurrentEventIndex(currentEventIndex - 1);
    };

    const currentEvent = events[currentEventIndex] || { name: "No events!", timeUntil: 0 };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-purple-100 p-4">
            <CountdownWidget
                event={currentEvent}
                onNext={nextEvent}
                onPrev={prevEvent}
                canGoNext={currentEventIndex < events.length - 1}
                canGoPrev={currentEventIndex > 0}
            />
            <EventInfo events={events} />
            <Button onClick={() => setIsModalOpen(true)} className="mt-4">Add Event</Button>
            <EventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={addEvent}
                event={newEvent}
                setEvent={setNewEvent}
            />
        </div>
    );
}

function CountdownWidget({ event, onNext, onPrev, canGoNext, canGoPrev }) {
    return (
        <Card className="w-full max-w-lg my-4">
            <CardHeader>
                <CardTitle className="text-4xl text-center text-indigo-600">{event.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                {event.timeUntil > 0 ? (
                    <div className="text-6xl font-bold text-purple-600">
                        {Math.floor(event.timeUntil / 86400)}d {Math.floor((event.timeUntil % 86400) / 3600)}h
                        {' '}{Math.floor((event.timeUntil % 3600) / 60)}m {event.timeUntil % 60}s
                    </div>
                ) : (
                    <div className="text-4xl text-purple-600">Event has passed!</div>
                )}
            </CardContent>
            <CardContent>
                <div className="flex justify-around">
                    <Button onClick={onPrev} disabled={!canGoPrev}>Previous</Button>
                    <Button onClick={onNext} disabled={!canGoNext}>Next</Button>
                </div>
            </CardContent>
        </Card>
    );
}

function EventInfo({ events }) {
    const todayEvents = events.filter(event => format(new Date(event.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'));
    const monthEvents = events.filter(event => new Date(event.date).getMonth() === new Date().getMonth());

    return (
        <Card className="w-full max-w-lg mt-4">
            <CardContent>
                <h3 className="text-xl mb-2 text-indigo-600">Today's Events:</h3>
                <ul>{todayEvents.map(e => <li key={e.name}>{e.emoji} {e.name}</li>)}</ul>
                <p className="mt-2 text-indigo-600">Events this month: {monthEvents.length}</p>
            </CardContent>
        </Card>
    );
}

function EventModal({ isOpen, onClose, onAdd, event, setEvent }) {
    return (
        <Modal open={isOpen} onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader className="space-y-2">
                    <h2 className="text-2xl text-purple-700">Add New Event</h2>
                </ModalHeader>
                <ModalBody>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="event-name">Event Name</Label>
                            <Input id="event-name" value={event.name} onChange={e => setEvent({...event, name: e.target.value})} />
                        </div>
                        <div>
                            <Label htmlFor="event-date">Date</Label>
                            <Input id="event-date" type="date" value={event.date} onChange={e => setEvent({...event, date: e.target.value})} />
                        </div>
                        <div>
                            <Label>Emoji</Label>
                            <select
                                value={event.emoji}
                                onChange={e => setEvent({...event, emoji: e.target.value})}
                                className="p-2 border rounded w-full"
                            >
                                {emojis.map(emoji => <option key={emoji} value={emoji}>{emoji}</option>)}
                            </select>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={onAdd}>Add Event</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default App;