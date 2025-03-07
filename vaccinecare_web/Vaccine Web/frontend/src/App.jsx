import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Sginup from "./pages/Sginup"
import HospitalDashboard from "./pages/admin/HospitalDashboard.jsx";
import WorkerDashboard from "./pages/hosspitals/workers.jsx";
import Certificate from "./pages/hosspitals/Certificate.jsx";
import Dashboard from "./pages/admin/Deshboard.jsx";
import HospitalDeshboard from "./pages/hosspitals/HospitalDeshboard.jsx";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hospitals" element={<HospitalDashboard />} />
        <Route path="/sginup" element={<Sginup />} />
        <Route path="/dashboard/workers" element={<WorkerDashboard/>} />
        <Route path="/dashboard/certificates" element={<Certificate/>} />
        <Route path="/dashboard/admin" element={<Dashboard/>} />
        <Route path="/dashboard/hospital" element={<HospitalDeshboard/>} />
      </Routes>
    </Router>
  );
}

export default App;
