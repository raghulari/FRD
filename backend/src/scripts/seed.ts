import { ensurePostgresRunning } from '../config/embeddedPg';
import { sequelize } from '../config/database';
import { applyRLSPolicies } from '../config/rlsMigrations';
import { User, Template } from '../models';
import { hashPassword } from '../utils/password';

export async function seedDatabase() {
  await ensurePostgresRunning();

  console.log('[Seed] Syncing database models...');
  await sequelize.sync({ alter: true });

  console.log('[Seed] Applying RLS policies...');
  await applyRLSPolicies();

  // 1. Seed Admin User
  const adminEmail = 'admin@frdplatform.com';
  let admin = await User.findOne({ where: { email: adminEmail } });

  if (!admin) {
    console.log('[Seed] Creating default admin user...');
    const password_hash = await hashPassword('AdminPass123!');
    admin = await User.create({
      email: adminEmail,
      password_hash,
      role: 'admin',
    });
    console.log(`[Seed] Default Admin created: ${adminEmail} / AdminPass123!`);
  } else {
    console.log(`[Seed] Default Admin already exists: ${adminEmail}`);
  }

  // 2. Seed Initial Template v1 (OPV Housing Template format)
  const existingTemplate = await Template.findOne({ where: { version: 1 } });
  if (!existingTemplate) {
    console.log('[Seed] Creating initial active Template v1...');
    await Template.create({
      version: 1,
      created_by_admin_id: admin.id,
      is_active: true,
      sections: {
        requirements: [
          {
            item: 'Functional Requirement Document (FRD)',
            timing: 'Before project commencement',
            responsibility: 'Client',
          },
          {
            item: 'User Stories & Business Workflows',
            timing: 'Before project commencement',
            responsibility: 'Client',
          },
          {
            item: 'UI/UX Design Approval',
            timing: 'Before project commencement',
            responsibility: 'Client',
          },
          {
            item: 'Brand Assets (Logo, Images, Icons & Content)',
            timing: 'Before project commencement',
            responsibility: 'Client',
          },
          { item: 'Domain & DNS Access', timing: 'Before deployment', responsibility: 'Client' },
          { item: 'Server / VPS Access', timing: 'Before deployment', responsibility: 'Client' },
          { item: 'WhatsApp Business API', timing: 'Before integration', responsibility: 'Client' },
          {
            item: 'SMS Gateway Credentials',
            timing: 'Before integration',
            responsibility: 'Client',
          },
          {
            item: 'Payment Gateway Credentials',
            timing: 'Before integration',
            responsibility: 'Client',
          },
        ],
        deliverables: [
          { item: 'Complete Source Code', timing: 'Maintenance', responsibility: 'Nutz' },
          {
            item: 'Deployment & Production Rollout',
            timing: 'Maintenance',
            responsibility: 'Nutz',
          },
          { item: 'Knowledge Transfer', timing: 'Maintenance', responsibility: 'Nutz' },
          { item: '30 Days Support & Maintenance', timing: 'Maintenance', responsibility: 'Nutz' },
          {
            item: 'Server Credentials, User Manuals, Configuration Documents & Deployment Guides',
            timing: 'Maintenance',
            responsibility: 'Nutz',
          },
          {
            item: 'Architecture Documents, API Documentation, Database Design, UI/UX Assets & Technical Guides',
            timing: 'Maintenance',
            responsibility: 'Nutz',
          },
        ],
        communication: [
          {
            function: 'Development Sync & Updates',
            means: 'GitHub, Google Meet, In Person',
            notes: 'Sprint planning, development tracking and technical discussions',
          },
          {
            function: 'Project Updates',
            means: 'WhatsApp, Email, Phone Calls',
            notes: 'Official communication, approvals and project status updates',
          },
        ],
        additional_pricing: [
          {
            function: 'Domain Registration',
            provider: 'Third Party',
            estimate: 'Need to be Purchased',
          },
          {
            function: 'Hosting / VPS',
            provider: 'AWS / DigitalOcean / Cloud Provider',
            estimate: 'Need to be Purchased',
          },
          { function: 'SMS Gateway', provider: 'Third Party', estimate: 'Based on Usage' },
          {
            function: 'WhatsApp Business API',
            provider: 'Meta / BSP',
            estimate: 'Based on Conversation Charges',
          },
        ],
        excluded: [
          '1. Domain Registration Charges',
          '2. Hosting & Cloud Server Charges',
          '3. Third-party API Charges',
          '4. SMS Credits',
          '5. WhatsApp Conversation Charges',
          '6. Payment Gateway Transaction Charges',
          '7. Government Registration Fees',
          '8. Additional Modules',
          '9. Change Requests Beyond Approved Scope',
        ],
        other_agreements: [
          '1. Phase 1 payment must be completed before project commencement.',
          '2. Advance payment for each phase is non-refundable once development has commenced.',
          '3. The project timeline begins only after receipt of all required assets, approvals and Phase 1 payment.',
          '4. Each subsequent phase will commence only after successful completion, client approval and payment of the previous phase.',
          '5. Any additional requirements beyond the approved Functional Requirement Document (FRD) shall be treated as Change Requests and quoted separately.',
          '6. Additional UI/UX revisions beyond the approved scope may incur extra charges.',
          '7. The client shall provide all required content, branding assets, credentials and third-party service access.',
          '8. Project timelines may extend due to delays in client approvals, feedback or pending deliverables.',
          '9. Source code ownership will be transferred only after full payment of the project.',
          '10. Production deployment will be performed after successful User Acceptance Testing (UAT).',
          '11. Support and services will be provided at no cost for a period of 30 days after the project rollout.',
          '12. Annual Maintenance Contract (AMC) and extended support will be provided under a separate agreement.',
          '13. This quotation is valid for 30 days from the issue date.',
        ],
      },
    });
    console.log('[Seed] Template v1 created successfully.');
  } else {
    console.log('[Seed] Template v1 already exists.');
  }

  console.log('[Seed] Seeding completed.');
}

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[Seed Error]:', err);
      process.exit(1);
    });
}
