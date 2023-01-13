import { forwardRef, useImperativeHandle, useRef } from "react";
import "../../../node_modules/bootstrap/js/dist/offcanvas.js";
import "./styles.scss";
export interface ISlideModal {
  children: React.ReactElement;
  onClick?: () => void;
  title: string;
}

export interface ISlideModalRef {
  toggle(): void;
}
const SlideModal: React.ForwardRefRenderFunction<
  ISlideModalRef,
  ISlideModal
> = ({ children, onClick, title }, ref) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  useImperativeHandle(ref, () => ({
    toggle: () => {
      buttonRef.current?.click();
    },
  }));
  document.body.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  return (
    <div className="slide-modal-container ">
      <button
        ref={buttonRef}
        id="bottom-menu"
        className="btn btn-primary bottom-menu"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasBottom"
        aria-controls="offcanvasBottom"
      >
        Toggle bottom offcanvas
      </button>

      <div
        className="offcanvas offcanvas-bottom"
        // @ts-ignore
        tabIndex="-1"
        style={{ height: "50vh" }}
        id="offcanvasBottom"
        aria-labelledby="offcanvasBottomLabel"
      >
        <div className="offcanvas-header d-flex justify-content-center align-items-center">
          <h4 className="offcanvas-title" id="offcanvasBottomLabel">
            {title}
          </h4>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body small container-sm">{children}</div>
      </div>
    </div>
  );
};

export default forwardRef(SlideModal);
