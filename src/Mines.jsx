import { useState, useEffect, useRef } from 'react';
import './Minesweeper.css';
import GameOver from './components/GameOver';
import Navbar from './components/Navbar';
import { useStopwatch } from 'react-timer-hook';
import click from '/audio/click.wav';
import explode from '/audio/explosion.wav';
import lose from '/audio/lose.wav';
import win from '/audio/win.wav';
import { useLevel } from './contexts/LevelContext';

const Mines = () => {
  const { level, setLevel, boardSize, createEmptyBoard, board, setBoard, numberofMines, setNumberofMines } = useLevel();
  // const boardSize = 10;
  // const numberofMines = 10;



  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(false);
  const [winMsg, setWinMsg] = useState(0);
  const [isFirstClick, setIsFirstClick] = useState(true);
  const [flags, setFlags] = useState(numberofMines)
  const clickRef = useRef();
  const winRef = useRef();
  const loseRef = useRef();
  const explodeRef = useRef();
  const windowFocused= useRef(true);


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
    setBoard(createEmptyBoard(level == 'Beginner' ? 10 : (level == 'Intermediate' ? 15 : 20)));
    setGameOver(false);
    setWinner(false);
    setIsFirstClick(true);
    setFlags(level == 'Beginner' ? 10 : (level == 'Intermediate' ? 15 : 20))
    reset();
    pause();
  };

  const revealCell = (x, y) => {

    if(!isRunning){
      start();
    }

    if (gameOver || board[x][y].isRevealed || board[x][y].isFlagged) {
      return;
    }

    if (isFirstClick) {
      clickRef.current.play();
      start();
      setIsFirstClick(false);
      const newBoard = [...board];
      const safeCells = [];
      for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
          if (Math.abs(i - x) > 1 || Math.abs(j - y) > 1) {
            safeCells.push({ x: i, y: j });
          }
        }
      }

      let minesPlaced = 0;
      while (minesPlaced < numberofMines) {
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

      for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
          if (!newBoard[i][j].isMine) {
            let count = 0;
            for (let dx = -1; dx <= 1; dx++) {
              for (let dy = -1; dy <= 1; dy++) {
                const ni = i + dx;
                const nj = j + dy;
                if (ni >= 0 && ni < boardSize && nj >= 0 && nj < boardSize) {
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
        if (x < 0 || x >= boardSize || y < 0 || y >= boardSize || newBoard[x][y].isRevealed || newBoard[x][y].isFlagged) {
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
      pause();
      const minesToReveal = [];
      // Collect all mines first
      for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
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
            setTimeout(() => {  // Use setTimeout to delay
              setGameOver(true);
              loseRef.current.play();
            }, 2000); // 3000 milliseconds = 3 seconds
          }
        }, index * 100); // 100ms delay between reveals
      });

      return;
    }
    // clickRef.current.play();
    // if(!newBoard[x][y].isMine){
    //   clickRef.current.play();
    // }

    const emptyCellReveal = (x, y) => {
      if (x < 0 || x >= boardSize || y < 0 || y >= boardSize || newBoard[x][y].isRevealed || newBoard[x][y].isFlagged) {
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

  useEffect(() => {
    setFlags(numberofMines)
  }, [numberofMines])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') { // Check visibilityState
        windowFocused.current = false;
        console.log("Window is hidden");
        pause(); // Pause the timer
      } else if (document.visibilityState === 'visible') {
        windowFocused.current = true;
        console.log("Window is visible");
        // start(); // Resume the timer
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pause, start]);

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
                    className={`cell ${level == 'Beginner' ? 'h-[60px] w-[60px]' : (level == 'Intermediate' ? 'h-[40px] w-[40px]' : 'h-[35px] w-[34px]')} ${cell.isRevealed ? 'revealed' : ''}`}
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
          <div className='flex gap-10'>
            <div className='rounded bg-yellow-900 text-yellow-50 px-4 py-2 text-xl hover:cursor-pointer'
              onClick={resetGame}
            >
              RESTART
            </div>
            {
              isRunning &&
              <div className='rounded bg-green-950 text-yellow-50 px-4 py-2 text-xl hover:cursor-pointer'
                onClick={() => pause()}
              >
                PAUSE
              </div>
            }
            {
              (!isRunning && !isFirstClick) &&
              <div className='rounded bg-green-950 text-yellow-50 px-4 py-2 text-xl hover:cursor-pointer'
                onClick={() => start()}
              >
                PLAY
              </div>
            }
            
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