import { createContext, useContext, useEffect, useState } from "react";

const LevelContext = createContext({
    level: '',
    setLevel: () => { },
    boardSize: null,
    setBoardSize: () => { },
    createEmptyBoard: () => { },
    board: null,
    setBoard: () => { },
    numberofMines:null,
    setNumberofMines:()=>{}

})

export const LevelProvider = ({ children }) => {
    const [level, setLevel] = useState('Beginner')
    const [boardSize, setBoardSize] = useState(10)
    // let boardSize=10;
    const createEmptyBoard = (b) => {
        console.log("inside createBOard: ", b)
        return Array(b).fill().map(() =>
            Array(b).fill().map(() => ({
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                neighborMines: 0,
            }))
        );
    };
    const [board, setBoard] = useState(createEmptyBoard(10));

    const [numberofMines, setNumberofMines] = useState(10);

    useEffect(() => {
        if (level === 'Intermediate') {
            // setBoardSize(prev=>15)
            setBoardSize(15);
            setBoard(createEmptyBoard(15))
            setNumberofMines(15)
        }
        if (level === 'Expert') {
            // setBoardSize(20)
            setBoardSize(20)
            setBoard(createEmptyBoard(20))
            setNumberofMines(20)
        }
        if (level === 'Beginner') {
            // setBoardSize(10)
            setBoardSize(10)
            setBoard(createEmptyBoard(10));
            setNumberofMines(10)
        }
        //   console.log(level)
        //   console.log(boardSize)
    }, [level, boardSize])

    return (
        <LevelContext.Provider
            value={{ level, setLevel, boardSize, createEmptyBoard, board, setBoard, setBoardSize, numberofMines, setNumberofMines }}
        >
            {children}
        </LevelContext.Provider>
    )
}
export const useLevel = () => useContext(LevelContext)