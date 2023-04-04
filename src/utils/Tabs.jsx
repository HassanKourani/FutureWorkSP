import "./Tabs.css";

const Tabs = () => {
  return (
    <>
      <div className="radio-inputs">
        <label className="radio">
          <input type="radio" name="radio" defaultChecked="" />
          <span className="name">Discussions</span>
        </label>
        <label className="radio">
          <input type="radio" name="radio" />
          <span className="name">Material</span>
        </label>
        {/* <label className="radio">
          <input type="radio" name="radio" />
          <span className="name">Vue</span>
        </label> */}
      </div>
    </>
  );
};

export default Tabs;
