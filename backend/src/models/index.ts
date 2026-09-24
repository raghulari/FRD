import { User } from './User';
import { Client } from './Client';
import { Template } from './Template';
import { ProductCategory, ProductType, MainModule, SubModule, ModuleOption } from './Catalog';
import { FRD } from './FRD';
import { FRDSelection } from './FRDSelection';
import { FRDSection } from './FRDSection';
import { FRDGeneratedContent } from './FRDGeneratedContent';
import { RateLimitHit } from './RateLimitHit';
import { AuditLog } from './AuditLog';

// User <-> Client
User.hasOne(Client, { foreignKey: 'user_id', as: 'client' });
Client.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User <-> Template
User.hasMany(Template, { foreignKey: 'created_by_admin_id', as: 'created_templates' });
Template.belongsTo(User, { foreignKey: 'created_by_admin_id', as: 'created_by_admin' });

// Client <-> FRD
Client.hasMany(FRD, { foreignKey: 'client_id', as: 'frds' });
FRD.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });

// Template <-> FRD
Template.hasMany(FRD, { foreignKey: 'template_version_id', as: 'frds' });
FRD.belongsTo(Template, { foreignKey: 'template_version_id', as: 'template' });

// FRD <-> FRDSelection
FRD.hasOne(FRDSelection, { foreignKey: 'frd_id', as: 'selections' });
FRDSelection.belongsTo(FRD, { foreignKey: 'frd_id', as: 'frd' });

// FRD <-> FRDSection
FRD.hasMany(FRDSection, { foreignKey: 'frd_id', as: 'sections' });
FRDSection.belongsTo(FRD, { foreignKey: 'frd_id', as: 'frd' });

// FRD <-> FRDGeneratedContent
FRD.hasMany(FRDGeneratedContent, { foreignKey: 'frd_id', as: 'generated_contents' });
FRDGeneratedContent.belongsTo(FRD, { foreignKey: 'frd_id', as: 'frd' });

// User <-> AuditLog
User.hasMany(AuditLog, { foreignKey: 'actor_user_id', as: 'audit_logs' });
AuditLog.belongsTo(User, { foreignKey: 'actor_user_id', as: 'actor' });

// Catalog Associations
ProductCategory.hasMany(ProductType, { foreignKey: 'category_id', as: 'types' });
ProductType.belongsTo(ProductCategory, { foreignKey: 'category_id', as: 'category' });

ProductType.hasMany(MainModule, { foreignKey: 'product_type_id', as: 'main_modules' });
MainModule.belongsTo(ProductType, { foreignKey: 'product_type_id', as: 'product_type' });

MainModule.hasMany(SubModule, { foreignKey: 'main_module_id', as: 'sub_modules' });
SubModule.belongsTo(MainModule, { foreignKey: 'main_module_id', as: 'main_module' });

SubModule.hasMany(ModuleOption, { foreignKey: 'sub_module_id', as: 'options' });
ModuleOption.belongsTo(SubModule, { foreignKey: 'sub_module_id', as: 'sub_module' });

export {
  User,
  Client,
  Template,
  ProductCategory,
  ProductType,
  MainModule,
  SubModule,
  ModuleOption,
  FRD,
  FRDSelection,
  FRDSection,
  FRDGeneratedContent,
  RateLimitHit,
  AuditLog,
};
