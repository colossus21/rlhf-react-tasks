### Code Plan

1. Set up the main App component and `SpaceLightsOut` game component
2. Create utility functions for grid initialization and light toggling
3. Implement state management using React hooks (`useState`, `useEffect`, `useCallback`)
4. Design the game board UI using Tailwind CSS and Shadcn components
5. Implement game logic for light toggling and win condition checking
6. Add move counter and reset button functionality
7. Create space-themed background with scrolling stars using CSS animations
8. Implement responsive design for mobile compatibility

### Code

```jsx
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GRID_SIZE = 6;

const createInitialGrid = () => {
    const grid = Array(GRID_SIZE)
        .fill()
        .map(() => Array(GRID_SIZE).fill(false));

    // Simulate 10 random moves
    for (let i = 0; i < 10; i++) {
        const row = Math.floor(Math.random() * GRID_SIZE);
        const col = Math.floor(Math.random() * GRID_SIZE);
        toggleLights(grid, row, col);
    }

    return grid;
};

const toggleLights = (grid, row, col) => {
    const directions = [
        [0, 0],
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
    ];

    directions.forEach(([dx, dy]) => {
        const newRow = row + dx;
        const newCol = col + dy;
        if (
            newRow >= 0 &&
            newRow < GRID_SIZE &&
            newCol >= 0 &&
            newCol < GRID_SIZE
        ) {
            grid[newRow][newCol] = !grid[newRow][newCol];
        }
    });
};

const SpaceLightsOut = () => {
    const [grid, setGrid] = useState(() => createInitialGrid());
    const [moves, setMoves] = useState(0);
    const [gameWon, setGameWon] = useState(false);

    const checkWinCondition = useCallback((currentGrid) => {
        return currentGrid.every((row) => row.every((cell) => !cell));
    }, []);

    useEffect(() => {
        if (checkWinCondition(grid) && moves > 0) {
            setGameWon(true);
        }
    }, [grid, moves, checkWinCondition]);

    const handleCellClick = (row, col) => {
        if (gameWon) return;

        setGrid((prevGrid) => {
            const newGrid = prevGrid.map((r) => [...r]);
            toggleLights(newGrid, row, col);
            return newGrid;
        });
        setMoves((prevMoves) => prevMoves + 1);
    };

    const resetGame = () => {
        setGrid(createInitialGrid());
        setMoves(0);
        setGameWon(false);
    };

    return (
        <div className="min-h-screen bg-deep-space flex items-center justify-center">
            <div className="stars"></div>
            <Card className="w-[90vw] max-w-[400px] bg-opacity-80 bg-gray-900">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold text-green-400">
                        Space Lights Out
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-6 gap-1 mb-4">
                        {grid.map((row, rowIndex) =>
                            row.map((cell, colIndex) => (
                                <button
                                    key={`${rowIndex}-${colIndex}`}
                                    className={`w-full pt-[100%] relative ${
                                        cell ? "bg-green-400" : "bg-gray-700"
                                    } rounded-full transition-colors duration-300 hover:opacity-80`}
                                    onClick={() => handleCellClick(rowIndex, colIndex)}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div
                                            className={`w-3/4 h-3/4 rounded-full ${
                                                cell ? "bg-green-300" : "bg-gray-600"
                                            } transition-colors duration-300`}
                                        ></div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                    <div className="text-center mb-4">
                        <p className="text-green-400 text-lg">Moves: {moves}</p>
                    </div>
                    {gameWon && (
                        <div className="mt-4 text-center">
                            <p className="text-green-400 text-xl font-bold">
                                Congratulations! You won in {moves} moves!
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

const App = () => {
    return (
        <div className="bg-deep-space min-h-screen">
            <style jsx global>{`
          @keyframes scroll {
            0% {
              transform: translateY(0);
            }
            100% {
              transform: translateY(-100%);
            }
          }

          .bg-deep-space {
            background: linear-gradient(to bottom, #000033, #000066);
            position: relative;
            overflow: hidden;
          }

          .stars {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 200%;
            background-image:
                radial-gradient(2px 2px at 20px 30px, #eee, rgba(0,0,0,0)),
                radial-gradient(2px 2px at 40px 70px, #fff, rgba(0,0,0,0)),
                radial-gradient(1px 1px at 90px 40px, #ddd, rgba(0,0,0,0)),
                radial-gradient(2px 2px at 160px 120px, #fff, rgba(0,0,0,0));
            background-repeat: repeat;
            background-size: 200px 200px;
            animation: scroll 60s linear infinite;
            opacity: 0.3;
          }
        `}</style>
            <SpaceLightsOut />
        </div>
    );
};

export default App;
```

### Explanation

1. A 6x6 grid of lights: The game board is created using a nested array structure, rendered as a grid of buttons using Tailwind's `grid` classes.
2. Light toggling mechanism: The `toggleLights` function handles the logic for toggling the clicked light and its adjacent lights. This is called within the `handleCellClick` function.
3. Move counter: A state variable `moves` keeps track of the number of turns, displayed below the game board.
4. Space-themed background: The background is created using CSS gradients and animations. The scrolling star effect is achieved using keyframe animations and multiple radial gradients.
5. Initial board generation: The `createInitialGrid` function simulates 10 random moves, ensuring the board is solvable.
6. Winning message: A conditional rendering shows a congratulatory message when the `gameWon` state is true.

The implementation successfully creates an interactive, visually appealing Space Lights Out game and follows modern React and CSS best practices.