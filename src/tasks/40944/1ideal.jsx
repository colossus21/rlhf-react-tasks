import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const initialElements = [
    { name: 'Fire', emoji: '🔥' },
    { name: 'Water', emoji: '💧' },
    { name: 'Earth', emoji: '🌎' },
    { name: 'Air', emoji: '🌪️' },
];

const combinations = {
    'Fire💧': { name: 'Steam', emoji: '☁️' },
    'Fire🌎': { name: 'Lava', emoji: '🌋' },
    'Air🌎': { name: 'Dust', emoji: '💨' },
    'Water🌎': { name: 'Mud', emoji: '💩' },
    'Fire🌪️': { name: 'Energy', emoji: '⚡' },
    'Water⚡': { name: 'Life', emoji: '🌱' },
};

const ElementalCombinationGame = () => {
    const [elements, setElements] = useState(initialElements);
    const [box1, setBox1] = useState(null);
    const [box2, setBox2] = useState(null);
    const [result, setResult] = useState(null);
    const [discoveredCombinations, setDiscoveredCombinations] = useState([]);

    useEffect(() => {
        if (box1 && box2) {
            const combinationKey = box1.name + box2.emoji;
            const reverseCombinationKey = box2.name + box1.emoji;
            if (combinations[combinationKey]) {
                setResult(combinations[combinationKey]);
                if (!discoveredCombinations.includes(combinations[combinationKey].name)) {
                    const newCombination = combinations[combinationKey];
                    setDiscoveredCombinations([...discoveredCombinations, newCombination.name]);
                    setElements([...elements, newCombination]);
                }
            } else if (combinations[reverseCombinationKey]) {
                setResult(combinations[reverseCombinationKey]);
                if (!discoveredCombinations.includes(combinations[reverseCombinationKey].name)) {
                    const newCombination = combinations[reverseCombinationKey];
                    setDiscoveredCombinations([...discoveredCombinations, newCombination.name]);
                    setElements([...elements, newCombination]);
                }
            } else {
                setResult({ name: 'No combination', emoji: '🤔' });
            }
        } else {
            setResult(null);
        }
    }, [box1, box2]);

    const handleDragStart = (e, element) => {
        e.dataTransfer.setData('text/plain', JSON.stringify(element));
    };

    const handleDrop = (e, boxSetter) => {
        e.preventDefault();
        const element = JSON.parse(e.dataTransfer.getData('text/plain'));
        boxSetter(element);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const resetBoxes = () => {
        setBox1(null);
        setBox2(null);
        setResult(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-100 to-blue-200 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-white bg-opacity-80 backdrop-blur-md">
                <CardContent className="p-6">
                    <h1 className="text-2xl font-bold text-center my-6 text-green-800">Elemental Combination Game</h1>

                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        {elements.map((element) => (
                            <div
                                key={element.name}
                                draggable
                                onDragStart={(e) => handleDragStart(e, element)}
                                className="text-4xl cursor-move hover:scale-110 transition-transform"
                            >
                                {element.emoji}
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center mb-4">
                        <div
                            onDrop={(e) => handleDrop(e, setBox1)}
                            onDragOver={handleDragOver}
                            className="w-24 h-24 border-4 border-green-500 rounded-lg flex items-center justify-center text-4xl bg-white"
                        >
                            {box1 ? box1.emoji : ''}
                        </div>
                        <div className="text-2xl">+</div>
                        <div
                            onDrop={(e) => handleDrop(e, setBox2)}
                            onDragOver={handleDragOver}
                            className="w-24 h-24 border-4 border-green-500 rounded-lg flex items-center justify-center text-4xl bg-white"
                        >
                            {box2 ? box2.emoji : ''}
                        </div>
                        <div className="text-2xl">=</div>
                        <div className="w-24 h-24 border-4 border-blue-500 rounded-lg flex items-center justify-center text-4xl bg-white overflow-hidden">
                            {result ? result.emoji : ''}
                        </div>
                    </div>

                    <p className="text-center mb-4 text-lg font-semibold text-green-700">
                        {result ? result.name : 'Combine elements!'}
                    </p>

                    <button
                        onClick={resetBoxes}
                        className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                        Reset
                    </button>

                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-2 text-green-800">Discovered Combinations:</h2>
                        <div className="flex flex-wrap gap-2">
                            {discoveredCombinations.map((combo, index) => (
                                <Badge key={index} variant="secondary" className="bg-green-200 text-green-800">
                                    {combo}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <p className="mt-4 text-center text-green-700">
                        {discoveredCombinations.length === Object.keys(combinations).length
                            ? '🎉 Congratulations! You\'ve discovered all combinations!'
                            : `Progress: ${discoveredCombinations.length}/${Object.keys(combinations).length}`}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default ElementalCombinationGame;