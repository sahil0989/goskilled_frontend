import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext"; // Assuming AuthContext provides authentication state

const ProtectedRoute = ({ element }) => {
  const { user } = useAuth();

  return user ? element : <Navigate to="/auth/login" replace />;
};

export default ProtectedRoute;
