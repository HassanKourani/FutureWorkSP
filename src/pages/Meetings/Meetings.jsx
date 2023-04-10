import { addDoc, collection, doc, onSnapshot } from "firebase/firestore";
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../Config";
import Meeting from "./Meeting";
import { SessionService } from "../../SessionService";
import EmptyPage from "../../utils/EmptyPage";
import Loading from "../../utils/Loading";

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const cid = useParams().uid;
  const meetingsColRef = collection(db, "collaborations", cid, "meetings");

  useEffect(() => {
    setIsLoading(true);
    onSnapshot(meetingsColRef, (snapshot) => {
      setIsLoading(false);
      setMeetings(
        snapshot.docs.map((meeting) => {
          const et = new Date(meeting.data().endTime);
          const ct = new Date();
          if (et - ct > 0) {
            return (
              <div
                key={meeting.id}
                className="bg-gray-500/50 hover:bg-gray-400/50 p-2 flex  gap-4 items-center justify-between text-center "
              >
                <span>{meeting.data().name}</span>
                <div className="text-sm flex gap-2 items-center">
                  <div className="flex flex-col">
                    <span>
                      {new Date(meeting.data().startTime).toLocaleDateString()}{" "}
                    </span>
                    <span>
                      {new Date(meeting.data().startTime).toLocaleTimeString()}{" "}
                    </span>
                  </div>
                  -
                  <div className="flex flex-col">
                    <span>
                      {new Date(meeting.data().endTime).toLocaleDateString()}{" "}
                    </span>
                    <span>
                      {new Date(meeting.data().endTime).toLocaleTimeString()}{" "}
                    </span>
                  </div>
                </div>
                <a
                  href={`/main/${cid}/${meeting.id}`}
                  target="_blank"
                  className="bg-blue-400 px-4 py-2"
                >
                  Join
                </a>
              </div>
            );
          }
        })
      );
    });
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center">
          <Loading />
        </div>
      ) : meetings && meetings.length > 0 ? (
        <div className="flex flex-col gap-2 pr-4">{meetings}</div>
      ) : (
        <EmptyPage message={"No meetings yet"} />
      )}
    </>
  );
};

export default Meetings;
