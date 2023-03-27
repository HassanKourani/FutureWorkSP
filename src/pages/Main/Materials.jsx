import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../Config";
import Loading from "../../utils/Loading";

const Materials = () => {
  const uid = useParams().uid;
  const [materials, setMaterials] = useState();
  const materialsColRef = collection(db, "collaborations", uid, "materials");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    onSnapshot(materialsColRef, (snapshot) => {
      setMaterials(
        snapshot.docs.map((material) => (
          <div
            key={material.id}
            className="flex items-center justify-between pr-4"
          >
            <div className="flex gap-4 items-center">
              <h1 className="text-lg">{material.data().name}</h1>
            </div>
            <button>Download</button>
          </div>
        ))
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
        materials
      )}
    </>
  );
};

export default Materials;
