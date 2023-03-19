import { useState } from "react";
import { auth, db } from "../Config";
import { addDoc, query, where, collection, getDocs } from "firebase/firestore";

const AddSuperAdmin = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tempPass, setTempPass] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const adminQuery = query(
      collection(db, "superAdmins"),
      where("email", "==", email)
    );
    const userQuery = query(
      collection(db, "users"),
      where("email", "==", email)
    );
    getDocs(adminQuery).then((adminRes) => {
      if (adminRes.empty) {
        getDocs(userQuery).then((userRes) => {
          if (userRes.empty) {
            addDoc(collection(db, "superAdmins"), {
              name: name,
              email: email,
              tempPass: tempPass,
            }).then(() => {
              setName("");
              setEmail("");
              setTempPass("");
            });
          } else {
            console.log("user taken?");
          }
        });
      } else {
        console.log("admin taken?");
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
          placeholder="temp pass"
          value={tempPass}
          onChange={(e) => setTempPass(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default AddSuperAdmin;
