import { DataTypes, Model } from 'sequelize';
import { sequelize } from '.';

interface GamesAttributes {
  id?: number;
  transaction_hash?: string;
  game_id: string;
  information: string;
  scheduled_draw: Date;
  is_finished: boolean;
}

class Games extends Model<GamesAttributes> implements GamesAttributes {
  public id!: number;
  public transaction_hash!: string;
  public game_id!: string;
  public information!: string;
  public scheduled_draw!: Date;
  public is_finished: boolean;
}

Games.init(
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    transaction_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    game_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    information: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    scheduled_draw: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_finished: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Games',
    timestamps: false
  }
);
export { Games };