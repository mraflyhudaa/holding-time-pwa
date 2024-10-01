import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./context/ProtectedRoute";
import HoldingTimeCur from "./pages/HoldingTimeCur";
import PDLC from "./pages/PDLC";
import RMLC from "./pages/RMLC";
import ItemsConfiguration from "./pages/ItemsConfiguration";
import ProductsConfiguration from "./pages/ProductsConfiguration";
import OrderMenuKhusus from "./pages/OrderMenuKhusus";
import CalculatePDLC from "./pages/CalculatePDLC";
import CalculateRMLC from "./pages/CalculateRMLC";
import UserManagement from "./pages/UserManagement";
import LoginPage from "./pages/Login";
import MasterDisplay from "./pages/MasterDisplay";

createRoot(document.getElementById("app")).render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<App />}>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            index
            element={
              <ProtectedRoute>
                <HoldingTimeCur />
              </ProtectedRoute>
            }
          />

          <Route
            path="/holding-time"
            element={
              <ProtectedRoute>
                <HoldingTimeCur />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pdlc"
            element={
              <ProtectedRoute>
                <PDLC />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rmlc"
            element={
              <ProtectedRoute>
                <RMLC />
              </ProtectedRoute>
            }
          />
          <Route
            path="/items-configuration"
            element={
              <ProtectedRoute>
                <ItemsConfiguration />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products-configuration"
            element={
              <ProtectedRoute>
                <ProductsConfiguration />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-management"
            element={
              <ProtectedRoute>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-menu-khusus"
            element={
              <ProtectedRoute>
                <OrderMenuKhusus />
              </ProtectedRoute>
            }
          />
          <Route
            path="/master-display"
            element={
              <ProtectedRoute>
                <MasterDisplay />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calculate-pdlc"
            element={
              <ProtectedRoute>
                <CalculatePDLC />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calculate-rmlc"
            element={
              <ProtectedRoute>
                <CalculateRMLC />
              </ProtectedRoute>
            }
          />
        </Route>
        {/* <Route path="*" element={<h1>Not Found</h1>} /> */}
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);
