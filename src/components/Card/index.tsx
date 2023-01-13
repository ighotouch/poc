import "./styles.scss";
export interface ICard {
  children: React.ReactElement;
  onClick?: () => void;
  style?: any;
}
const Card: React.FC<ICard> = ({ children, onClick, style }) => {
  return (
    <div
      className="card"
      style={style ? style : {borderRadius: 8}}
      onClick={(event) => {
        event.stopPropagation();
        if (onClick) onClick();
      }}
    >
      <div className="">{children}</div>
    </div>
  );
};

export default Card;
