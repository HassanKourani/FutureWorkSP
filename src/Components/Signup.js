import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth, db } from "../Config";
import { addDoc, collection } from "firebase/firestore";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((res) => {
        addDoc(collection(db, "users"), {
          email: email,
          major: "CCE",
          name: "aaa",
          uniId: "4jzbMgT1ghsBLd3CMjiu",
        }).then((res) => {
          console.log(res);
        });
      })
      .catch((err) => {
        setErr(err);
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

      {err && <h1>you have an err</h1>}
    </>
  );
};

export default Signup;
