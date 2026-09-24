import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface FRDGeneratedContentAttributes {
  id: string;
  frd_id: string;
  section_key: 'architecture' | 'implementation_phases';
  content: Record<string, any> | any[];
  selection_hash: string;
  ai_model_used: string;
  generated_at: Date;
  created_at?: Date;
  updated_at?: Date;
}

export type FRDGeneratedContentCreationAttributes = Optional<
  FRDGeneratedContentAttributes,
  'id' | 'generated_at'
>;

export class FRDGeneratedContent
  extends Model<FRDGeneratedContentAttributes, FRDGeneratedContentCreationAttributes>
  implements FRDGeneratedContentAttributes
{
  declare public id: string;
  declare public frd_id: string;
  declare public section_key: 'architecture' | 'implementation_phases';
  declare public content: Record<string, any> | any[];
  declare public selection_hash: string;
  declare public ai_model_used: string;
  declare public generated_at: Date;
  declare public readonly created_at: Date;
  declare public readonly updated_at: Date;
}

FRDGeneratedContent.init(
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
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    content: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    selection_hash: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    ai_model_used: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    generated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'frd_generated_content',
    timestamps: true,
    underscored: true,
  }
);
