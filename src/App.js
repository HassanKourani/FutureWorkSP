import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Home from "./Components/Home";
import CompleteProfile from "./Components/CompleteProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home/:uniId" element={<Home />} />
        <Route path="/CompleteProfile" element={<CompleteProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
