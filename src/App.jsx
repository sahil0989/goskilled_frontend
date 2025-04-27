import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Courses from "./pages/Courses";
import ContactUs from "./pages/ContactUs";
import About from "./pages/About";
import { Toaster } from "sonner";
import { StudentProvider } from "./context/student-context";
import StudentViewCourseDetailsPage from "./components/course/StudentViewCourseDetailsPage";
import { InstructorProvider } from "./context/media-context/mediaContext";
import OfferPurchase from "./components/payment/OfferPurchase";
import NotFound from "./components/NotFound";
import UserDashboard from "./components/dashboard/UserDashboard";
import CourseProgress from "./components/course/CourseProgress";

function App() {
  return (
    <AuthProvider>
      <StudentProvider>
        <InstructorProvider>
          <BrowserRouter>
            <Navbar />
            <Toaster richColors position="bottom-right" />
            <div className="h-20 w-full"></div>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/course-details/:id" element={<StudentViewCourseDetailsPage />} />
              <Route path="/course-progress/:id" element={<CourseProgress />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/auth/register" element={<RegisterPage />} />
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/student/course-order" element={<OfferPurchase />} />
              <Route path="/kyc" element={<UserDashboard />} />
              <Route path="*" element={<NotFound />} />
              <Route
                path="/dashboard"
                element={<Dashboard />}
              />
            </Routes>
          </BrowserRouter>
        </InstructorProvider>
      </StudentProvider>
    </AuthProvider>
  );
}

export default App;
