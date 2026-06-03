import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Table from "./pages/Table";
import Dashboard from "./pages/Dashboard";
import Theme from "./components/Theme";

function App() {
  return (
    <BrowserRouter>
      <Theme />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/table" element={<Table />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
