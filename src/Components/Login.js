import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Config";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../Config";
import { doc, getDoc } from "firebase/firestore";
import { SessionService } from "../SessionService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in

        getDoc(doc(db, "users", userCredential.user.uid)).then((response) => {
          SessionService.setUser({
            ...response.data(),
            id: userCredential.user.uid,
          });
          response.data().name
            ? navigate(`/home/${response.data().uniId}`)
            : navigate(`/CompleteProfile`);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
      <Link to="/signup">Are you new here? Signup</Link>
    </>
  );
};

export default Login;
