import Footer from "../../partials/Footer";
import { SessionService } from "../../SessionService";
import MainHeader from "./MainHeader";
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
  const [pending, setPending] = useState(true);
  const navigate = useNavigate();
  const q = query(
    collection(db, "collaborations"),
    where("domain", "==", domain)
  );

  useEffect(() => {
    onSnapshot(q, (snapshot) => {
      setCollaborations(
        snapshot.docs.map((collab) => {
          return (
            <div key={collab.id} onClick={() => navigate(`/main/${collab.id}`)}>
              <FancyCard
                title={collab.data().title}
                description={collab.data().description}
                type={collab.data().isPrivate ? "Private" : "Public"}
              />
            </div>
          );
        })
      );
      setPending(false);
    });
  }, []);

  return (
    <>
      <div className="flex flex-col min-h-screen overflow-hidden">
        {/*  Site header */}
        <MainHeader />
        {/* <Loading /> */}
        {/*  Page content */}

        <main className="grow">
          <div className="pt-32 pb-12 md:pt-40 md:pb-20">
            {!pending ? (
              <div className="grid grid-cols-2 gap-4 mx-10 sm:gird-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {collaborations}
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
