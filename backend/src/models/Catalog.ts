import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// 1. ProductCategory
export interface ProductCategoryAttributes {
  id: string;
  name: string;
  code?: string;
  description?: string;
  is_custom: boolean;
  created_at?: Date;
  updated_at?: Date;
}
export type ProductCategoryCreationAttributes = Optional<
  ProductCategoryAttributes,
  'id' | 'is_custom'
>;
export class ProductCategory
  extends Model<ProductCategoryAttributes, ProductCategoryCreationAttributes>
  implements ProductCategoryAttributes
{
  declare public id: string;
  declare public name: string;
  declare public code?: string;
  declare public description?: string;
  declare public is_custom: boolean;
}
ProductCategory.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    code: { type: DataTypes.STRING(100), allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    is_custom: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  { sequelize, tableName: 'product_categories', timestamps: true, underscored: true }
);

// 2. ProductType
export interface ProductTypeAttributes {
  id: string;
  category_id: string;
  name: string;
  code?: string;
  description?: string;
  is_custom: boolean;
  created_at?: Date;
  updated_at?: Date;
}
export type ProductTypeCreationAttributes = Optional<ProductTypeAttributes, 'id' | 'is_custom'>;
export class ProductType
  extends Model<ProductTypeAttributes, ProductTypeCreationAttributes>
  implements ProductTypeAttributes
{
  declare public id: string;
  declare public category_id: string;
  declare public name: string;
  declare public code?: string;
  declare public description?: string;
  declare public is_custom: boolean;
}
ProductType.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    category_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'product_categories', key: 'id' },
      onDelete: 'CASCADE',
    },
    name: { type: DataTypes.STRING(255), allowNull: false },
    code: { type: DataTypes.STRING(100), allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    is_custom: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  { sequelize, tableName: 'product_types', timestamps: true, underscored: true }
);

// 3. MainModule
export interface MainModuleAttributes {
  id: string;
  product_type_id: string;
  name: string;
  code?: string;
  description?: string;
  is_custom: boolean;
  created_at?: Date;
  updated_at?: Date;
}
export type MainModuleCreationAttributes = Optional<MainModuleAttributes, 'id' | 'is_custom'>;
export class MainModule
  extends Model<MainModuleAttributes, MainModuleCreationAttributes>
  implements MainModuleAttributes
{
  declare public id: string;
  declare public product_type_id: string;
  declare public name: string;
  declare public code?: string;
  declare public description?: string;
  declare public is_custom: boolean;
}
MainModule.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    product_type_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'product_types', key: 'id' },
      onDelete: 'CASCADE',
    },
    name: { type: DataTypes.STRING(255), allowNull: false },
    code: { type: DataTypes.STRING(100), allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    is_custom: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  { sequelize, tableName: 'main_modules', timestamps: true, underscored: true }
);

// 4. SubModule
export interface SubModuleAttributes {
  id: string;
  main_module_id: string;
  name: string;
  code?: string;
  description?: string;
  is_custom: boolean;
  created_at?: Date;
  updated_at?: Date;
}
export type SubModuleCreationAttributes = Optional<SubModuleAttributes, 'id' | 'is_custom'>;
export class SubModule
  extends Model<SubModuleAttributes, SubModuleCreationAttributes>
  implements SubModuleAttributes
{
  declare public id: string;
  declare public main_module_id: string;
  declare public name: string;
  declare public code?: string;
  declare public description?: string;
  declare public is_custom: boolean;
}
SubModule.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    main_module_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'main_modules', key: 'id' },
      onDelete: 'CASCADE',
    },
    name: { type: DataTypes.STRING(255), allowNull: false },
    code: { type: DataTypes.STRING(100), allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    is_custom: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  { sequelize, tableName: 'sub_modules', timestamps: true, underscored: true }
);

// 5. ModuleOption
export interface ModuleOptionAttributes {
  id: string;
  sub_module_id: string;
  name: string;
  code?: string;
  description?: string;
  is_custom: boolean;
  created_at?: Date;
  updated_at?: Date;
}
export type ModuleOptionCreationAttributes = Optional<ModuleOptionAttributes, 'id' | 'is_custom'>;
export class ModuleOption
  extends Model<ModuleOptionAttributes, ModuleOptionCreationAttributes>
  implements ModuleOptionAttributes
{
  declare public id: string;
  declare public sub_module_id: string;
  declare public name: string;
  declare public code?: string;
  declare public description?: string;
  declare public is_custom: boolean;
}
ModuleOption.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    sub_module_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'sub_modules', key: 'id' },
      onDelete: 'CASCADE',
    },
    name: { type: DataTypes.STRING(255), allowNull: false },
    code: { type: DataTypes.STRING(100), allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    is_custom: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  { sequelize, tableName: 'module_options', timestamps: true, underscored: true }
);
