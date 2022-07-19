import { useCallback, useMemo } from "react";
import PersonCategories from "../../types/person/personCategories.enum";
import {
  FaHouseUser,
  FaUsers,
  FaBriefcase,
  FaShoppingBag,
  FaCommentDollar,
  FaReceipt,
  FaBars,
} from "react-icons/fa";
import { IconBaseProps } from "react-icons";
import getFontContrastingColor from "../utils/getFontContrastingColor";

interface IPersonIconProps {
  category: PersonCategories;
  bgSize?: string;
  iconSize?: number;
  zeroPadding?: boolean;
}

const PersonIcon = ({
  category,
  bgSize = "3rem",
  iconSize = 24,
  zeroPadding = false,
}: IPersonIconProps) => {
  const getIcon = useCallback(
    (props: IconBaseProps = { color: "#ffffff" }): React.ReactNode => {
      props.size = iconSize;
      switch (category) {
        case PersonCategories.family:
          return <FaHouseUser {...props} />;
        case PersonCategories.friends:
          return <FaUsers {...props} />;
        case PersonCategories.work:
          return <FaBriefcase {...props} />;
        case PersonCategories.shop:
          return <FaShoppingBag {...props} />;
        case PersonCategories.services:
          return <FaCommentDollar {...props} />;
        case PersonCategories.bills:
          return <FaReceipt {...props} />;
        case PersonCategories.other:
          return <FaBars {...props} />;
        default:
          return <FaBars {...props} />;
      }
    },
    [category, iconSize]
  );
  const getColor = useMemo((): string => {
    switch (category) {
      case PersonCategories.family:
        return "#2ed573";
      case PersonCategories.friends:
        return "#1e90ff";
      case PersonCategories.work:
        return "#ff4757";
      case PersonCategories.shop:
        return "#eccc68";
      case PersonCategories.services:
        return "#ffa502";
      case PersonCategories.bills:
        return "#a4b0be";
      case PersonCategories.other:
        return "#2f3542";
      default:
        return "#2f3542";
    }
  }, [category]);

  return (
    <div
      className={`rounded-xl flex justify-center items-center`}
      style={{
        padding: zeroPadding ? 0 : "0.75rem",
        backgroundColor: getColor,
        width: bgSize,
        height: bgSize,
      }}
    >
      {getIcon({
        // color: getFontContrastingColor(getColor),
        color: "#ffffff", //For now all icons are rather dark colors, so white font color is fine
        className: "shrink-0",
      })}
    </div>
  );
};
export default PersonIcon;
