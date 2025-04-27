import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-[#1A6E0A] mb-4">404</h1>
        <p className="text-xl font-semibold mb-2">Oops! Page Not Found</p>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block bg-[#1A6E0A] hover:bg-green-900 text-white font-semibold py-2 px-4 rounded-xl transition"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;