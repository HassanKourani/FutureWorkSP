import { collection, onSnapshot } from "firebase/firestore";
import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../Config";
import Loading from "../../utils/Loading";
import AccordionFolder from "../../utils/AccordionFolder";
import { Accordion } from "@szhsin/react-accordion";
import "../../Utils/AccordionFolder.module.css";

const Materials = () => {
  const uid = useParams().uid;
  const [folders, setFolders] = useState();
  const foldersColRef = collection(db, "collaborations", uid, "folders");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    onSnapshot(foldersColRef, (snapshot) => {
      setFolders(
        snapshot.docs.map((folder) => {
          console.log(folder.data());
          return (
            <Fragment key={folder.id}>
              <AccordionFolder folder={{ ...folder.data(), id: folder.id }} />
            </Fragment>
          );
        })
      );
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center">
          <Loading />
        </div>
      ) : (
        <div className="pr-4"></div>
      )}
      <div className="app pr-4">
        <Accordion transition transitionTimeout={100}>
          {folders}
        </Accordion>
      </div>
    </>
  );
};

export default Materials;
