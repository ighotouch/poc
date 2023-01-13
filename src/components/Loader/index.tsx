const Loader = () => {
  return (
    <div
      className="position-fixed d-flex  top-0  align-items-center justify-content-center"
      style={{
        width: "100%",
        position: "fixed",
        padding: 0,
        margin: 0,

        top: 0,
        left: 0,

        height: "100%",
        background: "rgba(255,255,255,0.5)",
      }}
    >
      <div className=" d-flex text-center flex-column align-items-center justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <strong>Loading...</strong>
      </div>
    </div>
  );
};

export default Loader;
