import {
  addDoc,
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, storage } from "../../Config";
import { SessionService } from "../../SessionService";
import Discussions from "./Discussions";

const CreateQuestion = ({ setCurrentComponent }) => {
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [image, setImage] = useState("");
  const user = SessionService.getUser();
  const uid = useParams().uid;
  const [isLoading, setIsLoading] = useState(false);
  const [img, setImg] = useState("");

  const handleAddImage = (e) => {
    e.preventDefault();
    e.target.files[0] && setImage(e.target.files[0]);
    if (e.target.files && e.target.files[0]) {
      setImg(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    if (image) {
      const imageRef = ref(storage, image.name);
      uploadBytes(imageRef, image).then(() => {
        getDownloadURL(imageRef).then((url) => {
          addDoc(collection(db, "collaborations", uid, "discussions"), {
            title: title,
            question: question,
            image: url,
            userId: user.id,
            userName: user.name,
            isAnswered: false,
            createdAt: serverTimestamp(),
          })
            .then((res) => {
              setIsLoading(false);
              setCurrentComponent(
                <Discussions setCurrentComponent={setCurrentComponent} />
              );
              addDoc(collection(db, "users", user.id, "discussions"), {
                collabId: uid,
                discId: res.id,
                createdAt: serverTimestamp(),
              }).catch((err) => {
                console.log(err);
                setIsLoading(false);
              });
            })
            .catch((err) => {
              console.log(err);
              setIsLoading(false);
            });
        });
      });
    } else {
      addDoc(collection(db, "collaborations", uid, "discussions"), {
        title: title,
        question: question,
        image: "",
        userId: user.id,
        userName: user.name,
        isAnswered: false,
        createdAt: serverTimestamp(),
      })
        .then((res) => {
          setIsLoading(false);
          setCurrentComponent(
            <Discussions setCurrentComponent={setCurrentComponent} />
          );
          addDoc(collection(db, "users", user.id, "discussions"), {
            collabId: uid,
            discId: res.id,
            createdAt: serverTimestamp(),
          });

          getDocs(collection(db, "collaborations", uid, "users"))
            .then((users) =>
              users.docs.map((u) => {
                console.log(u.id);
                if (user.id != u.id) {
                  addDoc(collection(db, "users", u.id, "notifications"), {
                    message: `${user.name} added a new discussion: ${title}.`,
                    type: "discussion",
                    discussionId: res.id,
                    collabId: uid,
                    createdAt: serverTimestamp(),
                    opened: false,
                  });
                }
              })
            )

            .catch((err) => {
              console.log(err);
              setIsLoading(false);
            });
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }
  };

  return (
    <>
      <div className="pr-4">
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            placeholder="Title"
            className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-800 text-white dark:bg-gray-700 dark:border-gray-600 "
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-800 text-white dark:bg-gray-700 dark:border-gray-600">
            <div className="px-4 py-2 bg-gray-800 text-white rounded-t-lg dark:bg-gray-800">
              <textarea
                id="comment"
                rows={4}
                className="w-full px-0 text-sm bg-gray-800 text-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                placeholder="Write a question..."
                required
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
              <button
                type="submit"
                className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-purple-700 rounded-lg focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-900 hover:bg-purple-800"
              >
                {isLoading ? "Loading..." : "Post question"}
              </button>
              <div className="flex pl-0 space-x-1 sm:pl-2">
                {img && (
                  <label
                    className="flex items-center"
                    onClick={() => {
                      setImg("");
                      setImage("");
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </label>
                )}
                <label
                  htmlFor="image"
                  className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAddImage}
                  />
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="bg-gray-800/50 p-4 mr-4 cursor-pointer hover:bg-white/10">
        <div className="flex items-center justify-between">
          <div className="flex gap-4 items-center">
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={user.profile}
              alt="user photo"
            />
            <h1>{user.name}</h1>
          </div>
        </div>
        <div className="pl-8 pt-2">
          <h1 className="font-bold">{title ? title : "Title"}</h1>
          <p className="mt-1">{question ? question : "Description"}</p>
          {image ? <img src={img} /> : <></>}
        </div>
      </div>
    </>
  );
};

export default CreateQuestion;
