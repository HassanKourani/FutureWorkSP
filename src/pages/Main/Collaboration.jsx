import Sidebar from "../../partials/SideBar";
import MainHeader from "./MainHeader";

const Collaboration = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen overflow-hidden">
        {/*  Site header */}
        <MainHeader />
        {/* <Loading /> */}
        {/*  Page content */}

        <main className="grow">
          <div className="pt-32 pb-12 md:pt-40 md:pb-20">
            {/* <Sidebar /> */}
          </div>
        </main>
      </div>
    </>
  );
};

export default Collaboration;
