import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../Config";

const Requests = () => {
  const [requests, setRequests] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    onSnapshot(collection(db, "requests"), (requests) => {
      setRequests(
        requests.docs.map((request) => (
          <div
            key={request.id}
            onClick={() =>
              navigate(`/RequestDetails`, {
                state: { ...request.data(), id: request.id },
              })
            }
          >
            <h1>{request.data().uniName}</h1>
          </div>
        ))
      );
    });
  }, []);
  console.log(requests);

  return <>{requests}</>;
};

export default Requests;
