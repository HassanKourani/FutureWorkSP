import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../Config";

const AllUsers = ({ selectedFilter, search }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState(allUsers);

  useEffect(() => {
    if (selectedFilter === "all") setFilteredUsers(allUsers);
    else if (selectedFilter === "active") {
      setFilteredUsers(allUsers.filter((user) => !user.isBanned));
    } else if (selectedFilter === "banned") {
      setFilteredUsers(allUsers.filter((user) => user.isBanned));
    }

    search &&
      setFilteredUsers(
        filteredUsers.filter((user) =>
          user.name.toLowerCase().includes(search.toLowerCase())
        )
      );
  }, [allUsers, selectedFilter, search]);

  const handleUserBan = (e, userId, isBanned) => {
    e.preventDefault();
    updateDoc(doc(db, "users", userId), { isBanned: !isBanned });
  };

  useEffect(() => {
    onSnapshot(collection(db, "users"), (users) => {
      setAllUsers(
        users.docs.map((user) => {
          return { ...user.data(), id: user.id };
        })
      );
    });
  }, []);
  return (
    <>
      {/* <span>Banned Users: </span> <span>{bannedUsers.length}</span> */}
      <span>All Users: </span> <span>{allUsers.length}</span>
      {filteredUsers &&
        filteredUsers.map((user) => {
          return (
            <div key={user.id}>
              <span>{user.name}</span>
              <button onClick={(e) => handleUserBan(e, user.id, user.isBanned)}>
                {user.isBanned ? "Unban" : "ban"}
              </button>
            </div>
          );
        })}
    </>
  );
};

export default AllUsers;
