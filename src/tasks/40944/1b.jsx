import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";

const elements = {
    Fire: '🔥', Water: '💧', Earth: '🌍', Air: '💨'
};

const combinations = {
    'Fire+Water': 'Steam', 'Fire+Earth': 'Lava', 'Air+Earth': 'Dust',
    'Water+Earth': 'Mud', 'Fire+Air': 'Energy', 'Water+Energy': 'Life'
};

function App() {
    const [box1, setBox1] = useState(null);
    const [box2, setBox2] = useState(null);
    const [discovered, setDiscovered] = useState([]);

    const handleDrop = (boxNumber, element) => {
        if (boxNumber === 1) setBox1(element);
        else if (boxNumber === 2) setBox2(element);
    };

    const combineElements = () => {
        if (box1 && box2) {
            const result = combinations[`${box1}+${box2}`] || combinations[`${box2}+${box1}`];
            if (result && !discovered.includes(result)) {
                setDiscovered([...discovered, result]);
            }
        }
    };

    const resetGame = () => {
        setBox1(null);
        setBox2(null);
        setDiscovered([]);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
            <h1 className="text-4xl mb-8 text-green-800">Elemental Combiner</h1>
            <ElementDisplay elements={elements} handleDrop={handleDrop} />
            <div className="flex space-x-4 my-4">
                <CombinerBox id={1} content={box1} onDrop={handleDrop} />
                <span className="text-4xl my-auto">+</span>
                <CombinerBox id={2} content={box2} onDrop={handleDrop} />
                <span className="text-4xl my-auto">=</span>
                <ResultBox result={combineElements} />
            </div>
            <ResetButton reset={resetGame} />
            <ProgressReport discovered={discovered} />
        </div>
    );
}

function ElementDisplay({ elements, handleDrop }) {
    return (
        <div className="flex space-x-4">
            {Object.entries(elements).map(([name, emoji]) => (
                <div key={name} className="cursor-pointer" draggable="true" onDragStart={() => handleDrop(null, name)}>
                    <span>{emoji}</span>
                </div>
            ))}
        </div>
    );
}

function CombiBox({ id, content, onDrop }) {
    return (
        <div
            className="w-20 h-20 border-2 border-green-600 flex items-center justify-center bg-white"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(id, content)}
        >
            {content && <span>{elements[content]}</span>}
        </div>
    );
}

function ResultBox({ result }) {
    return (
        <div className="w-20 h-20 border-2 border-green-600 flex items-center justify-center bg-white">
            {result()}
        </div>
    );
}

function ResetButton({ reset }) {
    return <button onClick={reset} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">Reset</button>;
}

function ProgressReport({ discovered }) {
    return (
        <Card className="mt-4 w-96">
            <CardContent>
                <h2 className="text-xl">Discovered Combinations:</h2>
                <div className="flex flex-wrap gap-2">
                    {discovered.map(item => (
                        <div key={item} className="bg-green-200 px-2 py-1 rounded">{item}</div>
                    ))}
                </div>
                <p className="mt-2">Progress: {discovered.length}/{Object.keys(combinations).length}</p>
                {discovered.length === Object.keys(combinations).length && <p>Congratulations! You've discovered all combinations!</p>}
            </CardContent>
        </Card>
    );
}

export default App;