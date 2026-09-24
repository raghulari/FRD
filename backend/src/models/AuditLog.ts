import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface AuditLogAttributes {
  id: string;
  actor_user_id: string;
  action: string;
  target_type: string;
  target_id?: string | null;
  details?: Record<string, any>;
  created_at?: Date;
  updated_at?: Date;
}

export type AuditLogCreationAttributes = Optional<
  AuditLogAttributes,
  'id' | 'target_id' | 'details'
>;

export class AuditLog
  extends Model<AuditLogAttributes, AuditLogCreationAttributes>
  implements AuditLogAttributes
{
  declare public id: string;
  declare public actor_user_id: string;
  declare public action: string;
  declare public target_type: string;
  declare public target_id: string | null;
  declare public details: Record<string, any>;
  declare public readonly created_at: Date;
  declare public readonly updated_at: Date;
}

AuditLog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    actor_user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    action: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    target_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    target_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    details: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
  },
  {
    sequelize,
    tableName: 'audit_logs',
    timestamps: true,
    underscored: true,
  }
);
