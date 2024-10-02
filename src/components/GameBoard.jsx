// components/GameBoard.jsx
import React from 'react';

const GameBoard = ({ board, toggleLight }) => (
    <div className="grid grid-cols-6 gap-1 p-2">
        {board.map((light, index) => (
            <div
                key={index}
                className={`w-10 h-10 rounded-full ${light ? 'bg-neon-green' : 'bg-gray-700'} transition-all duration-300 ease-in-out cursor-pointer`}
                onClick={() => toggleLight(index)}
            ></div>
        ))}
    </div>
);

// components/MoveCounter.jsx
const MoveCounter = ({ moves }) => (
    <p className="text-center text-white mt-4">Moves: {moves}</p>
);

// components/WinMessage.jsx
const WinMessage = () => (
    <p className="text-center text-green-400 mt-4">Congratulations! You've turned off all the stars!</p>
);

// Tailwind custom classes would be defined for:
// - bg-deep-blue: background color for space
// - bg-neon-green: color for the lit stars