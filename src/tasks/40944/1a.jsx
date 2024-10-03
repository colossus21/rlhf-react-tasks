import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Element = ({ emoji, draggable, onDragStart }) => (
    <div
        className="w-16 h-16 flex items-center justify-center text-4xl cursor-pointer"
        draggable={draggable}
        onDragStart={onDragStart}
    >
        {emoji}
    </div>
);

const Box = ({ children, onDrop, onDragOver }) => (
    <div
        className="w-20 h-20 border-2 border-green-700 m-2 flex items-center justify-center bg-green-50"
        onDrop={onDrop}
        onDragOver={onDragOver}
    >
        {children}
    </div>
);

const ProgressReport = ({ discovered, total }) => (
    <div className="mt-4 text-center">
        <h3 className="text-lg font-bold">Discovered Combinations:</h3>
        <div className="flex flex-wrap justify-center">
            {discovered.map((combo, index) => (
                <span key={index} className="m-1 p-1 bg-green-200 rounded-full text-sm">{combo}</span>
            ))}
        </div>
        <p>{discovered.length}/{total} discovered</p>
        {discovered.length === total && <p className="text-green-600 font-bold">Congratulations! You've found all combinations!</p>}
    </div>
);

function Combiner() {
    const [box1, setBox1] = useState(null);
    const [box2, setBox2] = useState(null);
    const [box3, setBox3] = useState('');
    const [discovered, setDiscovered] = useState([]);

    const elements = [
        { emoji: '🔥', name: 'Fire' },
        { emoji: '💧', name: 'Water' },
        { emoji: '🌍', name: 'Earth' },
        { emoji: '💨', name: 'Air' }
    ];

    const combinations = {
        'FireWater': 'Steam',
        'FireEarth': 'Lava',
        'AirEarth': 'Dust',
        'WaterEarth': 'Mud',
        'FireAir': 'Energy',
        'WaterEnergy': 'Life'
    };

    useEffect(() => {
        if (box1 && box2) {
            const comboKey = `${box1.name}${box2.name}`;
            const result = combinations[comboKey] || combinations[[box2.name, box1.name].sort().join('')];
            setBox3(result ? `${box1.emoji} + ${box2.emoji} = ${result} 🌟` : '');
            if (result && !discovered.includes(result)) {
                setDiscovered(prev => [...prev, result]);
            }
        }
    }, [box1, box2]);

    const handleDragStart = (e, element) => {
        e.dataTransfer.setData('text/plain', JSON.stringify(element));
    };

    const handleDrop = (setter) => (e) => {
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData('text'));
        setter(data);
    };

    const reset = () => {
        setBox1(null);
        setBox2(null);
        setBox3('');
    };

    return (
        <Card className="max-w-lg mx-auto bg-green-100 p-4">
            <CardHeader>
                <CardTitle>Element Combiner</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
                <div className="flex justify-center mb-4">
                    {elements.map(element => (
                        <Element key={element.name} emoji={element.emoji} draggable onDragStart={(e) => handleDragStart(e, element)} />
                    ))}
                </div>
                <div className="flex">
                    <Box onDrop={handleDrop(setBox1)} onDragOver={(e) => e.preventDefault()}>
                        {box1 && <Element emoji={box1.emoji} />}
                    </Box>
                    <Box onDrop={handleDrop(setBox2)} onDragOver={(e) => e.preventDefault()}>
                        {box2 && <Element emoji={box2.emoji} />}
                    </Box>
                    <Box>
                        <div className="text-2xl">{box3}</div>
                    </Box>
                </div>
                <Button onClick={reset} className="mt-4 bg-red-500 hover:bg-red-600">Reset 🔄</Button>
                <ProgressReport discovered={discovered} total={Object.values(combinations).filter((v, i, a) => a.indexOf(v) === i).length} />
            </CardContent>
        </Card>
    );
}

export default function App() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-200 to-green-400">
            <Combiner />
        </div>
    );
}