import "./Tabs.css";

const Tabs = ({ handleTabSelect }) => {
  return (
    <>
      <div className="radio-inputs m-auto">
        <label className="radio" onClick={() => handleTabSelect("discussions")}>
          <input type="radio" name="radio" defaultChecked />
          <span className="name">Discussions</span>
        </label>
        <label className="radio" onClick={() => handleTabSelect("materials")}>
          <input type="radio" name="radio" />
          <span className="name">Materials</span>
        </label>
        <label className="radio" onClick={() => handleTabSelect("settings")}>
          <input type="radio" name="radio" />
          <span className="name">Settings</span>
        </label>
      </div>
    </>
  );
};

export default Tabs;
