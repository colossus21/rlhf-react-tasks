import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

// Piece component
const Piece = ({ type, player, onClick }) => {
    const symbols = { 'Ronin': '⚔️', 'Samurai': '🤺', 'Daimyo': '👹', 'Ninja': '🥷' };
    const bgColor = player === 'Red' ? 'bg-red-500' : 'bg-blue-500';

    return (
        <div className={`w-10 h-10 flex items-center justify-center rounded-full ${bgColor} cursor-pointer`} onClick={onClick}>
            <span>{symbols[type]}</span>
        </div>
    );
};

// Cell component
const Cell = ({ piece, isSelected, isValidMove, onClick }) => {
    const cellClasses = `w-12 h-12 flex items-center justify-center border border-gray-300 ${isSelected ? 'bg-yellow-200' : isValidMove ? 'bg-yellow-100' : 'bg-black'}`;

    return (
        <div className={cellClasses} onClick={onClick}>
            {piece && <Piece {...piece} />}
        </div>
    );
};

// Board component
const Board = ({ boardState, onSelectPiece, validMoves }) => {
    return (
        <div className="grid grid-cols-5 gap-1">
            {boardState.map((row, i) => row.map((piece, j) => (
                <Cell
                    key={`${i}-${j}`}
                    piece={piece}
                    isSelected={piece && piece.selected}
                    isValidMove={validMoves.includes(`${i},${j}`)}
                    onClick={() => onSelectPiece(i, j)}
                />
            )))}
        </div>
    );
};

// Main App Component
export default function App() {
    const [board, setBoard] = useState(initialBoard());
    const [currentPlayer, setCurrentPlayer] = useState('Red');
    const [winner, setWinner] = useState(null);
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [validMoves, setValidMoves] = useState([]);

    useEffect(() => {
        if (selectedPiece) {
            setValidMoves(calculateValidMoves(board, selectedPiece));
        }
    }, [selectedPiece, board]);

    const initialBoard = () => [
        ['Samurai', 'Ronin', 'Daimyo', 'Ronin', 'Samurai'].map(type => ({ type, player: 'Red', selected: false })),
        Array(5).fill({ type: 'Ninja', player: 'Red', selected: false }),
        ...Array(4).fill(Array(5).fill(null)),
        Array(5).fill({ type: 'Ninja', player: 'Blue', selected: false }),
        ['Samurai', 'Ronin', 'Daimyo', 'Ronin', 'Samurai'].map(type => ({ type, player: 'Blue', selected: false })),
    ];

    const handleMove = (from, to) => {
        let newBoard = [...board];
        newBoard[to.row][to.col] = { ...newBoard[from.row][from.col], selected: false };
        newBoard[from.row][from.col] = null;
        setBoard(newBoard);
        checkWin(newBoard, currentPlayer);
        setCurrentPlayer(currentPlayer === 'Red' ? 'Blue' : 'Red');
        setSelectedPiece(null);
    };

    const checkWin = (board, player) => {
        const opponent = player === 'Red' ? 'Blue' : 'Red';
        if (!board.some(row => row.some(p => p && p.type === 'Daimyo' && p.player === opponent))) {
            setWinner(player);
        }
    };

    const calculateValidMoves = (board, { row, col }) => {
        // Implement move logic for each piece type here
        // This is a simplified version for demonstration
        const piece = board[row][col];
        let moves = [];
        if (piece.type === 'Ninja') {
            // Ninja movement logic (simplified)
            [[2,0], [-2,0], [0,2], [0,-2], [2,2], [-2,-2], [2,-2], [-2,2]].forEach(([dr, dc]) => {
                const newRow = row + dr, newCol = col + dc;
                if (newRow >= 0 && newRow < 6 && newCol >= 0 && newCol < 5 &&
                    (!board[newRow][newCol] || board[newRow][newCol].player !== piece.player)) {
                    moves.push(`${newRow},${newCol}`);
                }
            });
        }
        // Add other piece movements similarly
        return moves;
    };

    const restartGame = () => {
        setBoard(initialBoard());
        setCurrentPlayer('Red');
        setWinner(null);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 to-black text-white">
            <h1 className="text-4xl mb-4">Samurai Tactics</h1>
            {winner ?
                <div className={`text-${winner.toLowerCase()}-500 text-3xl mb-4`}>Winner: {winner}</div> :
                <div className={`text-${currentPlayer.toLowerCase()}-500 text-xl mb-4`}>Current Player: {currentPlayer}</div>
            }
            <div className="bg-white p-4 rounded shadow-lg">
                <Board boardState={board} onSelectPiece={(row, col) => {
                    if (winner) return;
                    if (!board[row][col] || board[row][col].player !== currentPlayer) {
                        if (selectedPiece && validMoves.includes(`${row},${col}`)) {
                            handleMove(selectedPiece, { row, col });
                        }
                        return;
                    }
                    setSelectedPiece({ row, col });
                }} validMoves={validMoves} />
            </div>
            {winner && <Button onClick={restartGame} className="mt-4">Restart Game</Button>}
        </div>
    );
}