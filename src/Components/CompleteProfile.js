import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { SessionService } from "../SessionService";
import { db } from "../Config";

import { useNavigate } from "react-router-dom";

const CompleteProfile = () => {
  const [majors, setMajors] = useState();
  const [selectedMajor, setSelectedMajor] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const navigate = useNavigate();

  const user = SessionService.getUser();
  console.log(user);

  const majorsColRef = collection(db, "Institutions", user.uniId, "majors");

  useEffect(() => {
    getDocs(majorsColRef).then((res) => {
      setMajors(
        res.docs.map((major) => (
          <option value={major.id} key={major.id}>
            {major.data().abv}
          </option>
        ))
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitForm = (e) => {
    e.preventDefault();

    updateDoc(doc(db, "users", user.id), {
      name: `${firstName} ${lastName}`,
      majorId: selectedMajor,
    }).then(() => {
      SessionService.setUser({
        ...user,
        name: `${firstName} ${lastName}`,
        majorId: selectedMajor,
      });
      navigate(`/home/${user.uniId}`);
    });
  };

  return (
    <>
      <form onSubmit={handleSubmitForm}>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <select onChange={(e) => setSelectedMajor(e.target.value)}>
          {majors}
        </select>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default CompleteProfile;
