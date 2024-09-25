import { Outlet, useLocation } from "react-router-dom";
import ReloadPrompt from "./ReloadPrompt";
import "./App.css";
import Navbar from "./component/Navbar";
import { SWRConfig } from "swr";

function App() {
  const location = useLocation();

  // const config = {
  //   refreshInterval: 3000,
  //   fetcher:
  // }

  // Determine the title based on the current route
  // const getTitle = () => {
  //   switch (location.pathname) {
  //     case "/pdlc":
  //       return "PDLC Page";
  //     case "/items-configuration":
  //       return "Items Configuration";
  //     case "/products-configuration":
  //       return "Products Configuration";
  //     case "/holding-time":
  //       return "Holding Time";
  //     case "/order-menu-khusus":
  //       return "Order Menu Khusus";
  //     case "/calculate-pdlc":
  //       return "Calculate PDLC";
  //     case "/calculate-rmlc":
  //       return "Calculate RMLC";
  //     default:
  //       return "Holding Time";
  //   }
  // };

  return (
    // <SWRConfig>
    <main className="App">
      {/* <Navbar title={getTitle()}> */}
      <Outlet />
      {/* </Navbar> */}
      <ReloadPrompt />
    </main>
    // </SWRConfig>
  );
}

export default App;
