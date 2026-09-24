import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface FRDSelectionAttributes {
  id: string;
  frd_id: string;
  selection_tree: Record<string, any>;
  created_at?: Date;
  updated_at?: Date;
}

export type FRDSelectionCreationAttributes = Optional<FRDSelectionAttributes, 'id'>;

export class FRDSelection
  extends Model<FRDSelectionAttributes, FRDSelectionCreationAttributes>
  implements FRDSelectionAttributes
{
  declare public id: string;
  declare public frd_id: string;
  declare public selection_tree: Record<string, any>;
  declare public readonly created_at: Date;
  declare public readonly updated_at: Date;
}

FRDSelection.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    frd_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'frds',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    selection_tree: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
  },
  {
    sequelize,
    tableName: 'frd_selections',
    timestamps: true,
    underscored: true,
  }
);
