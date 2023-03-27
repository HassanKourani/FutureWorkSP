import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, storage } from "../../Config";
import { SessionService } from "../../SessionService";
import Loading from "../../utils/Loading";
import QuestionCard from "../../utils/QuestionCard";

const Discussion = ({ discussionId }) => {
  const [comment, setComment] = useState();
  const [image, setImage] = useState("");
  const user = SessionService.getUser();
  const uid = useParams().uid;
  const [isLoading, setIsLoading] = useState(false);
  const [img, setImg] = useState("");
  const [allComments, setAllComments] = useState();
  const [discussion, setDiscussion] = useState();

  const discussionDocRef = doc(
    db,
    "collaborations",
    uid,
    "discussions",
    discussionId
  );

  useEffect(() => {
    onSnapshot(discussionDocRef, (doc) => {
      setDiscussion({ ...doc.data(), id: doc.id });
    });
  }, []);

  const handleChooseAnswer = (e, commentId) => {
    e.preventDefault();
    console.log(commentId);
    updateDoc(doc(db, "collaborations", uid, "discussions", discussion.id), {
      isAnswered: true,
    }).then(() => console.log("updated"));
    updateDoc(
      doc(
        db,
        "collaborations",
        uid,
        "discussions",
        discussion.id,
        "comments",
        commentId
      ),
      { isAnswer: true }
    ).then(() => console.log("answer"));
  };
  const handleRemoveAnswer = (e, commentId) => {
    e.preventDefault();
    console.log(commentId);
    updateDoc(doc(db, "collaborations", uid, "discussions", discussion.id), {
      isAnswered: false,
    }).then(() => console.log("updated"));
    updateDoc(
      doc(
        db,
        "collaborations",
        uid,
        "discussions",
        discussionId,
        "comments",
        commentId
      ),
      { isAnswer: false }
    ).then(() => console.log("answer"));
  };

  const commentsColRef = collection(
    db,
    "collaborations",
    uid,
    "discussions",
    discussionId,
    "comments"
  );
  const q = query(commentsColRef, orderBy("createdAt", "desc"));

  useEffect(() => {
    setIsLoading(true);
    onSnapshot(q, (snapshot) => {
      setAllComments(
        snapshot.docs.map((comment) => {
          return (
            <div key={comment.id}>
              {discussion && (
                <div
                  className={
                    comment.data().isAnswer
                      ? "border-2 border-green-500 p-4 mr-4  "
                      : "border-b-2 border-gray-400/50 p-4 mr-4  "
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <img
                        className="w-8 h-8 rounded-full "
                        src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                        alt="user photo"
                      />
                      <h1>{comment.data().userName}</h1>
                    </div>
                    {comment.data().isAnswer && user.id == discussion.userId ? (
                      <button
                        className="bg-red-500 px-4 py-2"
                        onClick={(e) => handleRemoveAnswer(e, comment.id)}
                      >
                        Remove
                      </button>
                    ) : (
                      ""
                    )}
                    {user.id == discussion.userId && !discussion.isAnswered ? (
                      <button
                        className="bg-emerald-500 px-4 py-2"
                        onClick={(e) => handleChooseAnswer(e, comment.id)}
                      >
                        Choose
                      </button>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="pl-8 pt-2">
                    <p className="mt-1">{comment.data().comment}</p>
                    {comment.data().image ? (
                      <img src={comment.data().image} />
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })
      );
      setIsLoading(false);
    });
  }, [discussion]);

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
          addDoc(
            collection(
              db,
              "collaborations",
              uid,
              "discussions",
              discussion.id,
              "comments"
            ),
            {
              comment: comment,
              image: url,
              userId: user.id,
              userName: user.name,
              createdAt: serverTimestamp(),
            }
          )
            .then(() => {
              setIsLoading(false);
              setComment("");
              setImage("");
            })
            .catch((err) => {
              console.log(err);
              setIsLoading(false);
            });
        });
      });
    } else {
      addDoc(
        collection(
          db,
          "collaborations",
          uid,
          "discussions",
          discussion.id,
          "comments"
        ),
        {
          comment: comment,
          image: "",
          userId: user.id,
          userName: user.name,
          createdAt: serverTimestamp(),
        }
      )
        .then(() => {
          setIsLoading(false);
          setComment("");
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center">
          <Loading />{" "}
        </div>
      ) : (
        <div className="">
          <div className="h-100 sm:h-128 overflow-y-scroll">
            {discussion && <QuestionCard question={discussion} />}
            <div>{allComments}</div>
          </div>
          <form className="pr-4" onSubmit={handleFormSubmit}>
            <div className="">
              <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
                  <textarea
                    id="comment"
                    rows={1}
                    className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                    placeholder="Write a comment..."
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
                  <button
                    type="submit"
                    className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
                  >
                    {isLoading ? "Loading..." : "Post comment"}
                  </button>
                  <div className="flex pl-0 space-x-1 sm:pl-2">
                    <label
                      htmlFor="image"
                      className="inline-flex items-center justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                    >
                      {image ? "attached" : ""}
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
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Discussion;
