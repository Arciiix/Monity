import AccountIcons from "../../types/account/accountIcons.enum";
import {
  FaWallet,
  FaPiggyBank,
  FaCreditCard,
  FaMoneyBill,
  FaUniversity,
  FaCoins,
  FaChartLine,
  FaDollarSign,
  FaEuroSign,
  FaHome,
  FaSchool,
  FaAtlas,
  FaBus,
  FaGift,
  FaBox,
  FaBriefcase,
  FaCalculator,
} from "react-icons/fa";

interface IAccountIconProps {
  name: AccountIcons;
  color?: string;
  size?: number;
}
const AccountIcon = ({
  name,
  color = "#ffffff",
  size = 24,
}: IAccountIconProps) => {
  const otherProps = { color, size };

  switch (name) {
    case AccountIcons["wallet"]:
      return <FaWallet {...otherProps} />;
    case AccountIcons["piggy-bank"]:
      return <FaPiggyBank {...otherProps} />;
    case AccountIcons["credit-card"]:
      return <FaCreditCard {...otherProps} />;
    case AccountIcons["money-bill"]:
      return <FaMoneyBill {...otherProps} />;
    case AccountIcons["university"]:
      return <FaUniversity {...otherProps} />;
    case AccountIcons["coins"]:
      return <FaCoins {...otherProps} />;
    case AccountIcons["chart-line"]:
      return <FaChartLine {...otherProps} />;
    case AccountIcons["dollar-sign"]:
      return <FaDollarSign {...otherProps} />;
    case AccountIcons["euro-sign"]:
      return <FaEuroSign {...otherProps} />;
    case AccountIcons["home"]:
      return <FaHome {...otherProps} />;
    case AccountIcons["school"]:
      return <FaSchool {...otherProps} />;
    case AccountIcons["atlas"]:
      return <FaAtlas {...otherProps} />;
    case AccountIcons["bus"]:
      return <FaBus {...otherProps} />;
    case AccountIcons["gift"]:
      return <FaGift {...otherProps} />;
    case AccountIcons["box"]:
      return <FaBox {...otherProps} />;
    case AccountIcons["briefcase"]:
      return <FaBriefcase {...otherProps} />;
    case AccountIcons["calculator"]:
      return <FaCalculator {...otherProps} />;
    default:
      return <FaWallet {...otherProps} />;
  }
};
export default AccountIcon;
