import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../Config";

const Requests = () => {
  const uid = useParams().uid;
  const [requests, setRequests] = useState();
  useEffect(() => {
    onSnapshot(
      collection(db, "collaborations", uid, "requests"),
      (snapshot) => {
        setRequests(
          snapshot.docs.map((request) => (
            <div key={request.id}>
              <div className="flex items-center justify-between">
                <div className="flex gap-4 items-center">
                  <img
                    className="w-8 h-8 rounded-full "
                    src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                    alt="user photo"
                  />
                  <h1>{request.data().requestedName}</h1>
                </div>
                <div className="flex items-centers gap-2 pr-4">
                  <button
                    className="p-2 bg-red-600 text-xs"
                    onClick={() => handleDelete(request.id)}
                  >
                    Decline
                  </button>
                  <button
                    className="p-2 bg-green-600 text-xs"
                    onClick={() => handleAccept(request)}
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          ))
        );
      }
    );
  }, []);

  const handleDelete = (requestId) => {
    deleteDoc(doc(db, "collaborations", uid, "requests", requestId)).then(() =>
      console.log("deleted")
    );
  };
  const handleAccept = (request) => {
    addDoc(collection(db, "collaborations", uid, "users"), {
      userId: request.data().requestedId,
      userName: request.data().requestedName,
      userImage: request.data().requestedImage,
    });
    deleteDoc(doc(db, "collaborations", uid, "requests", request.id)).then(() =>
      console.log("deleted")
    );
  };

  return <>{requests}</>;
};

export default Requests;
