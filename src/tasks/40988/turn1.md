### Code Plan:

1. UI Plan:
   1. Create a responsive layout with a centered game board.
   2. Use a Card component from Shadcn for the game container.
   3. Implement a 6x5 grid for the game board using Tailwind's grid classes.
   4. Style game cells with a black background and hover effects.
   5. Create circular backgrounds for pieces with respective colors (red/blue).
   6. Use emoji symbols for different piece types.
   7. Highlight valid moves with a yellow background.
   8. Display current player and winner announcement with appropriate colors.
   9. Add a restart button below the game board.
   10. Apply a black to grey gradient background outside the game container.

2. Gameplay Plan:
   1. Initialize the game board with the correct piece placement.
   2. Implement turn-based gameplay, alternating between Red and Blue players.
   3. When a piece is selected:
       - Calculate and display valid moves based on piece type and current board state.
       - Prevent Ninja from capturing Daimyo.
   4. Allow piece movement and capture:
       - Update board state when a valid move is made.
       - Check for win condition (Daimyo capture) after each move.
   5. Update current player after each move.
   6. Display winner announcement when a Daimyo is captured.
   7. Implement game reset functionality.

### Code:

```jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const BOARD_WIDTH = 5;
const BOARD_HEIGHT = 6;
const PLAYERS = ["Red", "Blue"];
const PIECES = {
    Samurai: { symbol: "🤺", moves: [[-1, -1], [-1, 1], [1, -1], [1, 1]] },
    Ronin: { symbol: "⚔️", moves: [[-1, 0], [1, 0], [0, -1], [0, 1]] },
    Daimyo: { symbol: "👹", moves: [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]] },
    Ninja: { symbol: "🥷", moves: [[-2, -2], [-2, 0], [-2, 2], [0, -2], [0, 2], [2, -2], [2, 0], [2, 2]] },
};

const INITIAL_BOARD = [
    ["Samurai-Red", "Ronin-Red", "Daimyo-Red", "Ronin-Red", "Samurai-Red"],
    ["Ninja-Red", "Ninja-Red", "Ninja-Red", "Ninja-Red", "Ninja-Red"],
    [null, null, null, null, null],
    [null, null, null, null, null],
    ["Ninja-Blue", "Ninja-Blue", "Ninja-Blue", "Ninja-Blue", "Ninja-Blue"],
    ["Samurai-Blue", "Ronin-Blue", "Daimyo-Blue", "Ronin-Blue", "Samurai-Blue"],
];

function SamuraiTactics() {
    const [board, setBoard] = useState(INITIAL_BOARD);
    const [currentPlayer, setCurrentPlayer] = useState(PLAYERS[0]);
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [validMoves, setValidMoves] = useState([]);
    const [winner, setWinner] = useState(null);

    useEffect(() => {
        if (selectedPiece) {
            setValidMoves(getValidMoves(selectedPiece.row, selectedPiece.col));
        } else {
            setValidMoves([]);
        }
    }, [selectedPiece, board, currentPlayer]);

    const getValidMoves = (row, col) => {
        const piece = board[row][col];
        const moves = [];

        if (!piece) return moves;

        const [pieceType, player] = piece.split("-");
        if (player !== currentPlayer) return moves;

        const directions = PIECES[pieceType].moves;

        directions.forEach(([dx, dy]) => {
            let x = row + dx;
            let y = col + dy;

            while (x >= 0 && x < BOARD_HEIGHT && y >= 0 && y < BOARD_WIDTH) {
                if (!board[x][y] || board[x][y].split("-")[1] !== currentPlayer) {
                    if (!(pieceType === "Ninja" && board[x][y] && board[x][y].split("-")[0] === "Daimyo")) {
                        moves.push([x, y]);
                    }
                }
                if (board[x][y] || pieceType === "Daimyo" || pieceType === "Ninja") break;
                x += dx;
                y += dy;
            }
        });

        return moves;
    };

    const handleClick = (row, col) => {
        if (winner) return;

        if (selectedPiece) {
            const isValidMove = validMoves.some(([r, c]) => r === row && c === col);
            if (isValidMove) {
                movePiece(row, col);
            } else {
                setSelectedPiece(null);
            }
        } else {
            const piece = board[row][col];
            if (piece && piece.split("-")[1] === currentPlayer) {
                setSelectedPiece({ row, col });
            }
        }
    };

    const movePiece = (toRow, toCol) => {
        const newBoard = board.map(row => [...row]);
        const [fromRow, fromCol] = [selectedPiece.row, selectedPiece.col];
        const movingPiece = newBoard[fromRow][fromCol];
        const [movingPieceType] = movingPiece.split("-");

        if (newBoard[toRow][toCol] && newBoard[toRow][toCol].split("-")[0] === "Daimyo" && movingPieceType !== "Ninja") {
            setWinner(currentPlayer);
        }

        newBoard[toRow][toCol] = movingPiece;
        newBoard[fromRow][fromCol] = null;

        setBoard(newBoard);
        setSelectedPiece(null);
        setCurrentPlayer(currentPlayer === PLAYERS[0] ? PLAYERS[1] : PLAYERS[0]);
    };

    const resetGame = () => {
        setBoard(INITIAL_BOARD.map(row => [...row]));
        setCurrentPlayer(PLAYERS[0]);
        setSelectedPiece(null);
        setValidMoves([]);
        setWinner(null);
    };

    const renderPiece = (piece) => {
        if (!piece) return null;
        const [type, player] = piece.split("-");
        return (
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                player === "Red" ? "bg-red-500" : "bg-blue-500"
            }`}>
                <span className="text-xl text-white">{PIECES[type].symbol}</span>
            </div>
        );
    };

    const getCellClassName = (row, col, piece) => {
        let classes = "w-12 h-12 p-0 bg-black flex items-center justify-center ";

        if (selectedPiece && selectedPiece.row === row && selectedPiece.col === col) {
            classes += "ring-2 ring-orange-400 ";
        }

        if (validMoves.some(([r, c]) => r === row && c === col)) {
            classes += "bg-yellow-600 hover:bg-yellow-500 ";
        } else {
            classes += "hover:bg-gray-600 ";
        }

        return classes.trim();
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-gray-800 flex items-center justify-center py-8">
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">Samurai Tactics</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-5 gap-1 mb-4">
                        {board.map((row, rowIndex) =>
                            row.map((cell, colIndex) => (
                                <Button
                                    key={`${rowIndex}-${colIndex}`}
                                    className={getCellClassName(rowIndex, colIndex, cell)}
                                    onClick={() => handleClick(rowIndex, colIndex)}
                                >
                                    {renderPiece(cell)}
                                </Button>
                            ))
                        )}
                    </div>
                    <div className="text-center mb-4">
                        {winner ? (
                            <p className={`text-xl font-bold ${winner === "Red" ? "text-red-500" : "text-blue-500"}`}>
                                {winner} wins!
                            </p>
                        ) : (
                            <p>Current player: <span className={`font-bold ${currentPlayer === "Red" ? "text-red-500" : "text-blue-500"}`}>{currentPlayer}</span></p>
                        )}
                    </div>
                    <Button className="w-full" onClick={resetGame}>
                        Restart Game
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default SamuraiTactics;
```

### Explanation:

1. The game would be implemented as a single React component named `SamuraiTactics`. This component would use various hooks to manage the game state:

   - `useState` for the board state, current player, selected piece, valid moves, and winner.
   - `useEffect` to calculate valid moves whenever a piece is selected.

2. The game board would be rendered as a grid of cells, each represented by a Button component from Shadcn. Each cell would contain a piece (if present) rendered with the appropriate emoji and colored background.

3. The game logic would be implemented through several helper functions:

   - `getValidMoves`: Calculates valid moves for a selected piece.
   - `handleClick`: Manages piece selection and movement.
   - `movePiece`: Updates the board state when a piece is moved.
   - `resetGame`: Resets the game to its initial state.

This implementation provides a fully functional Samurai Tactics game with the requested features and styling.