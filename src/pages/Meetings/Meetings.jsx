import { addDoc, collection, doc, onSnapshot } from "firebase/firestore";
import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../Config";
import Meeting from "./Meeting";
const Meetings = () => {
  const [meetings, setMeetings] = useState();

  const cid = useParams().uid;
  const meetingsColRef = collection(db, "collaborations", cid, "meetings");

  useEffect(() => {
    onSnapshot(meetingsColRef, (snapshot) => {
      setMeetings(
        snapshot.docs.map((meeting) => (
          <Fragment key={meeting.id}>
            <Meeting meeting={{ ...meeting.data(), id: meeting.id }} />
          </Fragment>
        ))
      );
    });
  }, []);

  return <div className="flex gap-5">{meetings}</div>;
};

export default Meetings;
