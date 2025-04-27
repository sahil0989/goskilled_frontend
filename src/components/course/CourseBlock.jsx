import React from 'react'
import { Button } from '../../@/components/ui/button'
import { Link } from 'react-router-dom';

export default function CourseBlock({ data }) {

    return (
        <Link to={"/courses"} className='w-72 shadow-lg bg-white pb-3 rounded-lg'>
            <div className=''>
                <img src={data.imgUrl || data.image} className='w-full h-40 object-cover rounded-t-lg' alt='' />
            </div>
            <div className='pl-2 pt-2'>
                <h2 className='font-bold line-clamp-2'>{data.title}</h2>
                <p className='text-sm line-clamp-2'>{data.description}</p>

                {/* lower blocks  */}
                <div className='flex justify-between items-center pt-5 px-2'>
                    <div className='font-bold text-lg cursor-not-allowed'></div>
                    <Button className="bg-[#1A6E0A] hover:bg-[#204718] cursor-pointer">Get Started</Button>
                </div>
            </div>
        </Link>
    )
}
