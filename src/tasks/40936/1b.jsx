// App.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import StarBackground from "./components/StarBackground";
import GameBoard from "./components/GameBoard";
import MoveCounter from "./components/MoveCounter";
import WinMessage from "./components/WinMessage";

function App() {
    const [board, setBoard] = useState([]);
    const [moves, setMoves] = useState(0);

    useEffect(() => {
        initializeBoard();
    }, []);

    const initializeBoard = () => {
        let newBoard = Array(36).fill(false);
        for (let i = 0; i < 10; i++) {
            let index = Math.floor(Math.random() * 36);
            toggleLight(index, newBoard);
        }
        setBoard(newBoard);
    };

    const toggleLight = (index, currentBoard = board) => {
        const directions = [1, -1, 6, -6];
        directions.forEach(dir => {
            const newIndex = index + dir;
            if (newIndex >= 0 && newIndex < 36 && (index % 6 !== 5 || dir !== 1) && (index % 6 !== 0 || dir !== -1)) {
                currentBoard[newIndex] = !currentBoard[newIndex];
            }
        });
        currentBoard[index] = !currentBoard[index];
        setBoard([...currentBoard]);
        setMoves(moves + 1);
    };

    const hasWon = board.every(light => !light);

    return (
        <StarBackground>
            <div className="flex flex-col items-center justify-center h-screen">
                <Card className="bg-opacity-50 bg-black p-4">
                    <CardContent>
                        <GameBoard board={board} toggleLight={toggleLight} />
                        <MoveCounter moves={moves} />
                        {hasWon && <WinMessage />}
                    </CardContent>
                </Card>
            </div>
        </StarBackground>
    );
}

export default App;