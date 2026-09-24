import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface TemplateAttributes {
  id: string;
  version: number;
  sections: {
    requirements?: any[];
    deliverables?: any[];
    communication?: any[];
    additional_pricing?: any[];
    excluded?: string[];
    other_agreements?: string[];
    [key: string]: any;
  };
  created_by_admin_id: string;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export type TemplateCreationAttributes = Optional<TemplateAttributes, 'id' | 'is_active'>;

export class Template
  extends Model<TemplateAttributes, TemplateCreationAttributes>
  implements TemplateAttributes
{
  declare public id: string;
  declare public version: number;
  declare public sections: Record<string, any>;
  declare public created_by_admin_id: string;
  declare public is_active: boolean;
  declare public readonly created_at: Date;
  declare public readonly updated_at: Date;
}

Template.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    sections: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    created_by_admin_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'templates',
    timestamps: true,
    underscored: true,
  }
);
