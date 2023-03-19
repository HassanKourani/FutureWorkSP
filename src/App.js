import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Home from "./Components/Home";
import CompleteProfile from "./Components/CompleteProfile";
import InstitutionHome from "./Components/InstitutionHome";
import InstitutionSignup from "./Components/InstitutionSignup";
import SuperAdminHome from "./Components/SuperAdminHome";
import RequestDetails from "./Components/RequestDetails";
import NavigationBar from "./Components/Navbar";

function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home/:uniId" element={<Home />} />
        <Route path="/CompleteProfile" element={<CompleteProfile />} />
        <Route path="/InstitutionHome/:uniId" element={<InstitutionHome />} />
        <Route path="/InstitutionSignup" element={<InstitutionSignup />} />
        <Route path="/SuperAdminHome" element={<SuperAdminHome />} />
        <Route path="/RequestDetails" element={<RequestDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
