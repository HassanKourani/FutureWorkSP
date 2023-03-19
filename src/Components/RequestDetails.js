import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../Config";

const RequestDetails = () => {
  const { state } = useLocation();
  const { id, docLink, uniName, message, uniId } = state;
  const navigate = useNavigate();

  const handleAccept = () => {
    updateDoc(doc(db, "Institutions", uniId), { isActive: true }).then(() => {
      navigate(`/SuperAdminHome`);
      deleteDoc(doc(db, "requests", id));
    });
  };
  const handleDecline = () => {
    deleteDoc(doc(db, "requests", id)).then(() => {
      navigate(`/SuperAdminHome`);
    });
  };

  return (
    <>
      <div>
        <h1> {uniName} </h1>
        <p> {message} </p>
        <img src={docLink} alt="img" style={{ width: 200 }} />
        <button onClick={handleAccept}>Accept</button>
        <button onClick={handleDecline}>Decline</button>
      </div>
    </>
  );
};

export default RequestDetails;
