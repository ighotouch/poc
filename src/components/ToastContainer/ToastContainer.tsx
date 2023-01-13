import { DefaultToastContainer } from "react-toast-notifications";

const ToastContainer = (props: any) => (
  <DefaultToastContainer
    className="toast-container"
    // css={{ outline: "4px dashed green" }}
    style={{ marginTop: 70 }}
    {...props}
  />
);

export default ToastContainer;
