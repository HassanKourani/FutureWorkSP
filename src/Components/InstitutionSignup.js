import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth, db, storage } from "../Config";
import {
  query,
  where,
  collection,
  getDocs,
  addDoc,
  setDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const InstitutionSignup = () => {
  const [email, setEmail] = useState("");
  const [adminName, setAdminName] = useState("");
  const [password, setPassword] = useState("");
  const [uniName, setUniName] = useState("");
  const [permEmail, setPermEmail] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const queryInstitutions = query(
      collection(db, "Institutions"),
      where("permEmail", "==", permEmail)
    );
    getDocs(queryInstitutions).then((res) => {
      if (res.empty) {
        addDoc(collection(db, "Institutions"), {
          name: uniName,
          permEmail: permEmail,
          isActive: false,
        }).then((Institution) => {
          createUserWithEmailAndPassword(auth, email, password).then(
            (response) => {
              setDoc(
                doc(
                  db,
                  "Institutions",
                  Institution.id,
                  "admins",
                  response.user.uid
                ),
                {
                  email: email,
                  name: adminName,
                }
              );
              if (file) {
                const fileRef = ref(storage, file.name);
                uploadBytes(fileRef, file).then(() => {
                  getDownloadURL(fileRef).then((url) => {
                    //setFileLink(url);

                    addDoc(collection(db, "requests"), {
                      docLink: url,
                      message: message,
                      uniId: Institution.id,
                    });
                  });
                });
              }
            }
          );
        });
      } else {
        console.log("Institution already available");
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
        <br />
        <input
          type="text"
          placeholder="adminName"
          value={adminName}
          onChange={(e) => setAdminName(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="uniName"
          value={uniName}
          onChange={(e) => setUniName(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="permEmail"
          value={permEmail}
          onChange={(e) => setPermEmail(e.target.value)}
        />
        <br />
        <textarea
          placeholder="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <br />
        <input
          type="file"
          onChange={(e) => {
            if (e.target.files[0]) setFile(e.target.files[0]);
          }}
        />
        <br />
        <button>Button</button>
      </form>
    </>
  );
};

export default InstitutionSignup;
