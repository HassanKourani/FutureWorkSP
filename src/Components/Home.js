import { useState } from "react";
import { SessionService } from "../SessionService";

const Home = () => {
  const [user] = useState(SessionService.getUser());

  return (
    <>
      <h1>Welcome {user.name} </h1>
    </>
  );
};

export default Home;
