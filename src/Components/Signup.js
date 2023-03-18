import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth, db } from "../Config";
import {
  setDoc,
  doc,
  query,
  where,
  collection,
  getDocs,
} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { SessionService } from "../SessionService";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailDocRef = collection(db, "Institutions");
  const navigate = useNavigate();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const permEmail = "@" + email.split("@")[1];
    const emailQuery = query(emailDocRef, where("permEmails", "==", permEmail));
    getDocs(emailQuery).then((response) => {
      if (response.empty) console.log("oops");
      else {
        response.forEach((uni) => {
          createUserWithEmailAndPassword(auth, email, password)
            .then((res) => {
              SessionService.setUni({ ...uni.data(), id: uni.id });

              setDoc(doc(db, "users", res.user.uid), {
                email: email,
                majorId: "",
                name: "",
                uniId: uni.id,
              }).then(() => {
                SessionService.setUser({
                  id: res.user.uid,
                  email: email,
                  majorId: "",
                  name: "",
                  uniId: uni.id,
                });

                navigate(`/CompleteProfile`);
              });
            })
            .catch((err) => {
              console.log(err);
            });
        });
      }
    });
  };

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Signup</button>
      </form>
      <Link to="/">Already have an account? Login</Link>
    </>
  );
};

export default Signup;
