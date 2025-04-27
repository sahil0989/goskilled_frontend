import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Button } from '../@/components/ui/button';
import { ArrowUpDownIcon } from 'lucide-react';
import { sortOptions } from '../config';
import { useStudent } from '../context/student-context';
import CourseComponent from '../components/course/CourseComponent';
import { fetchStudentViewCourseListService } from '../services';
import { Skeleton } from '../@/components/ui/skeleton';

export default function Courses() {

    const { user } = useAuth()
    const { studentViewCoursesList, setStudentViewCoursesList, loadingState, setLoadingState } = useStudent()
    const navigate = useNavigate();

    const [sort, setSort] = useState('title-atoz')

    useEffect(() => {
        const handleLogin = () => {
            const storedUser = localStorage.getItem("user");
            if (!storedUser) {
                navigate("/auth/login")
            }
        }
        handleLogin()
    }, [user, navigate]);

    useEffect(() => {
        return () => {
            sessionStorage.removeItem("filters");
        };
    }, []);

    useEffect(() => {
        if (sort !== null)
            fetchAllStudentViewCourses(sort);

        // eslint-disable-next-line
    }, [sort]);

    async function fetchAllStudentViewCourses(sort) {
        const query = new URLSearchParams({
            sortBy: sort,
        });
        const response = await fetchStudentViewCourseListService(query);
        if (response?.success) {
            setStudentViewCoursesList(response?.data);
            setLoadingState(false);
        }
    }

    return <>
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">All Courses</h1>
            <div className="flex flex-col md:flex-row gap-4">
                <main className='flex-1'>
                    <div className='flex justify-end items-center mb-4 gap-5'>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-2 p-5 shadow-md"
                                >
                                    <ArrowUpDownIcon className='h-4 w-4' />
                                    <span className='text-[16px] font-medium'>Sort By</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end' className='w-[200px]'>
                                <DropdownMenuRadioGroup className='px-4 py-2 rounded-lg shadow-lg bg-white mt-4' value={sort} onValueChange={(value) => setSort(value)}>
                                    {
                                        sortOptions.map((sortItem) => {
                                            return <DropdownMenuRadioItem className=' cursor-pointer px-2 py-1' value={sortItem.id} key={sortItem.id}>
                                                {sortItem.label}
                                            </DropdownMenuRadioItem>
                                        })
                                    }
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className='space-y-4'>
                        {
                            studentViewCoursesList && studentViewCoursesList?.length > 0 ?
                                <div className='grid md:gap-10 md:grid-cols-2 grid-cols-1 w-full'>
                                    {
                                        studentViewCoursesList?.map((courseItem) => {
                                            return <CourseComponent key={courseItem?._id} data={courseItem} />
                                        })
                                    }
                                </div> : loadingState ? (<Skeleton />) : (<h1 className="font-extrabold text-4xl">No Courses Found</h1>)
                        }
                    </div>
                </main>
            </div>
        </div>
    </>;
}
