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
              return (
                <div
                  className="py-4 px-4 m-1 bg-gray-800/50 hover:bg-gray-600/50 cursor-pointer"
                  key={element.id}
                  //onClick={(e) => handleGoToDisc(e, disc.collabId, disc.id)}
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
              );
            })
          );
        });
      });
  }, [usersId]);
  return (
    <>
      {collab && (
        <div className="flex justify-between px-4">
          <h2 className="text-purple-500 text-2xl font-bold">
            {collab.description}
          </h2>
          <label className="border border-gray-400 rounded-full py-1 px-4">
            {collab.isPrivate ? "Private" : "public"}
          </label>
        </div>
      )}
      <div>
        <label className="">Users</label>
      </div>
      {users && <ul className="pr-4">{users}</ul>}
    </>
  );
};

export default Details;
