import React, { useEffect, useState } from 'react'

const Navbar = ({ mines, days, hours, minutes, seconds }) => {
    const [level, setLevel] = useState('Beginner');

    const handleChange = (event) => {
      setLevel(event.target.value);
    };

    return (
        <>
            {" "}

            <div className={` w-full h-[60px] bg-[#383838] flex justify-between items-center p-3 top-0`}>
                <div className='flex justify-center items-center gap-3'>
                    <div className='font-bold text-3xl text-neutral-50 flex justify-center items-center'>
                        <span className='flex justify-center items-center'>MineSweeper</span>
                    </div>
                </div>
                {/* <span className='text-xl text-center flex justify-center items-center text-neutral-100'><LevelSelect/></span> */}
                <label htmlFor="level" className="text-white mr-2">
                    Level:
                </label>
                <select
                    id="level"
                    value={level}
                    onChange={handleChange}
                    className="bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:outline-none"
                >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Expert">Expert</option>
                </select>
                <div className='flex sm:gap-8 gap-2'>
                    <div className='flex justify-center items-center'>
                        <div className='text-xl'><span className='text-neutral-50'>Available Flags : </span> <span className='font-bold text-red-400'>{mines}</span></div>
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
