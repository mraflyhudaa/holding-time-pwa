import { Outlet, useLocation } from "react-router-dom";
import ReloadPrompt from "./ReloadPrompt";
import "./App.css";
import Navbar from "./component/Navbar";

function App() {
  const location = useLocation();

  // Determine the title based on the current route
  const getTitle = () => {
    switch (location.pathname) {
      case "/pdlc":
        return "PDLC Page";
      case "/configuration":
        return "Products Configuration";
      case "/holding-time":
        return "Holding Time";
      case "/order-menu-khusus":
        return "Order Menu Khusus";
      default:
        return "Holding Time";
    }
  };

  return (
    <main className="App">
      <Navbar title={getTitle()}>
        <Outlet />
      </Navbar>
      <ReloadPrompt />
    </main>
  );
}

export default App;
