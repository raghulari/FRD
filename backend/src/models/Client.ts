import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface ClientAttributes {
  id: string;
  user_id: string;
  company_name: string;
  company_details?: Record<string, any>;
  created_at?: Date;
  updated_at?: Date;
}

export type ClientCreationAttributes = Optional<ClientAttributes, 'id'>;

export class Client
  extends Model<ClientAttributes, ClientCreationAttributes>
  implements ClientAttributes
{
  declare public id: string;
  declare public user_id: string;
  declare public company_name: string;
  declare public company_details: Record<string, any>;
  declare public readonly created_at: Date;
  declare public readonly updated_at: Date;
}

Client.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    company_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    company_details: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
  },
  {
    sequelize,
    tableName: 'clients',
    timestamps: true,
    underscored: true,
  }
);
