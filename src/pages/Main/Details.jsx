import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SessionService } from "../../SessionService";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../Config";
import Switch from "../../utils/Switch";
import ConfirmationModal from "../../utils/ConfirmationModal";

const Details = () => {
  const uid = useParams().uid;
  const [usersId, setUsersId] = useState([]);
  const [users, setUsers] = useState();
  const [isPrivate, setIsPrivate] = useState();
  const user = SessionService.getUser();
  const [collab, setCollab] = useState();
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(false);

  useEffect(() => {
    getDoc(doc(db, "collaborations", uid)).then((res) => {
      setCollab(res.data());
      setIsPrivate(res.data().isPrivate);
    });

    onSnapshot(collection(db, "collaborations", uid, "users"), (snapshot) => {
      setUsersId(
        snapshot.docs.map((user) => {
          return user.id;
        })
      );
    });
  }, []);

  useEffect(() => {
    usersId &&
      Promise.all(
        usersId.map((id) =>
          getDoc(doc(db, "users", id)).then((user) => {
            return { ...user.data(), id: user.id };
          })
        )
      ).then((usersList) => {
        console.log(usersList);
        Promise.all(
          usersList.map((e) => {
            return getDoc(doc(db, "users", e.id)).then((res) => {
              return { ...res.data(), id: e.id };
            });
          })
        ).then((newUserList) => {
          setUsers(
            newUserList.map((element) => {
              return { ...element, id: element.id };
            })
          );
        });
      });
  }, [usersId]);

  const handleRemoveUser = (e) => {
    deleteDoc(doc(db, "collaborations", uid, "users", selectedId)).then(() => {
      setIsConfirmationModalOpen(false);
    });
  };

  return (
    <>
      {collab && (
        <div className="flex justify-between px-4">
          <h2 className="text-purple-500 text-2xl font-bold">
            {collab.description}
          </h2>
          {user.id === collab.uid ? (
            <div className=" flex gap-2 items-center ">
              <label className=" ">Public</label>
              <Switch isPrivate={isPrivate} setIsPrivate={setIsPrivate} />
              <label className="">Private</label>
            </div>
          ) : (
            <label className="py-2 px-4 border border-purple-600/50 rounded-full text-purple-500">
              {isPrivate ? "Private" : "Public"}
            </label>
          )}
        </div>
      )}

      <div>
        <label className="">Admin</label>
      </div>
      {users && (
        <ul className="pr-4">
          {users.map((element) => {
            return (
              element.id === collab.uid && (
                <Link to={`/profile/${element.id}`}>
                  <div
                    className="py-4 px-4 m-1 bg-gray-800/50 hover:bg-gray-600/50 cursor-pointer"
                    key={element.id}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          className="w-8 h-8 rounded-full object-cover"
                          src={
                            element.profile
                              ? element.profile
                              : "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                          }
                          alt="user photo"
                        />
                        <h1>{element.name}</h1>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            );
          })}
        </ul>
      )}

      <div>
        <label className="">Users</label>
      </div>
      {users && (
        <ul className="pr-4">
          {users.map((element) => {
            return (
              element.id !== collab.uid && (
                <Link to={`/profile/${element.id}`}>
                  <div
                    className="py-4 px-4 m-1 bg-gray-800/50 hover:bg-gray-600/50 cursor-pointer"
                    key={element.id}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          className="w-8 h-8 rounded-full object-cover"
                          src={
                            element.profile
                              ? element.profile
                              : "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                          }
                          alt="user photo"
                        />
                        <h1>{element.name}</h1>
                      </div>
                      {user.id === collab.uid && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 hover:text-red-500"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsConfirmationModalOpen(true);
                            setSelectedId(element.id);
                          }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </Link>
              )
            );
          })}
        </ul>
      )}
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        setIsOpen={setIsConfirmationModalOpen}
        onClick={() => handleRemoveUser()}
      />
    </>
  );
};

export default Details;
