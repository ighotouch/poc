import React, { ReactElement } from 'react';
import { ReactComponent as RightArrowIcon } from "../../assets/svg/arrow-right.svg";
import moment from "moment"
import "./styles.scss";
import { ReactComponent as NotesIcon } from "../../assets/svg/notes.svg";
export interface INotificationItem {
  sender: string;
  message: string;
  read?: boolean;
  time: string;
  id: string;
  onClick?: () => void;
  hideBorder?: boolean;
  files?: Array<{name: string, date: string}>;
  beforeMessage?:  ReactElement;
}
const NotificationItem: React.FC<INotificationItem> = ({
  sender,
  message,
  read = false,
  time,
  onClick,
  hideBorder = false,
  children,
  files,
  beforeMessage
}) => {
  return (
    <div
      onClick={onClick}
      style={
      {
        borderBottom: hideBorder? 'unset' : `1px solid #E1E6ED`,
        transition: '0.3s',
      }}
      className="notification-item-container"
    >

      <div 
        style={{marginBottom: 8}}
        className="d-flex justify-content-between align-items-center">
        <div className="text-truncate  text-uppercase" 
          style={{fontSize: 10, color: read ? '#848F9F' : 'var(--bs-primary)'}}>{sender}</div>
        <div
          className="d-flex align-items-center"
          style={{ paddingLeft: 4 }}
        >
          <div 
            style={{ 
              fontSize: 10, 
              marginRight: 5, 
              color: read ? '#848F9F' : 'var(--bs-primary)' 
            }} 
          >
            {moment(time).fromNow()}
          </div>
          <RightArrowIcon/>
        </div>
      </div>
      {beforeMessage}
      <p style={{fontSize: 14, color: '#353F50'}}>{message}</p>
      {children}
      <div className="my-4 w-100">
        { files?.map((d, i) => {
          return (
            <div className="mb-3" style={{ position: "relative" }}>
              <div
                key={`${d.name}${i}`}
                className="w-100 d-flex flex-row align-items-center "
                style={{
                  paddingTop: 12,
                  paddingBottom: 12,
                  backgroundColor: "#F2F6F9",
                  zIndex: 2,
                  borderRadius: ".25rem",
                }}
              >
                <div style={{ flex: 1, paddingLeft: 20 }}>
                  <NotesIcon />
                </div>
                <div className="d-flex flex-column" style={{ flex: 6 }}>
                  <span>{d.name}</span>
                  <span>{moment(d.date).format("DD MMM, YYYY")}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationItem;
