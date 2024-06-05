import { Outlet } from "react-router-dom";
import ReloadPrompt from "./ReloadPrompt";
import "./App.css";
import Navbar from "./component/Navbar";

function App() {
  // replaced dyanmicaly
  // const date = "__DATE__";

  return (
    <main className="App">
      <Navbar />
      <Outlet />
      <ReloadPrompt />
    </main>
  );
}

export default App;
