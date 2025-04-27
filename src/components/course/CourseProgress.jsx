import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStudent } from '../../context/student-context';
import { checkParticularEnrolledCourse, getCurrentCourseProgressService, markLectureAsViewedService, resetCourseProgressService } from '../../services';
import { Button } from '../../@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../@/components/ui/dialog';
import VideoPlayer from '../../components/video-player';
import { Check, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import Confetti from 'react-confetti';

export default function CourseProgress() {
    const { user } = useAuth();
    const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } = useStudent();
    const { id } = useParams();
    const navigate = useNavigate();

    const [currentLecture, setCurrentLecture] = useState(null);
    const [showCourseCompleteDialog, setShowCourseCompleteDialog] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isSideBarOpen, setIsSideBarOpen] = useState(true);

    useEffect(() => {
        async function fetchProgress() {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) {
                navigate('/auth/login');
                return;
            }

            const userId = user?.id || user?.user?.id;
            if (!userId) return;

            const enrolled = await checkParticularEnrolledCourse({ userId, courseId: id });
            if (!enrolled?.enrolled) {
                navigate(`/course-details/${id}`);
                return;
            }

            const progressRes = await getCurrentCourseProgressService(userId, id);
            if (progressRes?.success && progressRes?.data?.isPurchased) {
                setStudentCurrentCourseProgress({
                    courseDetails: progressRes?.data?.courseDetails,
                    progress: progressRes?.data?.progress,
                });

                const { courseDetails, progress, completed } = progressRes?.data;

                if (completed) {
                    setCurrentLecture(courseDetails.curriculum[0]);
                    setShowCourseCompleteDialog(true);
                    setShowConfetti(true);
                    return;
                }

                if (progress?.length === 0) {
                    setCurrentLecture(courseDetails.curriculum[0]);
                } else {
                    const lastViewedIndex = progress.reduceRight((acc, item, index) => {
                        return acc === -1 && item.viewed ? index : acc;
                    }, -1);
                    setCurrentLecture(courseDetails.curriculum[lastViewedIndex + 1] || courseDetails.curriculum[0]);
                }
            }
        }

        fetchProgress();
    }, [user, navigate, id, setStudentCurrentCourseProgress]);

    useEffect(() => {
        if (currentLecture?.progressValue === 1) updateCourseProgress();
    }, [currentLecture]);

    const updateCourseProgress = async () => {
        if (currentLecture) {
            const userId = user?.user?.id || user?.id;
            const lectureId = currentLecture?._id;
            const courseId = id;

            const response = await markLectureAsViewedService(userId, courseId, lectureId);

            if (response?.success) {
                fetchCurrentCourseProgress();
            }
        }
    };

    const fetchCurrentCourseProgress = async () => {
        const userId = user?.user?.id || user?.id;
        if (!userId) return;

        const response = await getCurrentCourseProgressService(userId, id);
        if (response?.success) {
            if (!response?.data?.isPurchased) {
                // Lock the course if not purchased
            } else {
                setStudentCurrentCourseProgress({
                    courseDetails: response?.data?.courseDetails,
                    progress: response?.data?.progress,
                });

                const { courseDetails, progress, completed } = response?.data;

                if (completed) {
                    setCurrentLecture(courseDetails.curriculum[0]);
                    setShowCourseCompleteDialog(true);
                    setShowConfetti(true);
                    return;
                }

                if (progress?.length === 0) {
                    setCurrentLecture(courseDetails.curriculum[0]);
                } else {
                    const lastViewedIndex = progress.reduceRight((acc, item, index) => {
                        return acc === -1 && item.viewed ? index : acc;
                    }, -1);

                    setCurrentLecture(courseDetails.curriculum[lastViewedIndex + 1] || courseDetails.curriculum[0]);
                }
            }
        }
    };

    const handleRewatchCourse = async () => {
        const userId = user?.user?.id || user?.id;
        const courseId = studentCurrentCourseProgress?.courseDetails?._id;

        if (!userId || !courseId) return;

        const response = await resetCourseProgressService(userId, courseId);

        if (response?.success) {
            setShowConfetti(false);
            setShowCourseCompleteDialog(false);

            // Refetch the course progress to reset everything
            await fetchCurrentCourseProgress();

            // After refetching, set the first lecture
            setCurrentLecture(studentCurrentCourseProgress?.courseDetails?.curriculum[0]);
        }
    };

    const handleLectureClick = (lecture) => {
        setCurrentLecture(lecture);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden bg-white text-black">
            {showConfetti && <Confetti />}

            {/* Header */}
            <div className="flex items-center justify-between mr-[400px] p-4 border-b border-gray-300 bg-white shadow-md">
                <div className="flex items-center space-x-4">
                    <Button
                        onClick={() => navigate('/dashboard')}
                        className="bg-[#1A6E0A] hover:bg-[#1e4416] px-3 py-3 text-white hover:text-white"
                        variant="ghost"
                        size="md"
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Back to My Courses
                    </Button>
                    <h1 className="text-lg font-bold hidden md:block truncate max-w-xs">
                        {studentCurrentCourseProgress?.courseDetails?.title}
                    </h1>
                </div>
                <Button onClick={() => setIsSideBarOpen(!isSideBarOpen)} className="">
                    {isSideBarOpen ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                </Button>
            </div>

            {/* Body */}
            <div className="flex flex-1 overflow-hidden">
                {/* Video Area */}
                <div className={`flex-1 ${isSideBarOpen ? 'mr-[400px]' : ''} transition-all duration-300`}>
                    <VideoPlayer
                        width="100%"
                        height="500px"
                        url={currentLecture?.videoUrl}
                        onProgressUpdate={setCurrentLecture}
                        progressData={currentLecture}
                    />
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-2">{currentLecture?.title}</h2>
                    </div>
                </div>

                {/* Sidebar */}
                <div className={`absolute md:block top-[64px] right-0 bottom-0 w-[400px] bg-white border-l border-gray-300 shadow-lg transition-transform duration-300 ${isSideBarOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}>

                    <Tabs defaultValue="content" className="h-full flex flex-col">
                        <TabsList className="grid grid-cols-2 p-0 h-14 bg-gray-100 shadow-md">
                            <TabsTrigger value="content" className="rounded-none h-full text-black">
                                Course Content
                            </TabsTrigger>
                            <TabsTrigger value="overview" className="rounded-none h-full text-black">
                                Overview
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="content" className="flex-1 overflow-auto p-4 bg-gray-50">
                            {studentCurrentCourseProgress?.courseDetails?.curriculum.map((lecture) => (
                                <div
                                    key={lecture._id}
                                    onClick={() => handleLectureClick(lecture)}
                                    className="flex items-center space-x-2 text-sm font-bold text-black cursor-pointer hover:bg-gray-200 p-2 rounded"
                                >
                                    {studentCurrentCourseProgress?.progress?.find((item) => item.lectureId === lecture._id)?.viewed ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <Play className="h-4 w-4" />
                                    )}
                                    <span>{lecture.title}</span>
                                </div>
                            ))}
                        </TabsContent>

                        <TabsContent value="overview" className="flex-1 overflow-auto p-4 bg-gray-50">
                            <h2 className="text-xl font-bold mb-4">About this course</h2>
                            <p className="text-gray-600">{studentCurrentCourseProgress?.courseDetails?.description}</p>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Course Completion Dialog */}
            {showCourseCompleteDialog && (
                <Dialog open={showCourseCompleteDialog} onOpenChange={setShowCourseCompleteDialog}>
                    <DialogContent className="bg-white text-black rounded-xl shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-3xl font-bold text-center mb-2">🎉 Congratulations! 🎉</DialogTitle>
                        </DialogHeader>
                        <div className="text-center space-y-4">
                            <p className="text-lg">You have successfully completed this course!</p>
                            <div className="flex gap-4 justify-center">
                                <Button
                                    onClick={() => navigate('/dashboard')}
                                    className="bg-[#1A6E0A] text-white hover:bg-[#1e4416] font-semibold px-6 py-2 rounded-full mt-4"
                                >
                                    Go to Dashboard
                                </Button>
                                <Button
                                    onClick={() => handleRewatchCourse()}
                                    className="bg-[#1A6E0A] text-white hover:bg-[#1e4416] font-semibold px-6 py-2 rounded-full mt-4"
                                >
                                    Rewatch the Course
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
