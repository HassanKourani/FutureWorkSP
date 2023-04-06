import { addDoc, collection, doc, onSnapshot } from "firebase/firestore";
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../Config";
import Meeting from "./Meeting";
import { SessionService } from "../../SessionService";

const Meetings = () => {
  const [meetings, setMeetings] = useState();

  const cid = useParams().uid;
  const meetingsColRef = collection(db, "collaborations", cid, "meetings");

  useEffect(() => {
    onSnapshot(meetingsColRef, (snapshot) => {
      setMeetings(
        snapshot.docs.map((meeting) => {
          const et = new Date(meeting.data().endTime);
          const ct = new Date();
          if (et - ct > 0) {
            return (
              <div
                key={meeting.id}
                className="bg-gray-500/50 hover:bg-gray-400/50 p-2 flex flex-col gap-4 items-center justify-center text-center "
              >
                <span>{meeting.data().name}</span>
                <div className="text-sm flex gap-2 items-center">
                  <div className="flex flex-col">
                    <span>From:</span>
                    <span>
                      {new Date(meeting.data().startTime).toLocaleDateString()}{" "}
                    </span>
                    <span>
                      {new Date(meeting.data().startTime).toLocaleTimeString()}{" "}
                    </span>
                  </div>
                  -
                  <div className="flex flex-col">
                    <span>To:</span>
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
    <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 pr-4">
      {meetings}
    </div>
  );
};

export default Meetings;
