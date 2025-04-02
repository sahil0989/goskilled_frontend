import React from 'react'
import logo from "../images/logo.png"

export default function Footer() {
    return (
        <div>
            <div className='flex px-10 bg-[#1A6E0A] w-full py-8 text-white'>
                <div>
                    <div className='flex items-center rounded-lg p-2 bg-white'>
                        <img src={logo} className='w-16' alt='' />
                        <h2 className='text-2xl font-bold text-black'>GoSkilled</h2>
                    </div>
                </div>
            </div>
        </div>
    )
}