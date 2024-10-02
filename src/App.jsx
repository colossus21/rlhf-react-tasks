import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const initialBoard = Array(36).fill(false);

function App() {
  const [board, setBoard] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    if (board.every(light => !light)) {
      setIsWon(true);
    }
  }, [board]);

  const toggleLight = (index) => {
    if (isWon) return;
    const newBoard = [...board];
    const toggle = (i) => newBoard[i] = !newBoard[i];

    toggle(index);
    if (index % 6 !== 0) toggle(index - 1); // Left
    if (index % 6 !== 5) toggle(index + 1); // Right
    if (index >= 6) toggle(index - 6); // Up
    if (index < 30) toggle(index + 6); // Down

    setBoard(newBoard);
    setMoves(prev => prev + 1);
  };

  const scrambleBoard = () => {
    let scrambled = [...initialBoard];
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * 36);
      toggleLight(randomIndex);
    }
    return scrambled;
  };

  const resetGame = () => {
    setBoard(scrambleBoard());
    setMoves(0);
    setIsWon(false);
  };

  return (
      <div className="min-h-screen bg-deep-space flex items-center justify-center">
        <div className="stars"></div>
        <Card className="w-full max-w-sm p-4 bg-space-blue">
          <CardHeader>
            <CardTitle>Space Lights Out</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Board board={board} onToggle={toggleLight} />
            <MoveCounter moves={moves} />
          </CardContent>
          {isWon && <WinMessage onReset={resetGame} />}
        </Card>
      </div>
  );
}

function Board({ board, onToggle }) {
  return (
      <div className="grid grid-cols-6 gap-1">
        {board.map((light, index) => (
            <div
                key={index}
                className={`h-8 w-8 rounded ${light ? 'bg-neon-green' : 'bg-dark-space'} cursor-pointer`}
                onClick={() => onToggle(index)}
            ></div>
        ))}
      </div>
  );
}

function MoveCounter({ moves }) {
  return <p className="text-center mt-4 text-neon-green">Moves: {moves}</p>;
}

function WinMessage({ onReset }) {
  return (
      <div className="mt-4 text-center">
        <p className="text-xl text-neon-green">You've restored the night sky!</p>
        <button onClick={onReset} className="mt-2 px-4 py-2 bg-neon-green text-space-blue rounded">Play Again</button>
      </div>
  );
}

export default App;

// CSS for background animation
const styles = `
@keyframes move-twink-back {
  from {background-position:0 0;}
  to {background-position:-10000px 5000px;}
}

.bg-deep-space {
  background: #00001a;
}

.stars, .twinkling {
  position:absolute;
  top:0;
  left:0;
  right:0;
  bottom:0;
  width:100%;
  height:100%;
  display:block;
}

.stars {
  background:#00001a url(data:image/png;base64,...) repeat top center;
  z-index:0;
  animation:move-twink-back 200s linear infinite;
}
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);