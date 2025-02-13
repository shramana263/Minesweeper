import { useState, useEffect, useRef } from 'react';
import './Minesweeper.css';
import GameOver from './components/GameOver';
import Navbar from './components/Navbar';
import { useStopwatch } from 'react-timer-hook';
import click from '/audio/click.wav';
import explode from '/audio/explosion.wav';
import lose from '/audio/lose.wav';
import win from '/audio/win.wav';

const BOARD_SIZE = 10;
const NUMBER_OF_MINES = 10;

const createEmptyBoard = () => {
  return Array(BOARD_SIZE).fill().map(() =>
    Array(BOARD_SIZE).fill().map(() => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborMines: 0,
    }))
  );
};

const Mines = () => {
  const [board, setBoard] = useState(createEmptyBoard());
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(false);
  const [winMsg, setWinMsg] = useState(0);
  const [isFirstClick, setIsFirstClick] = useState(true);
  const [flags, setFlags] = useState(NUMBER_OF_MINES)
  const clickRef = useRef();
  const winRef = useRef();
  const loseRef = useRef();
  const explodeRef = useRef();

  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({ autoStart: false });

  const resetGame = () => {
    setBoard(createEmptyBoard());
    setGameOver(false);
    setWinner(false);
    setIsFirstClick(true);
  };

  const revealCell = (x, y) => {

    if (gameOver || board[x][y].isRevealed || board[x][y].isFlagged) {
      return;
    }

    if (isFirstClick) {
      clickRef.current.play();
      start();
      setIsFirstClick(false);
      const newBoard = [...board];
      const safeCells = [];
      for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
          if (Math.abs(i - x) > 1 || Math.abs(j - y) > 1) {
            safeCells.push({ x: i, y: j });
          }
        }
      }

      let minesPlaced = 0;
      while (minesPlaced < NUMBER_OF_MINES) {
        if (safeCells.length === 0) {
          break;
        }
        const randomIndex = Math.floor(Math.random() * safeCells.length);
        const cell = safeCells[randomIndex];
        if (!newBoard[cell.x][cell.y].isMine) {
          newBoard[cell.x][cell.y].isMine = true;
          minesPlaced++;
          safeCells.splice(randomIndex, 1);
        }
      }

      for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
          if (!newBoard[i][j].isMine) {
            let count = 0;
            for (let dx = -1; dx <= 1; dx++) {
              for (let dy = -1; dy <= 1; dy++) {
                const ni = i + dx;
                const nj = j + dy;
                if (ni >= 0 && ni < BOARD_SIZE && nj >= 0 && nj < BOARD_SIZE) {
                  if (newBoard[ni][nj].isMine) {
                    count++;
                  }
                }
              }
            }
            newBoard[i][j].neighborMines = count;
          }
        }
      }

      const emptyCellReveal = (x, y) => {
        if (x < 0 || x >= BOARD_SIZE || y < 0 || y >= BOARD_SIZE || newBoard[x][y].isRevealed || newBoard[x][y].isFlagged) {
          return;
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
      return;
    }

    const newBoard = [...board];
    if (newBoard[x][y].isMine) {
      const minesToReveal = [];
      // Collect all mines first
      for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
          if (newBoard[i][j].isMine && !newBoard[i][j].isRevealed) {
            minesToReveal.push({ x: i, y: j });
          }
        }
      }

      // Sequential reveal with delays
      minesToReveal.forEach((mine, index) => {
        setTimeout(() => {
          explodeRef.current.play();
          const updatedBoard = [...newBoard];
          updatedBoard[mine.x][mine.y].isRevealed = true;
          setBoard(updatedBoard);

          // if(index === 0) explodeRef.current.play();
          if (index === minesToReveal.length - 1) {
            setGameOver(true);
            loseRef.current.play();
          }
        }, index * 100); // 100ms delay between reveals
      });

      return;
    }
    clickRef.current.play();
    // if(!newBoard[x][y].isMine){
    //   clickRef.current.play();
    // }

    const emptyCellReveal = (x, y) => {
      if (x < 0 || x >= BOARD_SIZE || y < 0 || y >= BOARD_SIZE || newBoard[x][y].isRevealed || newBoard[x][y].isFlagged) {
        return;
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

    const won = newBoard.flat().every(cell =>
      cell.isRevealed || (cell.isMine && !cell.isRevealed)
    );
    if (won) {
      setGameOver(true);
      setWinner(true);
      //audio for win
      winRef.current.play();
    }
  };

  const handleRightClick = (e, x, y) => {
    e.preventDefault();
    if (gameOver || board[x][y].isRevealed) {
      return;
    }
    if (flags == 0) {
      return;
    }
    const newBoard = [...board];
    newBoard[x][y].isFlagged = !newBoard[x][y].isFlagged;
    setBoard(newBoard);
    setFlags(prev => prev - 1);

  };

  useEffect(() => {
    if (gameOver) {
      setWinMsg(prev => winner ? 1 : 0);
    }
  }, [gameOver, winner]);

  return (
    <>
      <Navbar mines={flags} days={days} hours={hours} minutes={minutes} seconds={seconds} />
      <div className='screen-height minesweeper-screen flex justify-center items-center'>
        {/* <div className=" justify-center items-center flex"> */}
        <div className="minesweeper screen-height w-screen gap-5 ">
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
                    <audio src={click} ref={clickRef}></audio>
                    <audio src={win} ref={winRef}></audio>
                    <audio src={lose} ref={loseRef}></audio>
                    <audio src={explode} ref={explodeRef}></audio>
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
                {winMsg !== null && <GameOver resetGame={resetGame} winMsg={winMsg} />}
              </div>
            )}
          </div>
        </div>
        {/* </div> */}
      </div>
    </>
  );
};

export default Mines;