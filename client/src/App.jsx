import { useEffect, useState } from "react";

const winningLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function getWinner(board) {
  for (const [a, b, c] of winningLines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

export default function App() {
  const [board, setBoard] = useState(Array(9).fill(""));
  const [player, setPlayer] = useState("X");
  const [apiStatus, setApiStatus] = useState("Checking backend...");
  const winner = getWinner(board);
  const draw = !winner && board.every(Boolean);

  useEffect(() => {
    fetch("http://localhost:5000/api/health")
      .then((response) => {
        if (!response.ok) throw new Error("Backend request failed");
        return response.json();
      })
      .then((data) => setApiStatus(data.message))
      .catch(() => setApiStatus("Backend not connected"));
  }, []);

  function makeMove(index) {
    if (board[index] || winner || draw) return;
    const next = [...board];
    next[index] = player;
    setBoard(next);
    if (!getWinner(next) && next.some((cell) => !cell)) {
      setPlayer(player === "X" ? "O" : "X");
    }
  }

  function restart() {
    setBoard(Array(9).fill(""));
    setPlayer("X");
  }

  return (
    <main className="container">
      <h1>Tic Tac Toe</h1>
      <p className="status">
        {winner ? `Player ${winner} wins!` : draw ? "It's a draw!" : `Player ${player}'s turn`}
      </p>
      <div className="board">
        {board.map((cell, index) => (
          <button
            className="cell"
            key={index}
            onClick={() => makeMove(index)}
            disabled={Boolean(cell) || Boolean(winner) || draw}
            aria-label={`Square ${index + 1}`}
          >
            {cell}
          </button>
        ))}
      </div>
      <button className="restart" onClick={restart}>Restart Game</button>
      <p className="api-status">Backend: {apiStatus}</p>
    </main>
  );
}
