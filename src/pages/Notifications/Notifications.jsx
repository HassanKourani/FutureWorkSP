import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../Config";
import { useEffect, useState } from "react";
import { SessionService } from "../../SessionService";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const user = SessionService.getUser();
  const [allNotifications, setAllNotifications] = useState();
  const navigate = useNavigate();

  const handleNotificationClick = (notification) => {
    if (
      notification.type === "comment" ||
      notification.type === "answer" ||
      notification.type === "discussion"
    ) {
      getDoc(doc(db, "collaborations", notification.collabId)).then(
        (collab) => {
          navigate(`/main/${notification.collabId}`, {
            state: {
              collabName: collab.data().title,
              discId: notification.discussionId,
            },
          });
        }
      );
    } else if (notification.type === "request") {
      getDoc(doc(db, "collaborations", notification.collabId)).then(
        (collab) => {
          navigate(`/main/${notification.collabId}`, {
            state: {
              collabName: collab.data().title,
              request: true,
            },
          });
        }
      );
    } else if (notification.type === "join") {
      getDoc(doc(db, "collaborations", notification.collabId)).then(
        (collab) => {
          navigate(`/main/${notification.collabId}`, {
            state: {
              collabName: collab.data().title,
              detail: true,
            },
          });
        }
      );
    } else if (notification.type === "accepted") {
      getDoc(doc(db, "collaborations", notification.collabId)).then(
        (collab) => {
          navigate(`/main/${notification.collabId}`, {
            state: {
              collabName: collab.data().title,
            },
          });
        }
      );
    }
  };

  useEffect(() => {
    getDocs(
      query(
        collection(db, "users", user.id, "notifications"),
        orderBy("createdAt", "desc")
      )
    ).then((res) => {
      setAllNotifications(
        res.docs.map((notification) => (
          <div onClick={() => handleNotificationClick(notification.data())}>
            <span>{notification.data().message}</span>
          </div>
        ))
      );
    });
  }, []);

  return <>{allNotifications}</>;
};

export default Notifications;
