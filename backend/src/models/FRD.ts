import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface FRDAttributes {
  id: string;
  client_id: string;
  template_version_id: string;
  status: 'draft' | 'pending_approval' | 'approved';
  filename: string;
  created_at?: Date;
  updated_at?: Date;
}

export type FRDCreationAttributes = Optional<FRDAttributes, 'id' | 'status' | 'filename'>;

export class FRD extends Model<FRDAttributes, FRDCreationAttributes> implements FRDAttributes {
  declare public id: string;
  declare public client_id: string;
  declare public template_version_id: string;
  declare public status: 'draft' | 'pending_approval' | 'approved';
  declare public filename: string;
  declare public selections?: any;
  declare public readonly created_at: Date;
  declare public readonly updated_at: Date;
}

FRD.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    client_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'clients',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    template_version_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'templates',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('draft', 'pending_approval', 'approved'),
      allowNull: false,
      defaultValue: 'draft',
    },
    filename: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'FRD_Document.pdf',
    },
  },
  {
    sequelize,
    tableName: 'frds',
    timestamps: true,
    underscored: true,
  }
);
