import React, { useEffect, useMemo, useRef, useState } from 'react';
import WrapperWithTopNavigation from 'containers/WrapperWithTopNavigation';
import { ReactComponent as NotificationIcon } from '../../assets/svg/notification.svg';
import NotificationItem, { INotificationItem } from 'components/NotificationItem';
import { useHistory, generatePath } from 'react-router';
import { NotificationDetailRoute } from '../../navigation/routes';
import { useLoanDispatch, useLoanState } from '../../contexts/loanContext';

const Notifications = () => {
  const { notifications } = useLoanState();
  const { getNotifications } = useLoanDispatch();

  const [loading, setLoading] = useState(false);
  const { push } = useHistory();

  useEffect(() => {
    getUserNotifications();
  }, []);

  const viewNotification = (id: string) => {
    const path = generatePath(NotificationDetailRoute, {
      id,
    });
    push(path);
  };

  const getUserNotifications = async () => {
    setLoading(true);
    await getNotifications();
    setLoading(false);
  };

  return (
    <WrapperWithTopNavigation title="Notifications" loading={loading}>
      <div className="mb-5">
        <div className="d-flex py-4" style={{ borderBottom: '1px solid  #E1E6ED' }}>
          <NotificationIcon
            fill="#AAB7C6"
            style={{ width: 24, height: 24, color: '#AAB7C6' }}
          />
          <h4 className="mb-0  ms-3">
            <span className="text-primary">Recent Notifications</span>
            <small className="text-muted" style={{ fontWeight: 400 }}>
              {' '}
              {notifications && notifications.length
                ? `(${notifications.filter((not) => !not.read).length})`
                : '(0)'}
            </small>
          </h4>
        </div>
        {notifications ? (
          <div>
            {notifications.map((data) => (
              <NotificationItem
                message={data.message}
                time={data.createdAt}
                sender={data.sender ? data.sender : 'V'}
                read={data.read ? true : false}
                id={data._id}
                onClick={() => viewNotification(data._id)}
                key={data._id}
              />
            ))}
          </div>
        ) : null}
      </div>
    </WrapperWithTopNavigation>
  );
};

export default Notifications;
