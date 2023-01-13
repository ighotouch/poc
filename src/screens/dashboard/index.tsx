import React, { useEffect, useMemo, useRef, useState } from 'react';
import SlideModal, { ISlideModalRef } from 'components/SlideModal';
import { useHistory } from 'react-router';
import { LoanHistoryRoute, LoanInfoRoute, NotificationsRoute } from 'navigation/routes';
import { ReactComponent as CancelIcon } from '../../assets/svg/close.svg';
import { ReactComponent as NotificationIcon } from '../../assets/svg/notification.svg';
import { ReactComponent as TaskIcon } from '../../assets/svg/task.svg';
import { ReactComponent as ArrorRightIcon } from '../../assets/svg/arrow-right.svg';
import { ReactComponent as CountDownIcon } from '../../assets/svg/count-down.svg';
import { ReactComponent as CreditIcon } from '../../assets/svg/credit.svg';
import CardItem from 'components/CardItem';
import { useLoanDispatch, useLoanState } from 'contexts/loanContext';
import { clearLoanApplication } from 'common/localStorage';
import { useAuthState } from 'contexts/authContext';
import './styles.scss';

export interface IDashboard {}
const Dashboard: React.FC<IDashboard> = () => {
  const { setLoanInfo, getNotifications } = useLoanDispatch();
  const { notifications } = useLoanState();
  const slideModalRef = useRef<ISlideModalRef>(null);
  const timerRef = useRef<any>();
  const route = useHistory();
  const { profile } = useAuthState();

  useEffect(() => {
    clearLoanApplication();
    return clearTimeout(timerRef.current);
  }, []);
  useEffect(() => {
    if (!notifications) {
      getUserNotification();
    }
  }, [notifications]);

  const getUserNotification = async () => {
    await getNotifications();
  };
  const dashboardMenu = useMemo(() => {
    return [
      {
        title: 'Apply for Loan',
        desc: 'View avialable loans and apply',
        leftIcon: <TaskIcon />,
        rightIcon: <ArrorRightIcon />,
        onClick: () => {
          slideModalRef.current?.toggle();
        },
      },
      {
        title: 'My Loan History',
        desc: 'View disbursed loans and status',
        leftIcon: <CountDownIcon />,
        rightIcon: <ArrorRightIcon />,
        onClick: () => {
          route.push(LoanHistoryRoute);
        },
      },
      {
        title: 'Check my Credit Score',
        desc: 'View your credit scoring report',
        leftIcon: <CreditIcon />,
        rightIcon: <ArrorRightIcon />,
        disabled: true,
      },
      {
        title: 'Get Insurance Report',
        desc: 'View your credit scoring report',
        leftIcon: <CreditIcon />,
        rightIcon: <ArrorRightIcon />,
        disabled: true,
      },
    ];
  }, []);

  const getStartedMenu = useMemo(() => {
    return [
      {
        title: 'I am employed',
        slug: 'EMPLOYED',
        desc: 'I am a salary earner - I work with an organization that pays my salary',
        rightIcon: <ArrorRightIcon />,
        onClick: () => {
          slideModalRef.current?.toggle();
          setLoanInfo({ employmentStatus: 'EMPLOYEE' });
          timerRef.current = setTimeout(() => {
            route.push(LoanInfoRoute);
          }, 250);
        },
      },
      {
        title: 'I am a business owner',
        slug: 'BUSINESS_OWNER',
        desc: 'I run my own business',
        rightIcon: <ArrorRightIcon />,
        onClick: () => {
          slideModalRef.current?.toggle();
          setLoanInfo({ employmentStatus: 'BUSINESS_OWNER' });
          timerRef.current = setTimeout(() => {
            route.push(LoanInfoRoute);
          }, 250);
        },
      },
    ];
  }, [route]);

  return (
    <div className="dashboard">
      <div className="header  d-flex flex-row justify-content-between py-3">
        <div
          onClick={() => {
            window.postMessage('loan.event.close');
            try {
              // @ts-ignore
              window.ReactNativeWebView.postMessage('loan.event.close');
            } catch (error) {}
          }}
        >
          <CancelIcon />
        </div>
        <div onClick={() => route.push(NotificationsRoute)}>
          <div className="notification-container">
            <NotificationIcon />
            <span>
              {notifications &&
              notifications.length &&
              notifications.filter((not) => !not.read).length
                ? `${notifications.filter((not) => !not.read).length}`
                : ''}
            </span>
          </div>
        </div>
      </div>

      <h1 className="mb-4">V Loans</h1>

      {dashboardMenu.map((m) => (
        <div className="mb-4">
          <CardItem key={m.title} {...m} />
        </div>
      ))}

      <SlideModal ref={slideModalRef} title="Lets get you started">
        <div>
          {getStartedMenu.map((m) => (
            <div className="mb-4">
              <CardItem key={m.title} {...m} />
            </div>
          ))}
        </div>
      </SlideModal>
    </div>
  );
};

export default Dashboard;
