import { Outlet, useLocation } from "react-router-dom";
import ReloadPrompt from "./ReloadPrompt";
import "./App.css";
import "./index.css";

function App() {
  const location = useLocation();

  return (
    <main className="App select-none">
      <Outlet />
      <ReloadPrompt />
    </main>
  );
}

export default App;
