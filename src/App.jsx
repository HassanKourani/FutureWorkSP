import React, { Profiler, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import "aos/dist/aos.css";
import "./css/style.css";

import AOS from "aos";

import Home from "./pages/Home";
import UsersSignIn from "./pages/Users/UsersSignIn";
import UsersSignUp from "./pages/Users/UsersSignUp";
import Main from "./pages/Main/Main";
import CreateCollab from "./pages/Main/CreateCollab";
import Collaboration from "./pages/Main/Collaboration";
import Profile from "./pages/Profile/Profile";

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
        <Route path="/signin" element={<UsersSignIn />} />
        <Route path="/signup" element={<UsersSignUp />} />
        <Route path="/main" element={<Main />} />
        <Route path="/createCollab" element={<CreateCollab />} />
        <Route path="/main/:uid" element={<Collaboration />} />
        <Route path="/profile" element={<Profile />} />

        {/* <Route path="/reset-password" element={<ResetPassword />} /> */}
      </Routes>
    </>
  );
}

export default App;
