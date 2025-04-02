import React, { useState } from 'react';
import { RxCross2 } from "react-icons/rx";
import { CgMenuRightAlt } from "react-icons/cg";
import logo from "../images/logo.png"
import { Link } from 'react-router-dom';
import { Button } from '../@/components/ui/button';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {

    const [navOpen, setNavOpen] = useState(false);
    const { user, logout } = useAuth();

    return (
        <>
            <div className={`z-50 fixed w-full px-10 flex flex-col justify-center bg-white`}>
                <div className='flex  w-full h-20 items-center justify-between'>

                    <Link to={"/"}>
                        <img src={logo} className='w-16' alt='' />
                    </Link>

                    <div className={`lg:flex gap-7 hidden`}>
                        <div className=' cursor-pointer font-semibold'>
                            <Link to="/">Home</Link>
                        </div>
                        <div className=' cursor-pointer font-semibold'>
                            <Link to="/courses">Courses</Link>
                        </div>
                        <div className=' cursor-pointer font-semibold'>
                            <Link to="/about">About</Link>
                        </div>
                        <div className=' cursor-pointer font-semibold'>
                            <Link to="/contact">Contact Us</Link>
                        </div>
                    </div>

                    <div className='flex items-center gap-5'>
                        {
                            !navOpen && <CgMenuRightAlt onClick={() => setNavOpen(!navOpen)} className='lg:hidden text-black' size={26} />
                        }
                        {
                            navOpen && <RxCross2 onClick={() => setNavOpen(!navOpen)} className='lg:hidden text-black' size={26} />
                        }
                        {
                            user ? (<div>
                                <div>
                                    <Button onClick={() => logout()} className="border-2 border-[#1A6E0A] bg-transparent text-[#1A6E0A] hover:bg-[#1A6E0A] hover:text-white hidden md:block">LogOut</Button>
                                </div>
                            </div>) : (
                                <div className='flex gap-3 items-center'>
                                    <Link to={"/auth/login"}>
                                        <Button className="bg-[#1A6E0A] hover:bg-[#204718] hidden md:block">Login</Button>
                                    </Link>
                                    <Link to={"/auth/register"}>
                                        <Button className="border-2 border-[#1A6E0A] bg-transparent text-[#1A6E0A] hover:bg-[#1A6E0A] hover:text-white hidden md:block">Sign Up</Button>
                                    </Link>
                                </div>
                            )
                        }
                    </div>
                </div>
                <hr className='block w-full' />
                {
                    navOpen && <div className='flex flex-col items-end shadow-lg pb-2'>
                        <div className=' cursor-pointer font-semibold py-2 pr-6'>
                            <Link onClick={() => setNavOpen(false)} to="/">Home</Link>
                        </div>
                        <hr className='w-full' />
                        <div className=' cursor-pointer font-semibold py-2 pr-6'>
                            <Link onClick={() => setNavOpen(false)} to="/courses">Courses</Link>
                        </div>
                        <hr className='w-full' />
                        <div className=' cursor-pointer font-semibold py-2 pr-6'>
                            <Link onClick={() => setNavOpen(false)} to="/about">About</Link>
                        </div>
                        <hr className='w-full' />
                        <div className=' cursor-pointer font-semibold py-2 pr-6'>
                            <Link onClick={() => setNavOpen(false)} to="/contact">Contact Us</Link>
                        </div>
                        <hr className='w-full' />
                        <div className='flex gap-4 mt-2'>
                            <Link to={"/auth/login"}>
                                <Button className="bg-[#1A6E0A] hover:bg-[#204718] cursor-pointer">Login</Button>
                            </Link>
                            <Link to={"/auth/register"}>
                                <Button className="border-2 border-[#1A6E0A] bg-transparent text-[#1A6E0A] hover:bg-[#1A6E0A] hover:text-white">Sign Up</Button>
                            </Link>
                        </div>
                    </div>
                }
            </div >
        </>
    );
};

export default Navbar;
