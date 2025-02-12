import React from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const GameOver = ({ resetGame, winMsg }) => {
    return (
        <div className='h-full w-full flex justify-center items-center bg-slate-800/30 absolute top-0 left-0'>
            <div className='bg-slate-600 rounded-xl h-96 w-96 p-5 flex flex-col gap-5 justify-center items-center text-white font-bold '>
                {/* <div>{winMsg}</div> */}
                {
                    winMsg == 0 &&
                    <>
                        <div>Game Over !!</div>
                        <DotLottieReact
                            src="https://lottie.host/2591fd75-6eb9-45c2-bacb-4b972ac99ac8/OaYdCyY0jt.lottie"
                            loop
                            autoplay
                        />
                    </>
                }
                {
                    winMsg == 1 &&
                    <>
                        <div>You Win!!</div>
                        <DotLottieReact
                            src="https://lottie.host/b8b27ebb-ad9b-4bd2-b8a3-b55a5eb2c4b1/kiy5qZjPzH.lottie"
                            loop
                            autoplay
                        />
                    </>
                }
                <button onClick={resetGame} className='border-2 border-white rounded-md px-3 py-2'>Play Again</button>
            </div>
        </div>
    )
}

export default GameOver
