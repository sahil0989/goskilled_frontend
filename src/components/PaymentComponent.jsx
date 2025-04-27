import React, { useEffect, useState } from 'react';

export default function PaymentComponent() {
    const [isRazorpayReady, setIsRazorpayReady] = useState(false);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;

        script.onload = () => {
            setIsRazorpayReady(true);
            console.log("✅ Razorpay script loaded");
        };

        script.onerror = () => {
            console.error("❌ Failed to load Razorpay script");
        };

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handlePayment = async () => {
        if (!window.Razorpay) {
            alert("Razorpay SDK not loaded. Try again in a moment.");
            return;
        }

        // Step 1: Create order from your backend
        try {
            const res = await fetch("http://localhost:5000/api/payment/create-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount: 50000,               // ₹500 in paise
                    currency: "INR",             // Required
                    receipt: `receipt_${Date.now()}` // Required
                }),
            });

            const data = await res.json();

            if (!data.id) {
                alert("❌ Could not create Razorpay order.");
                console.error("Response:", data);
                return;
            }

            // Proceed with Razorpay checkout
            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_WbETJU7Pc7FbGl",
                amount: data.amount,
                currency: data.currency,
                name: "Rashi Chhole",
                description: "Test Transaction",
                image: "https://example.com/your_logo.jpg",
                order_id: data.id,
                handler: function (response) {
                    alert("✅ Payment successful!");
                    console.log("Payment ID:", response.razorpay_payment_id);
                    console.log("Order ID:", response.razorpay_order_id);
                },
                prefill: {
                    name: "Test User",
                    email: "test@example.com",
                    contact: "9999999999",
                },
                theme: {
                    color: "#F37254",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error("Create order failed:", err);
            alert("❌ Something went wrong. Try again later.");
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">Pay with Razorpay</h1>
            <button
                onClick={handlePayment}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
                disabled={!isRazorpayReady}
            >
                {isRazorpayReady ? "Pay ₹500" : "Loading..."}
            </button>
        </div>
    );
};
