import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface FRDSectionAttributes {
  id: string;
  frd_id: string;
  section_key: string;
  content: Record<string, any> | any[];
  is_admin_editable: boolean;
  last_edited_by?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export type FRDSectionCreationAttributes = Optional<
  FRDSectionAttributes,
  'id' | 'is_admin_editable' | 'last_edited_by'
>;

export class FRDSection
  extends Model<FRDSectionAttributes, FRDSectionCreationAttributes>
  implements FRDSectionAttributes
{
  declare public id: string;
  declare public frd_id: string;
  declare public section_key: string;
  declare public content: Record<string, any> | any[];
  declare public is_admin_editable: boolean;
  declare public last_edited_by: string | null;
  declare public readonly created_at: Date;
  declare public readonly updated_at: Date;
}

FRDSection.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    frd_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'frds',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    section_key: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    content: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    is_admin_editable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    last_edited_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'frd_sections',
    timestamps: true,
    underscored: true,
  }
);
