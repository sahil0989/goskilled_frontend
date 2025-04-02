import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Courses() {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/auth/login");
        }
    }, [user, navigate]);

    if (!user) {
        navigate("/auth/login")
    }

    return <>
        <div
            className="flex items-center justify-center"
            style={{ height: "calc(100vh - 80.8px)" }}
        >
            <div className="font-bold text-4xl">Coming Soon</div>
        </div>
    </>;
}
