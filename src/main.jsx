import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import HoldingTimeCur from "./pages/HoldingTimeCur";
import PDLC from "./pages/PDLC";
import ProductsConfiguration from "./pages/ProductsConfiguration";
import OrderMenuKhusus from "./pages/OrderMenuKhusus";
import Test from "./pages/Test";

createRoot(document.getElementById("app")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<HoldingTimeCur />} />
        <Route path="/holding-time" element={<HoldingTimeCur />} />
        <Route path="/pdlc" element={<PDLC />} />
        <Route path="/configuration" element={<ProductsConfiguration />} />
        <Route path="/order-menu-khusus" element={<OrderMenuKhusus />} />
        <Route path="/test" element={<Test />} />
      </Route>
      <Route path="*" element={<h1>Not Found</h1>} />
    </Routes>
  </BrowserRouter>
);
