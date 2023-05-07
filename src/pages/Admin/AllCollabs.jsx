import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../Config";

const AllCollabs = ({ selectedFilter, search }) => {
  const [allCollabs, setAllCollabs] = useState([]);
  const [filteredCollabs, setFilteredCollabs] = useState(allCollabs);

  useEffect(() => {
    if (selectedFilter === "all") setFilteredCollabs(allCollabs);
    else if (selectedFilter === "active") {
      setFilteredCollabs(allCollabs.filter((collab) => !collab.isBanned));
    } else if (selectedFilter === "banned") {
      setFilteredCollabs(allCollabs.filter((collab) => collab.isBanned));
    }

    search &&
      setFilteredCollabs(
        filteredCollabs.filter((collab) =>
          collab.title.toLowerCase().includes(search.toLowerCase())
        )
      );
  }, [allCollabs, selectedFilter, search]);

  const handleCollabBan = (e, collabId, isBanned) => {
    e.preventDefault();
    updateDoc(doc(db, "collaborations", collabId), { isBanned: !isBanned });
  };

  useEffect(() => {
    onSnapshot(collection(db, "collaborations"), (Collabs) => {
      setAllCollabs(
        Collabs.docs.map((collab) => {
          return { ...collab.data(), id: collab.id };
        })
      );
    });
  }, []);
  return (
    <>
      <span>All Collabs: </span> <span>{allCollabs.length}</span>
      <span>Active Collabs: </span>{" "}
      <span>{allCollabs.filter((collab) => !collab.isBanned).length}</span>
      <span>Banned Collabs: </span>{" "}
      <span>{allCollabs.filter((collab) => collab.isBanned).length}</span>
      {filteredCollabs &&
        filteredCollabs.map((collab) => {
          return (
            <div key={collab.id}>
              <span>{collab.title}</span>
              <button
                onClick={(e) => handleCollabBan(e, collab.id, collab.isBanned)}
              >
                {collab.isBanned ? "Unban" : "ban"}
              </button>
            </div>
          );
        })}
    </>
  );
};

export default AllCollabs;
