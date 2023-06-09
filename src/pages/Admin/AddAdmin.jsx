import { addDoc, collection, doc } from "firebase/firestore";
import { useState } from "react";
import { db } from "../../Config";

const AddAdmin = ({ isOpen, setIsOpen }) => {
  const [email, setEmail] = useState("");

  const handleAddAdmin = (e) => {
    e.preventDefault();
    addDoc(collection(db, "pendingAdmins"), { email: email }).then(() =>
      console.log("added")
    );
    setIsOpen(false);
    setEmail("");
  };

  return (
    <>
      {isOpen && (
        <div
          id="popup-modal"
          tabIndex={-1}
          className="fixed w-full left-0 top-1/4 sm:left-1/2 sm:w-1/2 md:left-1/3 m-auto z-50  p-4 overflow-x-hidden overflow-y-auto "
        >
          <div className="relative w-full h-full max-w-md md:h-auto">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button
                type="button"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                data-modal-hide="popup-modal"
                onClick={() => setIsOpen(false)}
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
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="p-6 text-center">
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Add Admin
                </h3>
                <div>
                  <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    className="form-input border border-gray-300/50 text-gray-300 "
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="mt-8">
                    <button
                      data-modal-hide="popup-modal"
                      type="button"
                      className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      data-modal-hide="popup-modal"
                      type="button"
                      onClick={(e) => handleAddAdmin(e)}
                      className="text-white ml-4 bg-purple-600 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddAdmin;
