// ProtectedRoute.js
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Navbar from "../component/Navbar";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const getTitle = () => {
    switch (location.pathname) {
      case "/pdlc":
        return "PDLC Page";
      case "/items-configuration":
        return "Items Configuration";
      case "/products-configuration":
        return "Products Configuration";
      case "/holding-time":
        return "Holding Time";
      case "/order-menu-khusus":
        return "Order Menu Khusus";
      case "/calculate-pdlc":
        return "Calculate PDLC";
      case "/calculate-rmlc":
        return "Calculate RMLC";
      default:
        return "Holding Time";
    }
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <Navbar title={getTitle()}>{children}</Navbar>;
};

export default ProtectedRoute;
