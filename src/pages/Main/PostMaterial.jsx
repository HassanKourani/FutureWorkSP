import { useState } from "react";

const PostMaterial = () => {
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState(null);
  console.log(title);

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    console.log(e);
  };

  return (
    <>
      <div className=" px-4 lg: px-32 md:px-12">
        <h1 className="text-purple-600 text-lg font-bold">Upload Material!</h1>

        <form className="mt-8 space-y-3">
          <div className="grid grid-cols-1 space-y-2">
            <label className="text-sm font-bold text-gray-500 tracking-wide">
              Title
            </label>
            <input
              className="text-purple-600 p-2 border border-purple-300 rounded-lg focus:outline-none focus:border-purple-500"
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          {!files && (
            <div
              className="grid grid-cols-1 space-y-2"
              onDragEnter={handleDragOver}
              onDrop={handleDrop}
            >
              <label className="text-sm font-bold text-gray-500 tracking-wide">
                Attach Documents
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-10 group text-center">
                  <div className="h-full w-full text-center flex flex-col items-center justify-center items-center  ">
                    <div className="flex flex-auto max-h-48 w-2/5 mx-auto -mt-10">
                      <svg
                        className="text-purple-600 w-24 mx-auto mt-8"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                    <p className="pointer-none text-gray-500 ">
                      <span className="text-sm">Drag and drop</span> files here{" "}
                      <br /> or{" "}
                      <span className="text-purple-600 hover:underline">
                        select a file
                      </span>{" "}
                      from your computer
                    </p>
                  </div>
                  <input type="file" className="hidden" />
                </label>
              </div>
            </div>
          )}
          <p className="text-sm text-gray-300">
            <span>File type: doc,pdf,types of images</span>
          </p>
          <div>
            <button
              type="submit"
              className="my-5 w-full flex justify-center bg-purple-500 text-gray-100 p-4  rounded-full tracking-wide
                                    font-semibold  focus:outline-none focus:shadow-outline hover:bg-purple-600 shadow-lg cursor-pointer transition ease-in duration-300"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default PostMaterial;
