import React, { useEffect, useMemo, useRef, useState } from 'react';
import WrapperWithTopNavigation from 'containers/WrapperWithTopNavigation';
import { ReactComponent as NotificationIcon } from '../../assets/svg/notification.svg';
import NotificationItem, { INotificationItem } from 'components/NotificationItem';
import { useHistory, generatePath, useParams } from 'react-router';
import { NotificationDetailRoute, NotificationReplyRoute } from '../../navigation/routes';
import TouchableButton from 'components/TouchableButton';
import { useLoanDispatch } from '../../contexts/loanContext';
import useToast from '../../hooks/useToast';
import { INotificationDetails } from 'interfaces/loan';
import { PieChart } from 'react-minimal-pie-chart';

const mockNotification: INotificationItem = {
  message: 'Hello Smith, now you can get cree credit reports Instantly',
  time: '2021-06-10T09:28:18.619Z',
  sender: 'BOLANLE',
  read: true,
  id: '2',
};

const CreditReport = () => {
  const { getNotificationById } = useLoanDispatch();
  const Toast = useToast();

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<INotificationDetails>();
  const { push } = useHistory();

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    getNotification();
  }, []);

  const getNotification = async () => {
    try {
      const resp = await getNotificationById(id);
      if (resp && resp.statusCode === 200) {
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

  const pieChart = () => {
    return (
      <div className="position-relative">
        <PieChart
          data={[
            { title: 'One', value: 10, color: '#B82887' },
            { title: 'Two', value: 15, color: '#F8A2DA' },
            { title: 'Three', value: 20, color: '#D7DEE7' },
          ]}
          radius={PieChart.defaultProps.radius - 20}
          lineWidth={40}
          segmentsShift={(index) => (index === 0 ? 6 : 0.5)}
          labelPosition={0}
          labelStyle={{
            fontSize: '4px',
            fontFamily: 'sans-serif',
            fill: '#B82887',
            fontWeight: 'bold'
          }}
   
          label={({ x, y, dx, dy, dataEntry, dataIndex }) => (
            dataIndex === 0 ? <text
              x={46}
              y={46}
              dx={dx}
              dy={dy}
              dominant-baseline="central"
              text-anchor="middle"
              style={{
                fontSize: '4px',
                fontFamily: 'sans-serif',
                fill: '#B82887',
                fontWeight: 'bold'
              }}
            >
             Credit Report
            </text> : null
          )}
        />
      </div>
    )
  }

  return (
    <WrapperWithTopNavigation title="Notifications" loading={loading}>
      <div className="mb-5">
        <div className="d-flex py-4" style={{ borderBottom: '1px solid  #E1E6ED' }}>
          <h4 className="mb-0 text-primary">Credit Report</h4>
        </div>
        <div>
          <NotificationItem
            sender={'BOLANLE'}
            message={'Hello Smith, now you can get free credit reports Instantly.'}
            time={'2021-06-29T17:58:04.056Z'}
            id={'1'}
            hideBorder
            read={false}
            beforeMessage={pieChart()}
          />
          </div>
        <div className="mt-4">
          <TouchableButton label="Get Started" onPress={handleReply} />
        </div>
      </div>
    </WrapperWithTopNavigation>
  );
};

export default CreditReport;
