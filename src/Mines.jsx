import { useState, useEffect } from 'react';
import './Minesweeper.css';

const BOARD_SIZE = 10;
const NUMBER_OF_MINES = 10;

const createBoard = () => {
  const board = Array(BOARD_SIZE).fill().map(() =>
    Array(BOARD_SIZE).fill().map(() => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborMines: 0,
    }))
  );

  // Place mines
  let minesPlaced = 0;
  while (minesPlaced < NUMBER_OF_MINES) {
    const x = Math.floor(Math.random() * BOARD_SIZE);
    const y = Math.floor(Math.random() * BOARD_SIZE);
    if (!board[x][y].isMine) {
      board[x][y].isMine = true;
      minesPlaced++;
    }
  }

  // Calculate neighbor mines
  for (let x = 0; x < BOARD_SIZE; x++) {
    for (let y = 0; y < BOARD_SIZE; y++) {
      if (!board[x][y].isMine) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const newX = x + i;
            const newY = y + j;
            if (newX >= 0 && newX < BOARD_SIZE && newY >= 0 && newY < BOARD_SIZE && board[newX][newY].isMine) {
              count++;
            }
          }
        }
        board[x][y].neighborMines = count;
      }
    }
  }

  return board;
};

const Mines = () => {
  const [board, setBoard] = useState(createBoard());
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(false);

  const resetGame = () => {
    setBoard(createBoard());
    setGameOver(false);
    setWinner(false);
  };

  const revealCell = (x, y) => {
    if (gameOver || board[x][y].isRevealed || board[x][y].isFlagged) {
      return;

    }

    const newBoard = [...board];
    if (newBoard[x][y].isMine) {
      // Game Over
      newBoard[x][y].isRevealed = true;
      setBoard(newBoard);
      setGameOver(true);
      return;
    }

    const emptyCellReveal = (x, y) => {
      if (x < 0 || x >= BOARD_SIZE || y < 0 || y >= BOARD_SIZE || newBoard[x][y].isRevealed || newBoard[x][y].isFlagged) {
        return
      }

      newBoard[x][y].isRevealed = true;

      if (newBoard[x][y].neighborMines === 0) {
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            emptyCellReveal(x + dx, y + dy);
          }
        }
      }
    };

    emptyCellReveal(x, y);
    setBoard(newBoard);

    // Check win condition
    const won = board.flat().every(cell =>
      cell.isRevealed || (cell.isMine && !cell.isRevealed)
    );
    if (won) {
      setGameOver(true);
      setWinner(true);
    }
  };

  const handleRightClick = (e, x, y) => {
    e.preventDefault();
    if (gameOver || board[x][y].isRevealed) {
      return
    }

    const newBoard = [...board];
    newBoard[x][y].isFlagged = !newBoard[x][y].isFlagged;
    setBoard(newBoard);
  };

  return (
    <>
      <div className="h-screen minesweeper-screen justify-center items-center flex ">

        <div className="minesweeper w-screen gap-5">

          <div className='text-4xl font-bold'>
            MineSweeper
          </div>

          <div className="board">
            {board.map((row, x) => (
              <div key={x} className="row">
                {row.map((cell, y) => (
                  <button
                    key={`${x}-${y}`}
                    className={`cell ${cell.isRevealed ? 'revealed' : ''}`}
                    onClick={() => revealCell(x, y)}
                    onContextMenu={(e) => handleRightClick(e, x, y)}
                  >
                    {cell.isRevealed ? (
                      cell.isMine ? '💣' : cell.neighborMines || ''
                    ) : (
                      cell.isFlagged ? '🚩' : ''
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className="status">
            {gameOver && (
              <div>
                {winner ? 'You Win! 🎉' : 'Game Over! 💥'}
                <button onClick={resetGame}>Play Again</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Mines;