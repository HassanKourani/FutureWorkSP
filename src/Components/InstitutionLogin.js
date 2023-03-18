import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth, db } from "../Config";
import { query, where, collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { SessionService } from "../SessionService";

const InstitutionLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const permEmail = "@" + email.split("@")[1];
    const emailQuery = query(
      collection(db, "Institutions"),
      where("permEmail", "==", permEmail),
      where("isActive", "==", true)
    );

    getDocs(emailQuery)
      .then((response) => {
        if (response.empty) console.log("oops");
        else {
          const adminQuery = query(
            collection(db, "Institutions", response.docs[0].id, "admins"),
            where("email", "==", email)
          );
          getDocs(adminQuery).then((res) => {
            if (res.empty) console.log("nope");
            else {
              signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                  SessionService.setUser({
                    ...res.docs[0].data(),
                    id: res.docs[0].id,
                  });
                  navigate(`/InstitutionHome/${response.docs[0].id}`);
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default InstitutionLogin;
