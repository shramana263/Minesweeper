import { useState } from "react";
import { useStopwatch } from "react-timer-hook";
import Header from "./components/Header";
import GameBoard from "./components/GameBoard";

function App() {
  const [flagCount, setFlagCount] = useState(10);
  const [over, setOver] = useState(false);
  const { seconds, minutes, hours, pause, start } = useStopwatch({
    autoStart: false,
  });

  return (
    <>
      <Header
        flag={flagCount}
        over={over}
        setFlagCount={setFlagCount}
        seconds={seconds}
        minutes={minutes}
        hours={hours}
        pause={pause}
      />
      <div className="flex flex-col items-center justify-center w-full h-screen bg-[#2F4F4F] p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-[90%] sm:max-w-[80%] lg:max-w-[60%] flex flex-col items-center">
          <GameBoard
            row={9}
            col={9}
            mines={10}
            setFlagCount={setFlagCount}
            flagCount={flagCount}
            over={over}
            setOver={setOver}
            start={start}
          />
        </div>
      </div>
    </>
  );
}

export default App;