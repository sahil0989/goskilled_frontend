import React from 'react'
import { Button } from '../../@/components/ui/button'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom';
import { checkParticularEnrolledCourse } from '../../services';

export default function CourseComponent({ data }) {

    const { user } = useAuth();

    const navigate = useNavigate();

    const handleNavigation = async () => {

        if (user) {
            const userId = user?.user?.id || user?.id;

            console.log(userId);
            console.log("CourseId: ", data._id)

            const info = {
                courseId: data._id,
                userId: userId
            }

            const response = await checkParticularEnrolledCourse(info);
            // console.log("Response: ", response)

            if (response.enrolled) {
                navigate(`/course-progress/${data._id}`)
            } else {
                navigate(`/course-details/${data._id}`)
            }
        }
    }

    return (
        <div onClick={() => handleNavigation()} className='w-full md:px-28 pb-3 rounded-lg'>
            <div className='rounded-b-lg shadow-lg'>
                <div className=''>
                    <img src={data.image} className='w-full h-64 object-cover rounded-t-lg' alt='' />
                </div>
                <div className='p-6'>
                    <h2 className='font-bold line-clamp-2'>{data.title}</h2>
                    <p className='text-sm line-clamp-4'>{data.description}</p>

                    <p className='text-[16px] text-black/60 mt-3 mb-2'>
                        {
                            `${data?.curriculum?.length} ${data?.curriculum?.length <= 1 ? "Lecture" : "Lectures"}`
                        } :- <span className=' italic'>{`by ${data?.instructorName}`}</span>
                    </p>

                    {/* lower blocks  */}
                    <div className='flex justify-between items-center pt-5 px-2'>
                        <div className='font-bold text-lg cursor-not-allowed'>Rs. {data.pricing}</div>
                        <Button className="bg-[#1A6E0A] hover:bg-[#204718] cursor-pointer">Get Started</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
