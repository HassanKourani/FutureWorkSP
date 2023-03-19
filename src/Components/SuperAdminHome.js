import { useState } from "react";
import Requests from "./Requests";
import AddSuperAdmin from "./AddSuperAdmin";

const SuperAdminHome = () => {
  const [selected, setSelected] = useState("request");

  return (
    <>
      <button
        onClick={() => {
          setSelected("request");
        }}
      >
        Request
      </button>
      <button
        onClick={() => {
          setSelected("addAdmin");
        }}
      >
        Add
      </button>
      {selected === "request" ? <Requests /> : <AddSuperAdmin />}
    </>
  );
};

export default SuperAdminHome;
