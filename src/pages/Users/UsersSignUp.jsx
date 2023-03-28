import React from "react";

import Header from "../../partials/Header";
import Banner from "../../partials/Banner";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth, db } from "../../Config";
import { setDoc, doc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { SessionService } from "../../SessionService";
import axios from "axios";

function UsersSignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const options = {
    method: "POST",
    url: "https://rapidprod-sendgrid-v1.p.rapidapi.com/mail/send",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": "6c813d40eemsh4b85bd226d7efc3p13fc54jsn57726975d5dd",
      "X-RapidAPI-Host": "rapidprod-sendgrid-v1.p.rapidapi.com",
    },
    data: `{"personalizations":[{"to":[{"email":"${email}"}],"subject":"OLAA"}],"from":{"email":"noreply@seniorproject-cd393.firebaseapp.com"},"content":[{"type":"text/plain","value":"This is a verif code YAAA!"}]}`,
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        console.log("email sent");
      })
      .catch(function (error) {
        console.error(error);
      });

    // createUserWithEmailAndPassword(auth, email, password)
    //   .then((res) => {
    //     setDoc(doc(db, "users", res.user.uid), {
    //       email: email,
    //       name: name,
    //       image: "",
    //     }).then(() => {
    //       SessionService.setUser({
    //         id: res.user.uid,
    //         email: email,
    //         name: name,
    //         image: "",
    //       });

    //       navigate(`/main`);
    //     });
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/*  Site header */}
      <Header />

      {/*  Page content */}
      <main className="grow">
        {/*  Page illustration */}

        <section className="relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="pt-32 pb-12 md:pt-40 md:pb-20">
              {/* Page header */}
              <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
                <h1 className="h1">
                  Welcome. We exist to make your studying easier.
                </h1>
              </div>

              {/* Form */}
              <div className="max-w-sm mx-auto">
                <form onSubmit={handleFormSubmit}>
                  <div className="flex flex-wrap -mx-3 mb-4">
                    <div className="w-full px-3">
                      <label
                        className="block text-gray-300 text-sm font-medium mb-1"
                        htmlFor="full-name"
                      >
                        Full Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="full-name"
                        type="text"
                        className="form-input w-full text-gray-300"
                        placeholder="First and last name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>
                  {/* <div className="flex flex-wrap -mx-3 mb-4">
                    <div className="w-full px-3">
                      <label
                        className="block text-gray-300 text-sm font-medium mb-1"
                        htmlFor="company-name"
                      >
                        Company Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="company-name"
                        type="text"
                        className="form-input w-full text-gray-300"
                        placeholder="Your company or app name"
                        required
                      />
                    </div>
                  </div> */}
                  <div className="flex flex-wrap -mx-3 mb-4">
                    <div className="w-full px-3">
                      <label
                        className="block text-gray-300 text-sm font-medium mb-1"
                        htmlFor="email"
                      >
                        Email <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="form-input w-full text-gray-300"
                        placeholder="you@edu.uni.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap -mx-3 mb-4">
                    <div className="w-full px-3">
                      <label
                        className="block text-gray-300 text-sm font-medium mb-1"
                        htmlFor="password"
                      >
                        Password <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="password"
                        type="password"
                        className="form-input w-full text-gray-300"
                        placeholder="Password (at least 6 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  {/* <div className="text-sm text-gray-500 text-center">
                    I agree to be contacted by Open PRO about this offer as per
                    the Open PRO{" "}
                    <Link
                      to="#"
                      className="underline text-gray-400 hover:text-gray-200 hover:no-underline transition duration-150 ease-in-out"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </div> */}
                  <div className="flex flex-wrap -mx-3 mt-6">
                    <div className="w-full px-3">
                      <button
                        className="btn text-white bg-purple-600 hover:bg-purple-700 w-full"
                        type="submit"
                      >
                        Sign up
                      </button>
                    </div>
                  </div>
                </form>
                <div className="text-gray-400 text-center mt-6">
                  Already have an account?{" "}
                  <Link
                    to="/signin"
                    className="text-purple-600 hover:text-gray-200 transition duration-150 ease-in-out"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Banner />
    </div>
  );
}

export default UsersSignUp;
