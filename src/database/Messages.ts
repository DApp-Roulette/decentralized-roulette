import { DataTypes, Model } from 'sequelize';
import { sequelize } from '.';
import { Users } from './Users';

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
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
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

Messages.belongsTo(Users, { foreignKey: 'userId' });

export { Messages };