import { Link, useNavigate } from "react-router-dom";
import EditInput from "../../utils/EditInput";
import Tabs from "../../utils/Tabs";
import { Fragment, useEffect, useState } from "react";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../Config";
import { SessionService } from "../../SessionService";
import Loading from "../../utils/Loading";
import ProfileAccordionFolder from "./ProfileAccordionFolder";
import { Accordion } from "@szhsin/react-accordion";
import Settings from "./Settings";

const Profile2 = () => {
  const [allDiscs, setAllDiscs] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState();
  const [folders, setFolders] = useState();
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newBanner, setNewBanner] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [newProfileImg, setNewProfileImg] = useState("");
  const [profileImage, setProfileImage] = useState("");

  /// change and add uid to the url
  const user = SessionService.getUser();
  const navigate = useNavigate();

  const discColRef = collection(db, "users", user.id, "discussions");
  const foldersColRef = collection(db, "users", user.id, "folders");

  const handleChangeBanner = (e) => {
    e.preventDefault();

    e.target.files[0] && setNewBanner(e.target.files[0]);
    if (e.target.files && e.target.files[0]) {
      setBannerImage(URL.createObjectURL(e.target.files[0]));
    }
  };
  const handleChangeProfilePicture = (e) => {
    e.preventDefault();

    e.target.files[0] && setNewProfileImg(e.target.files[0]);
    if (e.target.files && e.target.files[0]) {
      setProfileImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleGoToDisc = (e, collabId, discId) => {
    getDoc(doc(db, "collaborations", collabId)).then((collab) => {
      navigate(`/main/${collabId}`, {
        state: {
          collabName: collab.data().title,
          discId: discId,
        },
      });
    });
  };

  const handleTabSelect = (selected) => {
    if (selected === "discussions") setSelectedTab(allDiscs);
    else if (selected === "materials") setSelectedTab(folders);
    else if (selected === "settings") setSelectedTab("settings");
  };

  useEffect(() => {
    setIsLoading(true);
    onSnapshot(discColRef, (snapshot) => {
      Promise.all(
        snapshot.docs.map((discInfo) => {
          return getDoc(
            doc(
              db,
              "collaborations",
              discInfo.data().collabId,
              "discussions",
              discInfo.data().discId
            )
          ).then((res) => {
            return {
              ...res.data(),
              id: res.id,
              collabId: discInfo.data().collabId,
            };
          });
        })
      ).then((allValues) => {
        setAllDiscs(
          allValues.map((disc) => {
            console.log(disc);

            return (
              <div
                className="py-2 px-4 m-1 bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer"
                key={disc.id}
                onClick={(e) => handleGoToDisc(e, disc.collabId, disc.id)}
              >
                <div className="flex items-center justify-between">
                  <h1>{disc.title}</h1>

                  <h1>
                    {disc.createdAt && (
                      <div className="flex gap-1 items-center text-gray-400/75 text-xs	">
                        {new Date(disc.createdAt.seconds * 1000).getDate()} /
                        {new Date(disc.createdAt.seconds * 1000).getMonth() + 1}
                        /{new Date(disc.createdAt.seconds * 1000).getFullYear()}
                      </div>
                    )}
                  </h1>
                </div>
                <h1>{disc.question}</h1>
              </div>
            );
          })
        );
        setIsLoading(false);
      });
    });
    onSnapshot(foldersColRef, (snapshot) => {
      setFolders(
        snapshot.docs.map((folder) => {
          console.log(folder.id);
          return (
            <Fragment key={folder.id}>
              <ProfileAccordionFolder
                folder={{ ...folder.data(), id: folder.id }}
              />
            </Fragment>
          );
        })
      );
    });
  }, []);

  useEffect(() => {
    allDiscs && setSelectedTab(allDiscs);
  }, [allDiscs]);

  return (
    <>
      {/* --------------------LOGO --------------------------------*/}
      <div className=" bg-gray-900 flex flex-col h-full lg:px-36 py-8">
        <div className="absolute top-8 left-8 ">
          <Link to="/main" className="block">
            <svg
              className="w-8 h-8 fill-current text-purple-600"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M31.952 14.751a260.51 260.51 0 00-4.359-4.407C23.932 6.734 20.16 3.182 16.171 0c1.634.017 3.21.28 4.692.751 3.487 3.114 6.846 6.398 10.163 9.737.493 1.346.811 2.776.926 4.262zm-1.388 7.883c-2.496-2.597-5.051-5.12-7.737-7.471-3.706-3.246-10.693-9.81-15.736-7.418-4.552 2.158-4.717 10.543-4.96 16.238A15.926 15.926 0 010 16C0 9.799 3.528 4.421 8.686 1.766c1.82.593 3.593 1.675 5.038 2.587 6.569 4.14 12.29 9.71 17.792 15.57-.237.94-.557 1.846-.952 2.711zm-4.505 5.81a56.161 56.161 0 00-1.007-.823c-2.574-2.054-6.087-4.805-9.394-4.044-3.022.695-4.264 4.267-4.97 7.52a15.945 15.945 0 01-3.665-1.85c.366-3.242.89-6.675 2.405-9.364 2.315-4.107 6.287-3.072 9.613-1.132 3.36 1.96 6.417 4.572 9.313 7.417a16.097 16.097 0 01-2.295 2.275z" />
            </svg>
          </Link>
        </div>

        {/* -------------------- Header --------------------------------*/}
        <div className=" bg-gray-700/25 h-full rounded-lg">
          <div className="relative h-72 ">
            {/* -------------------- Banner --------------------------------*/}
            <div className="w-full h-56 bg-blue-500 rounded-lg">
              <img
                src={bannerImage}
                className=" absolute w-full h-56 bg-blue-500 rounded-lg"
              />
              {selectedTab === "settings" && (
                <input
                  type="file"
                  accept="image/*"
                  className="w-full h-56 absolute top-0  bg-transparent text-transparent file:bg-transparent file:text-transparent file:border-transparent"
                  onChange={handleChangeBanner}
                />
              )}
            </div>

            {/*-------------------- profile picture --------------------------*/}

            <img
              className="absolute  top-36 left-16 w-36 h-36 rounded-full"
              src={profileImage}
              alt="user photo"
            />
            {selectedTab === "settings" && (
              <input
                type="file"
                accept="image/*"
                className="absolute  top-36 left-16 w-36 h-36 rounded-full  bg-transparent text-transparent file:bg-transparent file:text-transparent file:border-transparent"
                onChange={handleChangeProfilePicture}
              />
            )}

            <label className="text-3xl absolute md:left-60 ">Name</label>
          </div>
          <div className="pl-16 pt-4">
            <label className="text-xl">description</label>
          </div>

          {/* main */}

          <div className="p-8">
            <Tabs selectedTab={selectedTab} handleTabSelect={handleTabSelect} />

            {selectedTab === folders ? (
              <div className="app pr-4">
                <Accordion transition transitionTimeout={1000}>
                  {folders && folders}
                </Accordion>
              </div>
            ) : selectedTab === allDiscs ? (
              <div className="app p-4">{allDiscs && allDiscs}</div>
            ) : selectedTab === "settings" ? (
              <div className="flex flex-col p-4 gap-4 items-start">
                <label>Edit Profile</label>
                <div className="flex flex-col p-4 w-1/3 gap-4 items-start visible">
                  <input
                    type="text"
                    placeholder="New Name"
                    className="bg-gray-700/50 w-full rounded-lg"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                  <textarea
                    placeholder="New Description"
                    className="bg-gray-700/50 w-full rounded-lg"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  ></textarea>
                  <button
                    className="bg-purple-600 p-2 w-full rounded-lg"
                    onClick={(e) => handleUpdateProfile(e)}
                  >
                    Update Profile
                  </button>
                </div>
                <button> Logout</button>
              </div>
            ) : (
              <></>
            )}
            {isLoading && <Loading />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile2;
