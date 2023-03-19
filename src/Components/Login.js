import { useState } from "react";
import InstitutionLogin from "./InstitutionLogin";
import UserLogin from "./UserLogin";

const Login = () => {
  const [clicked, setClicked] = useState("user");
  return (
    <>
      <button onClick={() => setClicked("user")}>User</button>
      <button onClick={() => setClicked("inst")}>Inst</button>
      {clicked === "user" ? <UserLogin /> : <InstitutionLogin />}
    </>
  );
};

export default Login;
