// AuthContext.js
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import authService from "../services/authService";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  const login = async (username, password) => {
    try {
      // // console.log(username);
      const data = await authService.login(username, password);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("token", data.token); // Store the token
      navigate("/holding-time"); // Redirect after login
    } catch (error) {
      console.error("Login failed:", error);

      let errorMessage = "An unexpected error occurred";
      if (
        error.response &&
        error.response.data &&
        error.response.data.messages
      ) {
        errorMessage = error.response.data.messages.error || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token"); // Remove the token
    navigate("/login"); // Redirect after logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
