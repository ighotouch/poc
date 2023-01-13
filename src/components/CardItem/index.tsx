import Colors from 'common/Colors';
import Card from 'components/Card';
import './styles.scss';

export interface ICardItem {
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  title: string;
  desc?: string;
  hasError?: boolean;
  actionLabel?: string;
  actionLabelStyle?: React.CSSProperties;
  selected?: boolean;
  disabled?: boolean;
  titleColor?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'default';
  onClick?: () => void;
}
const CardItem: React.FC<ICardItem> = ({
  leftIcon,
  rightIcon,
  title,
  desc,
  titleColor = 'primary',
  onClick,
  selected,
  disabled,
  actionLabel,
  actionLabelStyle = {},
  hasError,
}) => {
  return (
    <Card
      onClick={disabled ? () => null : onClick}
      style={
        selected
          ? {
              border: `1px solid ${Colors.primaryColor}`,
              backgroundColor: '#FFF9FD',
            }
          : hasError
          ? { border: `1px solid ${Colors.red}` }
          : {}
      }
    >
      <div className="d-flex flex-row card-container">
        {!!leftIcon && (
          <div
            className="mt-1"
            style={disabled ? { filter: 'grayscale(100%)', opacity: 0.4 } : {}}
          >
            {leftIcon}
          </div>
        )}
        <div className="flex-fill">
          <div className="d-flex flex-row align-items-center">
            <h4
              className={
                disabled
                  ? `text-seccondary mb-0 ${leftIcon ? 'ms-3' : ''}`
                  : `text-${titleColor} mb-0 ${leftIcon ? 'ms-3' : ''}`
              }
              style={disabled ? { opacity: 0.4 } : {}}
            >
              {title}
            </h4>
          </div>
          <div
            className={`card-desc text-secondary ${leftIcon ? 'ms-3' : ''}`}
            style={
              disabled
                ? { maxWidth: 310, fontSize: 12, opacity: 0.3 }
                : { maxWidth: 310, fontSize: 12 }
            }
          >
            {desc}
          </div>
        </div>
        <div
          className="d-flex flex-column justify-content-between align-items-end"
          style={{ paddingTop: 3 }}
        >
          {!!rightIcon && rightIcon}{' '}
          <div style={{ fontSize: 12, ...actionLabelStyle }}>{actionLabel}</div>
        </div>
      </div>
    </Card>
  );
};

export default CardItem;
