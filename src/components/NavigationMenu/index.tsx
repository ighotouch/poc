import React, { useState } from "react";

export interface INavigationItem {
  onClick: (id: any) => void;
  id: string;
  icon: React.ReactChild;
  title: string;
  activeIcon: React.ReactChild;
}

export interface INavigationMenu {
  items: Array<INavigationItem>;
  defaultSelected: null | number;
  onItemClick: (id: any) => void;
  noActiveBg: boolean;
  activeBgColor: string;
  activeTextColor: string;
}
const NavigationMenu: React.FC<INavigationMenu> = ({
  items,
  defaultSelected = null,
  onItemClick,
  noActiveBg,
  activeBgColor,
  activeTextColor,
}) => {
  const [current, setCurrent] = useState(defaultSelected);

  function getItemStyle() {
    const style: React.CSSProperties = {};
    if (noActiveBg && !activeBgColor) {
      style.backgroundColor = "transparent";
    }
    if (activeBgColor) {
      style.backgroundColor = activeBgColor;
    }
    return style;
  }

  const navItems = items.map((item, idx) => {
    return (
      <div
        key={"nav-item-" + idx}
        id={"nav-item-" + idx}
        className={`bottom-nav-item ${current === idx && "active"}`}
        style={current === idx ? getItemStyle() : {}}
        onClick={() => {
          setCurrent(idx);
          if (item.onClick) {
            item.onClick(idx);
          }
          if (onItemClick) {
            onItemClick(idx);
          }
        }}
      >
        {current !== idx && item.icon ? item.icon : ""}
        {current === idx && item.activeIcon ? item.activeIcon : ""}
        {item.title && (
          <p
            className="bottom-nav-item--title"
            style={current === idx ? { color: activeTextColor } : {}}
          >
            {item.title}
          </p>
        )}
      </div>
    );
  });
  return (
    <nav className="navbar fixed-bottom navbar-light bg-light">
      <div className="container-sm">{navItems}</div>
    </nav>
  );
};

export default NavigationMenu;
