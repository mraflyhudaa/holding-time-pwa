import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import HoldingTimeCur from "./pages/HoldingTimeCur";
import PDLC from "./pages/PDLC";
import OrderMenuKhusus from "./pages/OrderMenuKhusus";
import RMLC from "./pages/RMLC";
import CalculatePDLC from "./pages/CalculatePDLC";
import ItemsConfiguration from "./pages/ItemsConfiguration";
import CalculateRMLC from "./pages/CalculateRMLC";
import ProductsConfiguration from "./pages/ProductsConfiguration";

createRoot(document.getElementById("app")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<HoldingTimeCur />} />
        <Route path="/holding-time" element={<HoldingTimeCur />} />
        <Route path="/pdlc" element={<PDLC />} />
        <Route path="/rmlc" element={<RMLC />} />
        <Route path="/items-configuration" element={<ItemsConfiguration />} />
        <Route
          path="/products-configuration"
          element={<ProductsConfiguration />}
        />
        <Route path="/order-menu-khusus" element={<OrderMenuKhusus />} />
        <Route path="/calculate-pdlc" element={<CalculatePDLC />} />
        <Route path="/calculate-rmlc" element={<CalculateRMLC />} />
      </Route>
      {/* <Route path="*" element={<h1>Not Found</h1>} /> */}
    </Routes>
  </BrowserRouter>
);
