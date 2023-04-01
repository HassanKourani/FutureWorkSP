import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { db } from "../../Config";
import { SessionService } from "../../SessionService";
import ConfirmationModal from "../../utils/ConfirmationModal";
import Loading from "../../utils/Loading";
import CreateQuestion from "./CreateQuestion";
import Discussions from "./Discussions";
import Materials from "./Materials";
import Requests from "./Requests";
import PostMaterial from "./PostMaterial";

const Collaboration = () => {
  const [currentComponent, setCurrentComponent] = useState();
  const [currentComponentName, setCurrentComponentName] =
    useState("discussions");
  const uid = useParams().uid;
  const [isPrivate, setIsPrivate] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const user = SessionService.getUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const collaborationDocRef = doc(db, "collaborations", uid);
  const usersColRef = collection(db, "collaborations", uid, "users");
  const userQuery = query(usersColRef, where("userId", "==", user.id));
  const [isRequested, setIsRequested] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [requestsCount, setRequestsCount] = useState("0");
  const { state } = useLocation();
  const { collabName } = state;

  useEffect(() => {
    setCurrentComponent(
      <Discussions setCurrentComponent={setCurrentComponent} />
    );
  }, []);

  const handleSidebarClick = (component) => {
    if (component == "requests") {
      setCurrentComponent(<Requests />);
    }
    if (component == "discussions") {
      setCurrentComponent(
        <Discussions setCurrentComponent={setCurrentComponent} />
      );
    }
    if (component == "materials") {
      setCurrentComponent(<Materials />);
    }
    setCurrentComponentName(component);
  };

  const handleSidebarPost = () => {
    if (currentComponentName == "discussions") {
      setCurrentComponent(
        <CreateQuestion setCurrentComponent={setCurrentComponent} />
      );
    }
    if (currentComponentName == "materials") {
      setCurrentComponent(<PostMaterial />);
    }
  };
  useEffect(() => {
    onSnapshot(collaborationDocRef, (doc) => {
      setIsPrivate(doc.data().isPrivate);
      setIsAdmin(doc.data().uid === user.id);
    });

    onSnapshot(userQuery, (doc) => {
      console.log(doc.empty);
      setIsJoined(!doc.empty);
    });

    const requestsColRef = collection(db, "collaborations", uid, "requests");
    const q = query(requestsColRef, where("requestedId", "==", user.id));
    onSnapshot(q, (snapshot) => {
      setIsRequested(!snapshot.empty);
    });

    getCountFromServer(requestsColRef).then((res) =>
      setRequestsCount(res.data().count)
    );
  }, []);

  const handleUserState = () => {
    if (isJoined) {
      // leave
      const q = query(
        collection(db, "collaborations", uid, "users"),
        where("userId", "==", user.id)
      );
      getDocs(q).then((res) => {
        deleteDoc(doc(db, "collaborations", uid, "users", res.docs[0].id)).then(
          () => navigate("/main")
        );
      });
    } else {
      // request
      if (!isRequested) {
        addDoc(collection(db, "collaborations", uid, "requests"), {
          requestedId: user.id,
          requestedName: user.name,
          requestedImage: "",
        }).then(() => console.log("request sent"));
      }
    }
  };
  const handleColDelete = () => {
    deleteDoc(doc(db, "collaborations", uid)).then(() => navigate("/main"));
  };

  return (
    <>
      <div>
        <nav className="fixed top-0 z-50 w-full bg-gray-900 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="px-3 py-3 lg:px-5 lg:pl-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-start">
                <Link to="/main" className="flex ml-2 md:mr-24">
                  <svg
                    className="w-8 h-8 fill-current text-purple-600"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M31.952 14.751a260.51 260.51 0 00-4.359-4.407C23.932 6.734 20.16 3.182 16.171 0c1.634.017 3.21.28 4.692.751 3.487 3.114 6.846 6.398 10.163 9.737.493 1.346.811 2.776.926 4.262zm-1.388 7.883c-2.496-2.597-5.051-5.12-7.737-7.471-3.706-3.246-10.693-9.81-15.736-7.418-4.552 2.158-4.717 10.543-4.96 16.238A15.926 15.926 0 010 16C0 9.799 3.528 4.421 8.686 1.766c1.82.593 3.593 1.675 5.038 2.587 6.569 4.14 12.29 9.71 17.792 15.57-.237.94-.557 1.846-.952 2.711zm-4.505 5.81a56.161 56.161 0 00-1.007-.823c-2.574-2.054-6.087-4.805-9.394-4.044-3.022.695-4.264 4.267-4.97 7.52a15.945 15.945 0 01-3.665-1.85c.366-3.242.89-6.675 2.405-9.364 2.315-4.107 6.287-3.072 9.613-1.132 3.36 1.96 6.417 4.572 9.313 7.417a16.097 16.097 0 01-2.295 2.275z" />
                  </svg>
                  <span className="ml-4 self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                    {collabName}
                  </span>
                </Link>
              </div>
              <div className="flex items-center">
                <div className="flex items-center ml-3">
                  <div>
                    <button
                      type="button"
                      className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                      aria-expanded="false"
                      data-dropdown-toggle="dropdown-user"
                    >
                      <img
                        className="w-8 h-8 rounded-full"
                        src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                        alt="user photo"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="fixed z-50 w-full h-16 max-w-lg -translate-x-1/2 bg-gray-900 border border-gray-200 rounded-full bottom-4 left-1/2 dark:bg-gray-700 dark:border-gray-600 sm:hidden">
          <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
            <button
              data-tooltip-target="tooltip-home"
              type="button"
              className="inline-flex flex-col items-center justify-center px-5 rounded-l-full hover:bg-gray-50 dark:hover:bg-gray-800 group"
            >
              <svg
                className="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className="sr-only">Home</span>
            </button>
            <div
              id="tooltip-home"
              role="tooltip"
              className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
            >
              Home
              <div className="tooltip-arrow" data-popper-arrow />
            </div>
            <button
              data-tooltip-target="tooltip-wallet"
              type="button"
              className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
            >
              <svg
                className="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                />
              </svg>
              <span className="sr-only">Wallet</span>
            </button>
            <div
              id="tooltip-wallet"
              role="tooltip"
              className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
            >
              Wallet
              <div className="tooltip-arrow" data-popper-arrow />
            </div>
            <div className="flex items-center justify-center">
              <button
                data-tooltip-target="tooltip-new"
                type="button"
                className="inline-flex items-center justify-center w-10 h-10 font-medium bg-blue-600 rounded-full hover:bg-blue-700 group focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  />
                </svg>
                <span className="sr-only">New item</span>
              </button>
            </div>
            <div
              id="tooltip-new"
              role="tooltip"
              className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
            >
              Create new item
              <div className="tooltip-arrow" data-popper-arrow />
            </div>
            <button
              data-tooltip-target="tooltip-settings"
              type="button"
              className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
            >
              <svg
                className="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
              </svg>
              <span className="sr-only">Settings</span>
            </button>
            <div
              id="tooltip-settings"
              role="tooltip"
              className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
            >
              Settings
              <div className="tooltip-arrow" data-popper-arrow />
            </div>
            <button
              data-tooltip-target="tooltip-profile"
              type="button"
              className="inline-flex flex-col items-center justify-center px-5 rounded-r-full hover:bg-gray-50 dark:hover:bg-gray-800 group"
            >
              <svg
                className="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                />
              </svg>
              <span className="sr-only">Profile</span>
            </button>
            <div
              id="tooltip-profile"
              role="tooltip"
              className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
            >
              Profile
              <div className="tooltip-arrow" data-popper-arrow />
            </div>
          </div>
        </div>

        <aside
          id="logo-sidebar"
          className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-gray-900 border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
          aria-label="Sidebar"
        >
          <div className="h-full px-3 pb-4 overflow-y-auto bg-gray-900 dark:bg-gray-800">
            <ul className="space-y-2 font-medium">
              <li>
                <div
                  className="flex items-center p-2 text-gray-500 rounded-lg dark:text-white hover:bg-gray-100/10 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleSidebarClick("discussions")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-gray-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <span className="ml-3">Discussions</span>
                </div>
              </li>
              <li>
                <div
                  className="flex items-center p-2 text-gray-500 rounded-lg dark:text-white hover:bg-gray-100/10 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleSidebarClick("materials")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-gray-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z"
                      clipRule="evenodd"
                    />
                    <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                  </svg>

                  <span className="flex-1 ml-3 whitespace-nowrap ">
                    Material
                  </span>
                </div>
              </li>
              <li>
                <div
                  href="#"
                  className="flex items-center p-2 text-gray-500 rounded-lg dark:text-white hover:bg-gray-100/10 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-gray-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 5.25a3 3 0 013-3h13.5a3 3 0 013 3V15a3 3 0 01-3 3h-3v.257c0 .597.237 1.17.659 1.591l.621.622a.75.75 0 01-.53 1.28h-9a.75.75 0 01-.53-1.28l.621-.622a2.25 2.25 0 00.659-1.59V18h-3a3 3 0 01-3-3V5.25zm1.5 0v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <span className="flex-1 ml-3 whitespace-nowrap">
                    Meetings
                  </span>
                </div>
              </li>
              <li>
                <div
                  href="#"
                  className="flex items-center p-2 text-gray-500 rounded-lg dark:text-white hover:bg-gray-100/10 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-gray-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z"
                      clipRule="evenodd"
                    />
                    <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
                  </svg>

                  <span className="flex-1 ml-3 whitespace-nowrap">Details</span>
                </div>
              </li>

              {isAdmin && (
                <li>
                  <div
                    className="flex items-center p-2 text-gray-500 rounded-lg dark:text-white hover:bg-gray-100/10 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleSidebarClick("requests")}
                  >
                    <svg
                      aria-hidden="true"
                      className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z" />
                      <path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
                    </svg>
                    <span className="flex-1 ml-3 whitespace-nowrap">
                      Requests
                    </span>
                    <span className="inline-flex items-center justify-center w-3 h-3 p-3 ml-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                      {requestsCount}
                    </span>
                  </div>
                </li>
              )}

              {/* ---------------------------button--------------------------- */}
              {(isJoined || !isPrivate) &&
                (currentComponentName == "discussions" ||
                  currentComponentName == "materials") && (
                  <li>
                    <div
                      className="flex items-center p-2 text-gray-500 rounded-lg dark:text-white hover:bg-gray-100/10 dark:hover:bg-gray-700"
                      onClick={() => handleSidebarPost()}
                    >
                      <span className="flex-1  whitespace-nowrap">
                        <button
                          type="submit"
                          className="text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          Post
                        </button>
                      </span>
                    </div>
                  </li>
                )}
              {/* ---------------------------button--------------------------- */}

              {isPrivate && !isAdmin && (
                <li>
                  <div
                    className="flex items-center p-2 text-gray-500 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleUserState()}
                  >
                    <span className="flex-1  whitespace-nowrap">
                      <button
                        type="submit"
                        className={
                          isRequested
                            ? "text-white w-full bg-gray-500   font-medium rounded-lg text-sm px-4 py-2  "
                            : "text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        }
                      >
                        {isJoined
                          ? "Leave"
                          : isRequested
                          ? "Requested"
                          : "Request"}
                      </button>
                    </span>
                  </div>
                </li>
              )}
              {isAdmin && (
                <li>
                  <div
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100/10 dark:hover:bg-gray-700"
                    onClick={() => setIsDeleteModalOpen(true)}
                  >
                    <span className="flex-1  whitespace-nowrap">
                      <button
                        type="submit"
                        className="text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        Delete
                      </button>
                    </span>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </aside>

        <div className="pt-20 pl-4 sm:ml-64 ">
          {isJoined || !isPrivate
            ? currentComponent
            : "You must request to join"}
        </div>
      </div>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        onClick={() => handleColDelete()}
      />
    </>
  );
};

export default Collaboration;
