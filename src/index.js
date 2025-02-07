export const generateData = (row, col, matrix) => {
    const newMatrix = matrix;
    let count = 0;
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < col; j++) {
        count = 0;
        if (newMatrix[i][j] == 0) {
          const movements = [
            [-1, 0], //up
            [-1, -1], //up-left
            [0, -1], //left
            [1, -1], //left-down
            [1, 0], //down
            [1, 1], //right-down
            [0, 1], //right
            [-1, 1], //top-right
          ];
          movements.forEach((move) => {
            let xrow = i + move[0];
            let ycol = j + move[1];
            if (
              xrow >= 0 &&
              ycol >= 0 &&
              xrow < row &&
              ycol < col &&
              newMatrix[xrow][ycol] == "*"
            ) {
              count++;
            }
          });
          newMatrix[i][j] = count;
        }
      }
    }
    return newMatrix;
  };
  
  export const generateMines = (row, col, mines) => {
    const newMatrix = Array.from({ length: row }, () => Array(row).fill(""));
    let m = 0;
    while (m < mines) {
      const randomRow = Math.floor(Math.random() * row);
      const randomCol = Math.floor(Math.random() * col);
      if (newMatrix[randomRow][randomCol] === "") {
        newMatrix[randomRow][randomCol] = "*";
        m++;
      }
    }
    return newMatrix;
  };
  
  export const restart = () => {
    window.location.reload();
  };