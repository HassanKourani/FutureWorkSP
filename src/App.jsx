import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import "aos/dist/aos.css";
import "./css/style.css";

import AOS from "aos";

import Home from "./pages/Home";
import UsersSignIn from "./pages/Users/UsersSignIn";
import UsersSignUp from "./pages/Users/UsersSignUp";
import ResetPassword from "./pages/ResetPassword";
import InstitutionsSignIn from "./pages/Institutions/InstitutionsSignIn";
import InstitutionsSignUp from "./pages/Institutions/InstitutionsSignUp";
import Requests from "./pages/SuperAdmins/Requests";
import AddSuperAdmin from "./pages/SuperAdmins/AddSuperAdmin";
import RequestDetails from "./pages/SuperAdmins/RequestDetails";

function App() {
  const location = useLocation();

  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 600,
      easing: "ease-out-sine",
    });
  });

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/users/signin" element={<UsersSignIn />} />
        <Route path="/users/signup" element={<UsersSignUp />} />
        <Route path="/institution/signin" element={<InstitutionsSignIn />} />
        <Route path="/institution/signup" element={<InstitutionsSignUp />} />
        <Route path="/admins/:adminId/requests" element={<Requests />} />
        <Route path="/admins/:adminId/add" element={<AddSuperAdmin />} />
        <Route
          path="/admins/:adminId/requests/:requestId"
          element={<RequestDetails />}
        />
        {/* <Route path="/reset-password" element={<ResetPassword />} /> */}
      </Routes>
    </>
  );
}

export default App;
