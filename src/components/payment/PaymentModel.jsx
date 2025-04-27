import React from 'react'
import { RiBankLine } from "react-icons/ri";
import { Label } from '../../@/components/ui/label';
import { Input } from '../../@/components/ui/input';
import { useMedia } from '../../context/media-context/mediaContext';
import { Button } from '../../@/components/ui/button';
import MediaProgressbar from './MediaProgressbar';
import { mediaPhotoDeleteService, mediaUploadService, paymentSubmitService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function PaymentModel({ data, setOpenModel, courseType, price }) {

    const { setMediaUploadProgress, setMediaUploadProgressPercentage, setPaymentData, paymentData, mediaUploadProgress, mediaUploadProgressPercentage } = useMedia()

    const { user } = useAuth();

    const navigate = useNavigate();

    async function handleImageUploadChange(event) {
        const selectedImage = event.target.files[0];

        if (selectedImage) {
            const imageFormData = new FormData();
            imageFormData.append("file", selectedImage);

            try {
                setMediaUploadProgress(true);
                const response = await mediaUploadService(imageFormData, setMediaUploadProgressPercentage);
                console.log("Cloudinary: ", response)
                if (response.success) {
                    setPaymentData({
                        ...paymentData,
                        screenShot: response?.data?.url,
                        imagePublicId: response?.data?.public_id,
                    });
                    setMediaUploadProgress(false);
                }
            } catch (e) {
                console.log(e);
            }
        }
    }

    const fileInputRef = React.useRef(null);

    async function handleReplaceImage() {
        const currentPublicId = paymentData?.imagePublicId;

        if (currentPublicId) {
            const deleteResponse = await mediaPhotoDeleteService(currentPublicId);
            console.log("Image Delete Response:", deleteResponse);

            if (deleteResponse?.success) {
                setPaymentData({
                    ...paymentData,
                    screenShot: "",
                    imagePublicId: "",
                });

                fileInputRef.current?.click();
            }
        } else {
            fileInputRef.current?.click();
        }
    }

    const handlePaymentForm = async () => {
        const courseArray = Array.isArray(data) ? data : [data];

        const payload = {
            userId: user?.id || user?.user?.id,
            courseType,
            courseIds: courseArray.map(course => course._id),
            screenshot: paymentData?.screenShot,
            imagePublicId: paymentData?.imagePublicId,
            amountPaid: price,
        };


        const response = await paymentSubmitService(payload);
        console.log("Payment Response: ", response);

        setPaymentData({
            screenShot: '',
            imagePublicId: ''
        });

        setOpenModel(false);

        navigate("/courses")
    };

    return (
        <>
            <div className='fixed bg-black/50  min-h-screen z-10 w-screen px-10 flex justify-center items-center top-0 left-0'>
                <div className='bg-white shadow-lg w-full max-w-[650px] h-[calc(100vh-200px)] md:h-auto overflow-scroll rounded-lg md:overflow-hidden'>
                    <div className='py-2 mt-2 px-8 w-full flex justify-end'>
                        <Button onClick={() => setOpenModel(false)} className='bg-red-700 hover:bg-red-800'>X</Button>
                    </div>
                    <div className='flex flex-col md:flex-row p-8 gap-8'>
                        <div className='w-full p-8 flex flex-col     justify-center items-center bg-[#1A6E0A] rounded-lg shadow-lg'>
                            <img src='https://res.cloudinary.com/dsy6lfi4p/image/upload/v1745167381/Screenshot_2025-04-20_221046_y6ka7w.png' className='w-44 h-44 rounded-lg mb-6' alt='' />

                            <div className='text-white font-semibold'>
                                <h2 className='mb-2'>Scan Here to Pay Instantly</h2>
                                <h2>UPI ID: 7404040806@PTSBI</h2>
                            </div>
                        </div>
                        <div className='w-full p-8 flex flex-col items-center border-2 border-[#1A6E0A] rounded-lg shadow-lg text-[#1A6E0A] font-semibold justify-around'>
                            <RiBankLine size={76} color='#1A6E0A' />
                            <div>
                                <h2 className='mt-4'>Name: Ashish</h2>
                                <h2 className='mt-2'>Account No.: 309024261036</h2>
                                <h2 className='mt-2'>IFSC Code: RATN0000014</h2>
                            </div>
                        </div>
                    </div>

                    {/* upload a payment screenshot  */}

                    <h2 className='px-8 font-bold text-xl'>Total Amount: Rs.{data?.pricing || price}</h2>

                    <div className="p-4">
                        {mediaUploadProgress ? (
                            <MediaProgressbar
                                isMediaUploading={mediaUploadProgress}
                                progress={mediaUploadProgressPercentage}
                            />
                        ) : null}
                    </div>

                    {
                        !paymentData?.screenShot && <div className="flex flex-col gap-3 my-5 px-6">
                            <Label>Upload Payment ScreenShot</Label>
                            <Input
                                onChange={handleImageUploadChange}
                                type="file"
                                accept="image/*"
                            />
                        </div>
                    }
                    {
                        paymentData?.screenShot && <div className='w-full flex flex-col items-center mb-2'>
                            <h1 className='text-[#1A6E0A] font-semibold mb-2'>ScreenShot Uploaded successfully !!</h1>
                            <Button onClick={handleReplaceImage}>Replace</Button>
                        </div>
                    }

                    <div className='px-8 mb-8'>
                        <Button className='w-full' onClick={() => handlePaymentForm(data?._id)} disabled={!paymentData?.screenShot}>Submit</Button>
                    </div>

                </div>
            </div>
        </>
    )
}
