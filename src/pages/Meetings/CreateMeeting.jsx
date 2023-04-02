import { useState } from "react";
import { SessionService } from "../../SessionService";
import { addDoc, collection, doc } from "firebase/firestore";
import { db } from "../../Config";
import { useParams } from "react-router-dom";

const CreateMeeting = () => {
  const [title, setTitle] = useState("");
  const user = SessionService.getUser();
  const cid = useParams().uid;
  const handleSubmit = (e) => {
    e.preventDefault();
    addDoc(collection(db, "collaborations", cid, "meetings"), {
      name: title,
      uid: user.id,
    }).then(() => {
      console.log("meeting created");
    });
  };
  return (
    <div className="">
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          type="text"
          placeholder="Title"
          className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-800 text-white dark:bg-gray-700 dark:border-gray-600 "
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          className="bg-blue-500 px-4 py-2 hover:bg-blue-700 text-white"
          type="submit"
        >
          Create Meeting
        </button>
      </form>
    </div>
  );
};

export default CreateMeeting;
