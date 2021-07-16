import { DataTypes } from "sequelize";
import { db } from "../database";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

const User = db.define("User", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  login: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [4, 32],
      is: /^(?=.*[A-Za-z0-9]$)[A-Za-z][A-Za-z\d.-_]*$/,
    },
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.beforeCreate(async (user: any) => {
  user.id = uuidv4();
  user.password = await bcrypt.hash(user.password, 10);

  return user;
});

export default User;
