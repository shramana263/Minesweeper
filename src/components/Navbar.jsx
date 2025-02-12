import React, { useEffect, useState } from 'react'
import MyStopwatch from './MyStopwatch';

const Navbar = ({ mines, days, hours, minutes , seconds }) => {
    
    return (
        <>
            {" "}

            <div className={` w-full h-[60px] bg-[#383838] flex justify-between items-center p-3 top-0`}>
                <div className='flex justify-center items-center gap-3'>
                    <div className='font-bold text-3xl text-neutral-50 flex justify-center items-center'>
                        <span>MineSweeper</span>
                    </div>
                </div>
                <div className='flex sm:gap-8 gap-2'>
                    <div className='flex justify-center items-center'>
                        <div className='text-xl'><span className='text-neutral-50'>No. of Mines : </span> <span className='font-bold text-red-400'>{mines}</span></div>
                    </div>
                    <div className='flex justify-center items-center'>
                        <div className='text-xl'><span className='text-neutral-50'>Timer : </span> <span className='font-bold text-green-400'><span>{hours}</span> : <span>{minutes}</span> : <span>{seconds}</span></span></div>
                        
                    </div>




                </div>
            </div>
        </>
    )
}

export default Navbar
