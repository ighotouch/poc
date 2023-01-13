import React, { useEffect, useMemo, useRef, useState } from 'react';
import WrapperWithTopNavigation from 'containers/WrapperWithTopNavigation';
import { ReactComponent as NotificationIcon } from '../../assets/svg/notification.svg';
import NotificationItem, { INotificationItem } from 'components/NotificationItem';
import { useHistory, generatePath, useParams } from 'react-router';
import { NotificationDetailRoute, NotificationReplyRoute } from '../../navigation/routes';
import TouchableButton from 'components/TouchableButton';
import { useLoanDispatch } from '../../contexts/loanContext';
import useToast from '../../hooks/useToast';
import { IInappNotificationData, INotificationDetails } from 'interfaces/loan';

const mockNotification: INotificationItem = {
  message: 'Hello Smith, now you can get cree credit reports Instantly',
  time: '2021-06-10T09:28:18.619Z',
  sender: 'BOLANLE',
  read: true,
  id: '2',
};

const NotificationDetails = () => {
  const { getNotificationById, getUserNotificationById } = useLoanDispatch();
  const Toast = useToast();

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<
    INotificationDetails & IInappNotificationData
  >();
  const { push } = useHistory();

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    getNotification();
  }, []);

  const getNotification = async () => {
    try {
      const resp = await getNotificationById(id);
      if (resp && resp.statusCode === 200) {
        if (!resp.data) {
          const response = await getUserNotificationById(id);
          response.data.sender = 'V Bank';
          setNotification(response.data as INotificationDetails & IInappNotificationData);
          return;
        }
        resp.data.sender = 'Admin';
        setNotification(resp.data);
      } else {
        return Toast.error('Can not load notification at the moment');
      }
    } catch (error) {
      Toast.error('An error occured while getting notifications');
    }
  };

  const handleReply = () => {
    const url = generatePath(NotificationReplyRoute, {
      id,
    });
    push(url, { notification });
  };

  return (
    <WrapperWithTopNavigation title="Notifications" loading={loading}>
      <div className="mb-5">
        <div className="d-flex py-4" style={{ borderBottom: '1px solid  #E1E6ED' }}>
          <h4 className="mb-0 text-primary">{notification?.subject}</h4>
        </div>
        <>
          {notification && (
            <div>
              <NotificationItem
                sender={notification.sender ? notification.sender : 'V'}
                message={notification.message}
                time={notification.createdAt}
                id={notification._id}
                hideBorder
                read={false}
              />
              {notification.replies && notification.replies.length ? (
                <>
                  {notification.replies.map((rep, index) => (
                    <NotificationItem
                      message={rep.message}
                      read={false}
                      time={rep.createdAt}
                      id={notification._id}
                      sender={'Your reply'}
                      files={
                        rep.attachments
                          ? rep.attachments.map((att) => ({
                              name: att.name,
                              date: rep.createdAt,
                            }))
                          : []
                      }
                    />
                  ))}
                </>
              ) : null}
            </div>
          )}
        </>
        <div className="mt-4">
          {notification?.createdBy && (
            <TouchableButton label="Reply" onPress={handleReply} />
          )}
        </div>
      </div>
    </WrapperWithTopNavigation>
  );
};

export default NotificationDetails;
