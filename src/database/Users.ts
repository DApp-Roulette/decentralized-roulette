import { DataTypes, Model } from 'sequelize';
import { sequelize } from '.';

interface AddressAttributes {
  id?: number;
  user_name: string;
  address: string;
  registration_date: Date;
}

class Users extends Model<AddressAttributes> implements AddressAttributes {
  public id!: number;
  public user_name!: string;
  public address!: string;
  public registration_date!: Date;
}

Users.init(
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    registration_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'Users',
    timestamps: false
  }
);
export { Users };