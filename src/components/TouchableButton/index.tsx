import Colors from "common/Colors";
import React, { FunctionComponent } from "react";

type Props = {
  label: string;
  style?: any;
  textStyle?: any;
  reverse?: boolean;
  onPress?: () => void;
  transparent?: boolean;
  loading?: boolean;
};

const TouchableButton: FunctionComponent<Props> = ({
  label,
  style,
  reverse = false,
  onPress,
  transparent,
  loading,
  textStyle,
}) => {
  return (
    <button
      className="py-3"
      onClick={onPress}
      style={{
        backgroundColor: transparent
          ? "transparent"
          : reverse
          ? Colors.white
          : Colors.primaryColor,
        marginBottom: 10,
        borderRadius: 6,
        justifyContent: "center",
        color: "#ffffff",
        alignItems: "center",
        width: "100%",
        border: "none",
        ...style
      }}
    >
      <div
        style={{
          // height: transparent ? Fonts.h(24) : Fonts.h(42),
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {loading ? (
          <div>loading</div>
        ) : (
          <div style={reverse ? { color: Colors.darkText } : {}}>{label}</div>
        )}
      </div>
    </button>
  );
};

export default TouchableButton;
