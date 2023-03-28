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
            className="flex items-center justify-between pr-4 border-b border-gray-300/50 p-4 hover:bg-gray-400/10"
          >
            <div className="flex items-center gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 text-red-600"
              >
                <path
                  fillRule="evenodd"
                  d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z"
                  clipRule="evenodd"
                />
                <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
              </svg>

              <div className="flex gap-4 items-center">
                <h1 className="text-lg">{material.data().name}</h1>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="border border-gray-400 py-1 px-2 rounded-full hover:bg-gray-400/20">
                View
              </button>
              <button className="border border-gray-400 py-1 px-2 rounded-full hover:bg-gray-400/20">
                Download
              </button>
            </div>
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
        <div className="pr-4">{materials}</div>
      )}
    </>
  );
};

export default Materials;
