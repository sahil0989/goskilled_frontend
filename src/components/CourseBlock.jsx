import React from 'react'
import { FaStar } from "react-icons/fa";
import course1 from "../images/courses/course1.png"
import { Button } from '../@/components/ui/button'

export default function CourseBlock() {
    return (
        <div className='w-72 shadow-sm bg-white pb-3 rounded-lg'>
            <div className=''>
                <img src={course1} className='w-full h-40 object-cover rounded-t-lg' alt='' />
            </div>
            <div className='pl-2 pt-2'>
                <h2 className='font-bold line-clamp-2'>Digital Marketing Mastery – Master Online Growth & Sales</h2>
                <p className='text-sm line-clamp-2'>Become a certified digital marketing expert & launch your career or business online.</p>

                {/* star block  */}
                <div className='flex gap-1 py-2 text-yellow-400'>
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                </div>

                {/* lower blocks  */}
                <div className='flex justify-between items-center pt-5 px-2'>
                    <div className='font-bold text-lg cursor-not-allowed'></div>
                    <Button className="bg-[#1A6E0A] hover:bg-[#204718] cursor-pointer">Get Started</Button>
                </div>
            </div>
        </div>
    )
}
