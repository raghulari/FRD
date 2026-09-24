import { ensurePostgresRunning } from '../config/embeddedPg';
import { sequelize } from '../config/database';
import {
  ProductCategory,
  ProductType,
  MainModule,
  SubModule,
  ModuleOption,
} from '../models/Catalog';

export const CATALOG_SEED_DATA = [
  {
    category: 'Enterprise Resource Planning (ERP)',
    code: 'ERP',
    description: 'Comprehensive enterprise resource management for core operations.',
    types: [
      {
        name: 'Standard ERP Platform',
        code: 'ERP_STD',
        description: 'Standard enterprise business operations & finance suite.',
        main_modules: [
          {
            name: 'User Management',
            sub_modules: [
              {
                name: 'Login Methods',
                options: [
                  'Username-Password',
                  'SSO/SAML/OAuth2',
                  'LDAP',
                  'Biometric',
                  'Email OTP',
                  'SMS OTP',
                  'TOTP-MFA',
                ],
              },
              {
                name: 'User Roles',
                options: [
                  'System Admin',
                  'Module Admin',
                  'Manager',
                  'Employee',
                  'Auditor',
                  'External User',
                ],
              },
              {
                name: 'Registration Types',
                options: ['Admin-invited', 'Self-registration with approval', 'Bulk import'],
              },
            ],
          },
          {
            name: 'Financial Management',
            sub_modules: [
              {
                name: 'Accounting Methods',
                options: ['Double-Entry', 'Single-Entry'],
              },
              {
                name: 'Ledger Types',
                options: ['General Ledger', 'Sub-ledger AP/AR', 'Consolidated'],
              },
              {
                name: 'Tax Types',
                options: ['GST', 'VAT', 'Sales Tax', 'Income Tax', 'TDS/TCS'],
              },
            ],
          },
          {
            name: 'Inventory & Warehouse',
            sub_modules: [
              {
                name: 'Stock Types',
                options: ['Raw Material', 'WIP', 'Finished Goods', 'Consignment'],
              },
              {
                name: 'Valuation Methods',
                options: ['FIFO', 'LIFO', 'Weighted Average', 'Specific Identification'],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    category: 'Customer Relationship Management (CRM)',
    code: 'CRM',
    description: 'Lead tracking, customer management, pipeline, and sales automation.',
    types: [
      {
        name: 'Sales & Customer CRM',
        code: 'CRM_SALES',
        description: 'Lead generation, sales pipeline, customer portal, and communication.',
        main_modules: [
          {
            name: 'Lead Management',
            sub_modules: [
              {
                name: 'Lead Sources',
                options: [
                  'Website',
                  'Referral',
                  'Social Media',
                  'Cold Call',
                  'Email Campaign',
                  'Partner',
                ],
              },
              {
                name: 'Assignment Types',
                options: [
                  'Automatic Round-robin',
                  'Manual',
                  'Weighted',
                  'Territory-based',
                  'Skills-based',
                ],
              },
            ],
          },
          {
            name: 'Opportunity Management',
            sub_modules: [
              {
                name: 'Pipeline Stages',
                options: [
                  'Prospecting',
                  'Qualification',
                  'Demo/Meeting',
                  'Proposal Sent',
                  'Negotiation',
                  'Closed Won',
                  'Closed Lost',
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    category: 'Human Resource Management System (HRMS)',
    code: 'HRMS',
    description: 'Recruitment, attendance, payroll, performance, and exit management.',
    types: [
      {
        name: 'Core HRMS Suite',
        code: 'HRMS_CORE',
        description: 'Employee lifecycle, biometric attendance, and statutory payroll.',
        main_modules: [
          {
            name: 'Attendance',
            sub_modules: [
              {
                name: 'Check-in Methods',
                options: ['Biometric', 'Mobile GPS', 'Web-based', 'RFID Card', 'Manual'],
              },
              {
                name: 'Shift Types',
                options: ['Fixed', 'Rotational', 'Flexible', 'Split Shift'],
              },
            ],
          },
          {
            name: 'Payroll',
            sub_modules: [
              {
                name: 'Salary Components',
                options: ['Basic Pay', 'HRA', 'DA', 'Special Allowance', 'Bonus', 'Incentives'],
              },
              {
                name: 'Deductions',
                options: ['PF Employee/Employer', 'ESI', 'Professional Tax', 'TDS Income Tax'],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    category: 'Real Estate & Property Management (Builder ERP)',
    code: 'REAL_ESTATE',
    description: 'Builder ERP, construction management, villa/apartment sales, agreements.',
    types: [
      {
        name: 'Builder & Property ERP',
        code: 'BUILDER_ERP',
        description: 'Property management, construction stages, customer agreements, and accounts.',
        main_modules: [
          {
            name: 'Property Management',
            sub_modules: [
              {
                name: 'Property Types',
                options: [
                  'Villas',
                  'Apartments',
                  'Commercial Outlets',
                  'Layout Plots',
                  'Farm Lands',
                ],
              },
              {
                name: 'Compliance',
                options: ['RERA Compliance', 'DTCP Approval', 'Local Municipal Sanction'],
              },
            ],
          },
          {
            name: 'Construction Management',
            sub_modules: [
              {
                name: 'Construction Stages',
                options: [
                  'Foundation',
                  'Framing & Structure',
                  'Plumbing & Electrical',
                  'Finishing & Painting',
                  'Handover',
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    category: 'E-Commerce & Retail Marketplace',
    code: 'ECOMMERCE',
    description: 'Online store, multi-vendor marketplace, retail POS, and payment processing.',
    types: [
      {
        name: 'Online Store Platform',
        code: 'STORE_PLATFORM',
        description: 'B2C and B2B online shopping, cart, gateway settlements, and shipping.',
        main_modules: [
          {
            name: 'Payment Gateways',
            sub_modules: [
              {
                name: 'Payment Methods',
                options: [
                  'Credit/Debit Cards',
                  'Net Banking',
                  'UPI Collect/QR',
                  'Stripe',
                  'Razorpay',
                  'PayPal',
                  'COD',
                ],
              },
            ],
          },
          {
            name: 'Order Fulfillment',
            sub_modules: [
              {
                name: 'Shipping Carriers',
                options: ['DHL', 'FedEx', 'Blue Dart', 'Delhivery', 'Shiprocket API'],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    category: 'DevOps & CI/CD Platform',
    code: 'DEVOPS',
    description: 'Source code management, CI/CD pipeline automation, container orchestration.',
    types: [
      {
        name: 'Cloud & CI/CD Platform',
        code: 'DEVOPS_PLATFORM',
        description: 'Automated testing, Kubernetes container orchestration, and cloud management.',
        main_modules: [
          {
            name: 'CI/CD Pipelines',
            sub_modules: [
              {
                name: 'Deployment Strategies',
                options: ['Canary Rollout', 'Blue/Green', 'Rolling Update', 'A/B Testing'],
              },
            ],
          },
        ],
      },
    ],
  },
];

export async function seedCatalog() {
  await ensurePostgresRunning();

  console.log('[Catalog Seed] Syncing catalog models...');
  await sequelize.sync();

  console.log('[Catalog Seed] Seeding tiered catalog hierarchy...');

  for (const catData of CATALOG_SEED_DATA) {
    const [category] = await ProductCategory.findOrCreate({
      where: { name: catData.category },
      defaults: {
        name: catData.category,
        code: catData.code,
        description: catData.description,
        is_custom: false,
      },
    });

    for (const typeData of catData.types) {
      const [pType] = await ProductType.findOrCreate({
        where: { category_id: category.id, name: typeData.name },
        defaults: {
          category_id: category.id,
          name: typeData.name,
          code: typeData.code,
          description: typeData.description,
          is_custom: false,
        },
      });

      for (const moduleData of typeData.main_modules) {
        const [mModule] = await MainModule.findOrCreate({
          where: { product_type_id: pType.id, name: moduleData.name },
          defaults: {
            product_type_id: pType.id,
            name: moduleData.name,
            is_custom: false,
          },
        });

        for (const subData of moduleData.sub_modules) {
          const [sModule] = await SubModule.findOrCreate({
            where: { main_module_id: mModule.id, name: subData.name },
            defaults: {
              main_module_id: mModule.id,
              name: subData.name,
              is_custom: false,
            },
          });

          for (const optionName of subData.options) {
            await ModuleOption.findOrCreate({
              where: { sub_module_id: sModule.id, name: optionName },
              defaults: {
                sub_module_id: sModule.id,
                name: optionName,
                is_custom: false,
              },
            });
          }
        }
      }
    }
  }

  console.log('[Catalog Seed] Tiered Product Catalog seeded successfully.');
}

if (require.main === module) {
  seedCatalog()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[Catalog Seed Error]:', err);
      process.exit(1);
    });
}
