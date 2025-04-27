import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { checkEnrolledCourse, fetchStudentViewCourseListService } from "../../services";
import PaymentModel from "./PaymentModel";

const GST_PERCENT = 0.18;

const OfferPurchase = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [selectedOffers, setSelectedOffers] = useState([]);
    const [openModel, setOpenModel] = useState(false);
    const [offersList, setOfferLetter] = useState([]);
    const [courseType, setCourseType] = useState("skill"); // "skill" or "career"

    useEffect(() => {
        const handleLogin = async () => {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            if (!storedUser && !user) {
                navigate("/auth/login");
            } else {
                await checkOffer(storedUser);
            }
        };

        handleLogin();
        // eslint-disable-next-line
    }, [user, navigate]);

    const checkOffer = async (storedUser) => {
        const userId = storedUser?.user?.id || user?.user?.id || user?.id;

        if (userId) {
            try {
                const response = await checkEnrolledCourse(userId);
                if (response?.enrolled) {
                    navigate("/courses");
                } else {
                    const response = await fetchStudentViewCourseListService();
                    setOfferLetter(response?.data);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error checking enrollment:", error);
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };

    const handleSelect = (offer) => {
        const isAlreadySelected = selectedOffers.some((item) => item._id === offer._id);
        if (!isAlreadySelected) {
            setSelectedOffers([...selectedOffers, offer]);
        }
    };

    const handleRemove = (offerId) => {
        const updated = selectedOffers.filter((item) => item._id !== offerId);
        setSelectedOffers(updated);
    };

    const calculateTotal = () => {
        let total = 0;

        if (courseType === "skill") {
            selectedOffers.forEach((_, index) => {
                const base = index === 0 ? 1499 : 749;
                total += base + base * GST_PERCENT;
            });
        } else {
            selectedOffers.forEach((_, index) => {
                const base = index < 2 ? (index === 0 ? 2199 : 0) : 1099;
                if (index === 0) {
                    total += base + base * GST_PERCENT;
                } else if (index === 1) {
                    total += 0; // Included in 2199
                } else {
                    total += base + base * GST_PERCENT;
                }
            });
        }

        return total.toFixed(2);
    };

    const isSelected = (id) => selectedOffers.some((item) => item?._id === id);

    const handlePaymentBtn = async () => {
        if (selectedOffers.length === 0) {
            alert("Please select at least one course.");
        } else {
            setOpenModel(true);
            console.log("Total Price: ₹", calculateTotal());
        }
    };

    if (loading) return null;

    return (
        <>
            <div className="h-[calc(100vh-80px)] overflow-hidden bg-gray-100 p-4">
                <div className="grid md:grid-cols-2 grid-rows-2 md:grid-rows-1 gap-4 h-full overflow-hidden">
                    {/* Left Section */}
                    <div className="bg-white rounded-2xl shadow-lg p-4 overflow-y-auto hide-scrollbar">
                        <div className="mb-4">
                            <label className="font-semibold">Choose Plan:</label>
                            <select
                                value={courseType}
                                onChange={(e) => {
                                    setSelectedOffers([]);
                                    setCourseType(e.target.value);
                                }}
                                className="ml-2 p-2 rounded border"
                            >
                                <option value="skill">Skill Builder</option>
                                <option value="career">Career Booster</option>
                            </select>
                        </div>

                        <h2 className="text-xl font-semibold mb-4">Available Courses</h2>
                        <ul className="space-y-3">
                            {offersList.map((offer) => (
                                <li
                                    key={offer._id}
                                    className={`flex justify-between items-center p-3 rounded-xl cursor-pointer transition ${
                                        isSelected(offer._id)
                                            ? "bg-green-100 border-2 border-green-400"
                                            : "bg-gray-50 hover:bg-gray-200"
                                    }`}
                                    onClick={() => handleSelect(offer)}
                                >
                                    <span>{offer.title}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right Section */}
                    <div className="bg-white rounded-2xl shadow-lg p-4 flex flex-col overflow-hidden relative">
                        <div className="overflow-y-auto pb-24 hide-scrollbar">
                            <h2 className="text-xl font-semibold mb-4">Selected Courses</h2>
                            <ul className="space-y-3">
                                {selectedOffers.length === 0 ? (
                                    <p className="text-gray-400">No Course selected</p>
                                ) : (
                                    selectedOffers.map((item) => (
                                        <li
                                            key={item._id}
                                            className="flex justify-between items-center bg-green-50 p-3 rounded-xl border border-green-300"
                                        >
                                            <span>{item.title}</span>
                                            <button
                                                onClick={() => handleRemove(item._id)}
                                                className="text-red-500 text-sm hover:underline"
                                            >
                                                Remove
                                            </button>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>

                        {/* Bottom Bar */}
                        <div className="absolute bottom-0 left-0 w-full bg-white border-t pt-3 px-4 pb-4 shadow-md">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">Total:</h3>
                                <span className="text-xl font-bold text-green-700">₹{calculateTotal()}</span>
                            </div>
                            <div className="flex gap-5">
                                <Link to={"/courses"} className="w-full">
                                    <button className="w-full mt-3 bg-red-600 hover:bg-red-800 text-white py-2 rounded-xl transition">
                                        Cancel
                                    </button>
                                </Link>
                                <button
                                    onClick={handlePaymentBtn}
                                    className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl transition"
                                >
                                    Confirm Purchase
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {openModel && <PaymentModel data={selectedOffers} courseType={courseType} price={calculateTotal()} setOpenModel={setOpenModel} />}
        </>
    );
};

export default OfferPurchase;
