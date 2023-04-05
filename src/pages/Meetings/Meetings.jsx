import { addDoc, collection, doc, onSnapshot } from "firebase/firestore";
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../Config";
import Meeting from "./Meeting";
import { SessionService } from "../../SessionService";
const Meetings = () => {
  const [meetings, setMeetings] = useState();
  const navigate = useNavigate();

  const cid = useParams().uid;
  const meetingsColRef = collection(db, "collaborations", cid, "meetings");

  const handleGoToMeeting = (e, meeting) => {
    e.preventDefault();
    navigate(`/meeting/${meeting.id}`, {
      state: {
        meeting: meeting,
      },
    });
  };
  useEffect(() => {
    onSnapshot(meetingsColRef, (snapshot) => {
      setMeetings(
        snapshot.docs.map((meeting) => (
          <Fragment key={meeting.id}>
            <a href={`/main/${cid}/${meeting.id}`} target="_blank">
              Go to {meeting.data().name}
            </a>
          </Fragment>
        ))
      );
    });
  }, []);

  return <div className="flex gap-5">{meetings}</div>;
};

export default Meetings;
