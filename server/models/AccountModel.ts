import { DataTypes } from "sequelize";
import { db } from "../database";
import { v4 as uuidv4 } from "uuid";

const Account = db.define("Account", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 32],
      is: /^(?=.*[A-Za-z0-9]$)[A-Za-z][A-Za-z\d\.\-_]*$/,
    },
  },
  color: {
    type: DataTypes.STRING,
    validate: {
      is: /^#[0-9A-F]{6}$/i,
    },
    defaultValue: "#32a852",
  },
  value: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
  },
});

Account.beforeCreate(async (account: any) => {
  account.id = uuidv4();
  return account;
});

export default Account;
