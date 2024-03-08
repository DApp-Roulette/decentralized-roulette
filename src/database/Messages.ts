import { DataTypes, Model } from 'sequelize';
import { sequelize } from '.';

interface MessagesAttributes {
  id?: number;
  userId: number;
  content: string;
  date_sent: Date;
}

class Messages extends Model<MessagesAttributes> implements MessagesAttributes {
  public id!: number;
  public userId!: number;
  public content!: string;
  public date_sent!: Date;
}

Messages.init(
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    date_sent: {
      type: DataTypes.DATE,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'Messages',
    timestamps: false
  }
);
export { Messages };