import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { Suspense, lazy } from "react";
import "./index.css";
import App from "./App";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./context/ProtectedRoute";
import LoginPage from "./pages/Login";

const HoldingTimeCur = lazy(() => import("./pages/HoldingTimeCur"));
const PDLC = lazy(() => import("./pages/PDLC"));
const RMLC = lazy(() => import("./pages/RMLC"));
const ItemsConfiguration = lazy(() => import("./pages/ItemsConfiguration"));
const ProductsConfiguration = lazy(() =>
  import("./pages/ProductsConfiguration")
);
const OrderMenuKhusus = lazy(() => import("./pages/OrderMenuKhusus"));
const CalculatePDLC = lazy(() => import("./pages/CalculatePDLC"));
const CalculateRMLC = lazy(() => import("./pages/CalculateRMLC"));

createRoot(document.getElementById("app")).render(
  <BrowserRouter>
    <AuthProvider>
      <Suspense fallback={<div>Loading...</div>}>
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
              path="/order-menu-khusus"
              element={
                <ProtectedRoute>
                  <OrderMenuKhusus />
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
      </Suspense>
    </AuthProvider>
  </BrowserRouter>
);
