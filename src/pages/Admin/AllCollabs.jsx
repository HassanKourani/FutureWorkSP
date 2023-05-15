import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../Config";

const AllCollabs = () => {
  const [allCollabs, setAllCollabs] = useState([]);
  const [filteredCollabs, setFilteredCollabs] = useState(allCollabs);
  const [isFilter, setIsFilter] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [search, setSearch] = useState("");

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
      <div className="flex ">
        <button
          type="button"
          data-collapse-toggle="navbar-search"
          aria-controls="navbar-search"
          aria-expanded="false"
          className="md:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 mr-1"
        >
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
          <span className="sr-only">Search</span>
        </button>
        <div className="relative hidden md:block">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
            <span className="sr-only">Search icon</span>
          </div>
          <input
            type="text"
            id="search-navbar"
            value={search}
            className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          data-collapse-toggle="navbar-search"
          type="button"
          className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-search"
          aria-expanded="false"
        >
          <span className="sr-only">Open menu</span>
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <div className="flex items-center">
          <div onClick={() => setIsFilter(!isFilter)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="white"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
              />
            </svg>
          </div>
          {isFilter && (
            <select
              className="bg-transparent"
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="all">All collabs</option>
              <option value="active">Active collabs</option>
              <option value="banned">Banned collabs</option>
            </select>
          )}
        </div>
      </div>
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
