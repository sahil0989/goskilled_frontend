import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import Home from "./pages/Home";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Courses from "./pages/Courses";
import ContactUs from "./pages/ContactUs";
import About from "./pages/About";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div className="h-20 w-full"></div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={<Dashboard />} />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
