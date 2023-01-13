import Loader from 'components/Loading';
import { useHistory } from 'react-router';
import { ReactComponent as BackArrowIcon } from '../assets/svg/arrow-back.svg';

export interface IWrapperWithTopNavigation {
  children: React.ReactNode;
  title?: string;
  onRightClick?: () => void;
  rightButton?: string;
  loading?: boolean;
  containerStyle?: React.CSSProperties;
  className?: string;
  hideBackButton?;
}

const WrapperWithTopNavigation: React.FC<IWrapperWithTopNavigation> = ({
  children,
  title,
  loading,
  containerStyle = {},
  rightButton,
  onRightClick,
  className,
  hideBackButton,
}) => {
  const route = useHistory();
  return (
    <div className={`justify-content-center align-items-center ${className}`}>
      <nav
        className="navbar fixed-top navbar-light bg-white"
        style={{ borderBottom: '1px solid #E1E6ED' }}
      >
        <div className="container-sm">
          <button
            style={{ background: 'none', border: 'none' }}
            className="navbar-brand"
            onClick={() => {
              if (!hideBackButton) route.goBack();
            }}
          >
            {!hideBackButton ? <BackArrowIcon /> : null}
          </button>

          <div style={{ fontWeight: 800, marginLeft: -40 }}>{title}</div>
          <div
            style={{ paddingRight: 10 }}
            onClick={() => {
              if (onRightClick) onRightClick();
            }}
          >
            {rightButton}
          </div>
        </div>
      </nav>
      {!loading ? (
        <div className="" style={{ marginTop: '80px', ...containerStyle }}>
          {children}
        </div>
      ) : null}
      {!!loading && <Loader />}
    </div>
  );
};

export default WrapperWithTopNavigation;
