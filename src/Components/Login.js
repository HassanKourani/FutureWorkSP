import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Config";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../Config";
import {
  setDoc,
  doc,
  getDoc,
  query,
  where,
  collection,
  getDocs,
} from "firebase/firestore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        getDoc(doc(db, "users", userCredential.user.uid)).then((response) => {
          console.log(response.data().uniId);
          navigate(`./home/${response.data().uniId}`);
        });
        console.log(user);
        // ...
      })
      .catch((error) => {
        console.log(error);
        // ..
      });
  };
  //   console.log(email);
  //   console.log(password);

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default Login;
