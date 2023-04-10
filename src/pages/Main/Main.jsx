import Footer from "../../partials/Footer";
import { SessionService } from "../../SessionService";
import MainHeader from "./MainHeader";
import EmptyPage from "../../utils/EmptyPage";
import "./Main.css";
import { Fragment, useEffect, useState } from "react";
import { db } from "../../Config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import Loading from "../../utils/Loading";
import FancyCard from "../../utils/FancyCard";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const user = SessionService.getUser();
  const domain = user.email.split("@")[1];
  const [collaborations, setCollaborations] = useState();
  const [searchedCollabs, setSearchedCollabs] = useState();
  const [favCollabs, setFavCollabs] = useState();
  const [search, setSearch] = useState("");
  const [pending, setPending] = useState(true);
  const navigate = useNavigate();
  const q = query(
    collection(db, "collaborations"),
    where("domain", "==", domain)
  );
  const favCollabsColRef = collection(db, "users", user.id, "favorite");

  useEffect(() => {
    onSnapshot(q, (snapshot) => {
      setCollaborations(
        snapshot.docs.map((collab) => {
          return collab;
        })
      );
      setPending(false);
    });

    onSnapshot(favCollabsColRef, (snapshot) => {
      setFavCollabs(
        snapshot.docs.map((collab) => {
          return collab;
        })
      );
    });
  }, []);

  useEffect(() => {
    const sorterdArr = [];

    if (collaborations && favCollabs) {
      collaborations.map((collab) => {
        if (favCollabs.find((fav) => fav.id === collab.id)) {
          sorterdArr.unshift(collab);
        } else {
          sorterdArr.push(collab);
        }
      });
      setSearchedCollabs(sorterdArr);
    }
  }, [collaborations, favCollabs]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.length > 1) {
      const filteredCollabs = collaborations.filter((collab) =>
        collab.data().title.toLowerCase().includes(search.toLowerCase())
      );

      const sortedArr = [];
      filteredCollabs.map((collab) => {
        if (favCollabs.find((fav) => fav.id === collab.id)) {
          sortedArr.unshift(collab);
        } else {
          sortedArr.push(collab);
        }
      });
      setSearchedCollabs(sortedArr);
    } else {
      const sortedArr = [];
      collaborations.map((collab) => {
        if (favCollabs.find((fav) => fav.id === collab.id)) {
          sortedArr.unshift(collab);
        } else {
          sortedArr.push(collab);
        }
      });
      setSearchedCollabs(sortedArr);
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen overflow-hidden">
        {/*  Site header */}
        <MainHeader
          setSearch={setSearch}
          search={search}
          handleSearch={handleSearch}
        />
        {/* <Loading /> */}
        {/*  Page content */}

        <main className="grow flex justify-center">
          <div className="pt-32 pb-12 md:pt-40 md:pb-20 sm:w-3/4">
            {!pending ? (
              <div className="grid grid-cols-2 gap-4 mx-10 sm:gird-cols-3 md:grid-cols-3 lg:grid-cols-4">
                {searchedCollabs && searchedCollabs.length > 0 ? (
                  searchedCollabs.map((collab) => (
                    <div
                      key={collab.id}
                      onClick={() =>
                        navigate(`/main/${collab.id}`, {
                          state: {
                            collabName: collab.data().title,
                          },
                        })
                      }
                    >
                      <FancyCard collab={{ ...collab.data(), id: collab.id }} />
                    </div>
                  ))
                ) : (
                  <div className="flex justify-center col-span-full">
                    <EmptyPage message={"No collabs yet"} />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex justify-center items-center mt-20 ">
                <Loading />
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Main;
