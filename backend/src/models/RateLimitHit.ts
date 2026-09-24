import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface RateLimitHitAttributes {
  key: string;
  window_start: number;
  count: number;
  created_at?: Date;
  updated_at?: Date;
}

export type RateLimitHitCreationAttributes = Optional<RateLimitHitAttributes, 'count'>;

export class RateLimitHit
  extends Model<RateLimitHitAttributes, RateLimitHitCreationAttributes>
  implements RateLimitHitAttributes
{
  declare public key: string;
  declare public window_start: number;
  declare public count: number;
  declare public readonly created_at: Date;
  declare public readonly updated_at: Date;
}

RateLimitHit.init(
  {
    key: {
      type: DataTypes.STRING(255),
      primaryKey: true,
    },
    window_start: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    tableName: 'rate_limit_hits',
    timestamps: true,
    underscored: true,
  }
);
