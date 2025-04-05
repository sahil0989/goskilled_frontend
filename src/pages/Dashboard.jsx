import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {

  const { user } = useAuth()
  const navigate = useNavigate()
 
  useEffect(() => {
    const handleLogin = () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        navigate("/auth/login")
      }
    }
    handleLogin()
  }, [user, navigate]);

  return (
    <div
      className="flex items-center justify-center"
      style={{ height: "calc(100vh - 80.8px)" }}
    >
      <div className="w-full max-w-[650px] bg-[#1A6E0A]/50 p-8 rounded-lg mx-5">
        <div className="flex justify-center">
          <h2 className="text-xl font-bold pb-8">Welcome!! {user?.user?.name} in the GoSkilled Family </h2>
        </div>
        <p>We are launching soon! Stay tuned for exciting updates.</p>
        <br />
        <p>Your Refral Code :- [<span className="font-bold">{user?.user?.referralCode}]</span></p>
        <p>Share with friends and earn rewards when they join!</p>
        <br />
        <p className="font-bold">Stay Excited & Stay Connected!</p>
        <br />
        <p>Have questions? Reach out to us at <span className="font-semibold">Goskilled.in@gmail.com</span></p>
      </div>
    </div>
  );
};

export default Dashboard;
