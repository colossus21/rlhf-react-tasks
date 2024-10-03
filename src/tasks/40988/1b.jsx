import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SamuraiTactics = () => {
    const [board, setBoard] = useState(Array(6).fill().map(() => Array(5).fill(null)));
    const [currentPlayer, setCurrentPlayer] = useState('red');
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [winner, setWinner] = useState(null);

    const pieces = {
        samurai: '🤺', ronin: '⚔️', daimyo: '👹', ninja: '🥷'
    };

    const initialBoard = () => {
        const initial = [
            ['samurai', 'ronin', 'daimyo', 'ronin', 'samurai'],
            ['ninja', 'ninja', 'ninja', 'ninja', 'ninja'],
            [null, null, null, null, null],
            [null, null, null, null, null],
            ['ninja', 'ninja', 'ninja', 'ninja', 'ninja'],
            ['samurai', 'ronin', 'daimyo', 'ronin', 'samurai']
        ];
        return initial.map((row, i) => row.map((type, j) => type ? { type, player: i < 3 ? 'red' : 'blue' } : null));
    };

    useEffect(() => {
        setBoard(initialBoard());
    }, []);

    const isValidMove = (from, to) => {
        const piece = board[from.row][from.col];
        if (!piece) return false;

        const rowDiff = Math.abs(to.row - from.row);
        const colDiff = Math.abs(to.col - from.col);

        switch(piece.type) {
            case 'samurai':
                return (rowDiff === colDiff);
            case 'ronin':
                return (rowDiff === 0 || colDiff === 0);
            case 'daimyo':
                return (rowDiff <= 1 && colDiff <= 1);
            case 'ninja':
                return (rowDiff === 2 && colDiff === 0) || (rowDiff === 0 && colDiff === 2) || (rowDiff === 2 && colDiff === 2);
            default:
                return false;
        }
    };

    const handleCellClick = (row, col) => {
        if (winner) return;

        if (selectedPiece) {
            if (isValidMove(selectedPiece, { row, col })) {
                const newBoard = JSON.parse(JSON.stringify(board));
                const targetPiece = newBoard[row][col];
                if (targetPiece && targetPiece.type === 'daimyo' && targetPiece.player !== currentPlayer) {
                    setWinner(currentPlayer);
                } else if (targetPiece && targetPiece.type === 'daimyo' && targetPiece.player === currentPlayer) {
                    return; // Cannot capture own Daimyo
                }
                newBoard[row][col] = { ...board[selectedPiece.row][selectedPiece.col] };
                newBoard[selectedPiece.row][selectedPiece.col] = null;
                setBoard(newBoard);
                setSelectedPiece(null);
                setCurrentPlayer(currentPlayer === 'red' ? 'blue' : 'red');
            } else {
                setSelectedPiece(null);
            }
        } else if (board[row][col] && board[row][col].player === currentPlayer) {
            setSelectedPiece({ row, col });
        }
    };

    const getPieceColor = (player) => player === 'red' ? 'bg-red-500' : 'bg-blue-500';

    const restartGame = () => {
        setBoard(initialBoard());
        setCurrentPlayer('red');
        setWinner(null);
        setSelectedPiece(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-900 to-black flex flex-col items-center justify-center py-2">
            <Card className="w-full max-w-sm bg-white">
                <CardHeader>
                    <CardTitle>Samurai Tactics</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="text-center text-lg mb-4 text-{currentPlayer === 'red' ? 'red-500' : 'blue-500'}">
                        Current Player: {currentPlayer}
                    </div>
                    <div className="grid grid-cols-5 gap-1 p-2">
                        {board.map((row, i) => row.map((cell, j) => (
                            <div
                                key={`${i}-${j}`}
                                onClick={() => handleCellClick(i, j)}
                                className={`h-12 w-12 flex items-center justify-center text-2xl cursor-pointer 
                ${selectedPiece && isValidMove(selectedPiece, { row: i, col: j }) ? 'bg-yellow-300' : 'bg-black'}
                ${cell ? getPieceColor(cell.player) + ' rounded-full' : ''}`}>
                                {cell ? pieces[cell.type] : ''}
                            </div>
                        )))}
                    </div>
                    {winner && (
                        <div className="text-center mt-4 text-2xl text-{winner === 'red' ? 'red-500' : 'blue-500'}">
                            {winner === 'red' ? 'Red Wins!' : 'Blue Wins!'}
                        </div>
                    )}
                </CardContent>
                <Button onClick={restartGame} className="mt-4 w-full">Restart Game</Button>
            </Card>
        </div>
    );
};

export default SamuraiTactics;