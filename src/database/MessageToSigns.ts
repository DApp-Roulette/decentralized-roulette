import { DataTypes, Model } from 'sequelize';
import { sequelize } from '.';

interface MessageToSignsAttributes {
  id?: number;
  session: string;
  message: string;
  date_time: Date;
}

class MessageToSigns extends Model<MessageToSignsAttributes> implements MessageToSignsAttributes {
  public id!: number;
  public session!: string;
  public message!: string;
  public date_time!: Date;
}

MessageToSigns.init(
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    session: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    date_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'MessageToSigns',
    timestamps: false
  }
);
export { MessageToSigns };