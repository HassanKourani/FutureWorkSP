import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";
import { deleteDoc, doc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import Discussions from "../pages/Main/Discussions";
import { db } from "../Config";
import { SessionService } from "../SessionService";

const QuestionCard = ({ question, onClick, setCurrentComponent }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const uid = useParams().uid;
  const user = SessionService.getUser();
  //console.log(user.id, question.userId);
  const handleConfirmDeleteModal = (e) => {
    e.preventDefault();

    deleteDoc(doc(db, "collaborations", uid, "discussions", question.id)).then(
      () => {
        setCurrentComponent(
          <Discussions setCurrentComponent={setCurrentComponent} />
        );
      }
    );
  };
  return (
    <>
      <div
        className="bg-gray-800/50 p-4 mb-4 mr-4 cursor-pointer hover:bg-white/10"
        onClick={onClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex gap-4 items-center">
            <img
              className="w-8 h-8 rounded-full "
              src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              alt="user photo"
            />
            <h1>{question.userName}</h1>
          </div>
          <div className="flex gap-4">
            {question.createdAt && (
              <div className="flex gap-1 items-center text-gray-400/75 text-xs	">
                {question &&
                  new Date(question.createdAt.seconds * 1000).getDate()}
                /
                {question &&
                  new Date(question.createdAt.seconds * 1000).getMonth() + 1}
                /
                {question &&
                  new Date(question.createdAt.seconds * 1000).getFullYear()}
              </div>
            )}
            {user.id === question.userId && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleteModalOpen(true);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 hover:text-red-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
            )}
          </div>
        </div>

        <div className="pl-8 pt-2 ">
          <h1 className="font-bold">{question.title}</h1>
          <p className="mt-1">{question.question}</p>
          <div className="flex justify-between items-start ">
            {question.image ? (
              <img src={question.image} className="max-h-32 mt-2	" />
            ) : (
              <div></div>
            )}

            <div className="flex gap-1 items-center ">
              {!question.isAnswered ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <label className="text-xs">Not Answered</label>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="green"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <label className="text-xs">Answered</label>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        onClick={(e) => handleConfirmDeleteModal(e)}
      />
    </>
  );
};

export default QuestionCard;
