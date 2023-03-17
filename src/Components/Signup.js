import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth, db } from "../Config";
import {
  setDoc,
  doc,
  getDoc,
  query,
  where,
  collection,
  getDocs,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [uni, setUni] = useState(false);
  const emailDocRef = collection(db, "Institutions");
  const navigate = useNavigate();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const permEmail = "@" + email.split("@")[1];
    const emailQuery = query(emailDocRef, where("permEmails", "==", permEmail));
    getDocs(emailQuery).then((response) => {
      if (response.empty) setErr("oops");
      else {
        response.forEach((uni) => {
          createUserWithEmailAndPassword(auth, email, password)
            .then((res) => {
              console.log(res);
              setDoc(doc(db, "users", res.user.uid), {
                email: email,
                major: "",
                name: "aaa",
                uniId: uni.id,
              }).then((res) => {
                console.log(res);
                navigate(`/home/${uni.id}`);
              });
            })
            .catch((err) => {
              setErr(err);
            });
        });
      }
    });
  };

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
    </>
  );
};

export default Signup;
