import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SessionService } from "../../SessionService";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../Config";

const Details = () => {
  const uid = useParams().uid;
  const [usersId, setUsersId] = useState([]);
  const [users, setUsers] = useState();
  const user = SessionService.getUser();
  const [collab, setCollab] = useState();

  useEffect(() => {
    getDoc(doc(db, "collaborations", uid)).then((res) => {
      setCollab(res.data());
    });

    getDocs(collection(db, "collaborations", uid, "users")).then((res) => {
      setUsersId(
        res.docs.map((user) => {
          return user.data().userId;
        })
      );
    });
  }, []);

  useEffect(() => {
    usersId &&
      setUsers(
        usersId.map((id) =>
          getDoc(doc(db, "users", id)).then((user) => {
            return (
              <li key={user.id}>
                <div> {user.data().name}</div>
              </li>
            );
          })
        )
      );
  }, [usersId]);
  return (
    <>
      {collab && (
        <div className="flex justify-between p-4">
          <h2>{collab.description}</h2>
          <label>{collab.isPrivate ? "Private" : "public"}</label>
        </div>
      )}
      <div>
        <label>Users</label>
      </div>
      {/* {users && <ul>{users}</ul>} */}
    </>
  );
};

export default Details;
