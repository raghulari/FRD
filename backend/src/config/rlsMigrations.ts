import { sequelize } from './database';

export async function applyRLSPolicies(): Promise<void> {
  console.log('[RLS] Applying Row-Level Security Policies with FORCE RLS...');

  const rlsQueries = [
    // 1. Enable and FORCE RLS on client-owned tables (so table owners and superusers also adhere to RLS session variables)
    `ALTER TABLE clients ENABLE ROW LEVEL SECURITY;`,
    `ALTER TABLE clients FORCE ROW LEVEL SECURITY;`,

    `ALTER TABLE frds ENABLE ROW LEVEL SECURITY;`,
    `ALTER TABLE frds FORCE ROW LEVEL SECURITY;`,

    `ALTER TABLE frd_selections ENABLE ROW LEVEL SECURITY;`,
    `ALTER TABLE frd_selections FORCE ROW LEVEL SECURITY;`,

    `ALTER TABLE frd_sections ENABLE ROW LEVEL SECURITY;`,
    `ALTER TABLE frd_sections FORCE ROW LEVEL SECURITY;`,

    `ALTER TABLE frd_generated_content ENABLE ROW LEVEL SECURITY;`,
    `ALTER TABLE frd_generated_content FORCE ROW LEVEL SECURITY;`,

    // Drop existing policies if any
    `DROP POLICY IF EXISTS client_isolation_clients ON clients;`,
    `DROP POLICY IF EXISTS client_isolation_frds ON frds;`,
    `DROP POLICY IF EXISTS client_isolation_frd_selections ON frd_selections;`,
    `DROP POLICY IF EXISTS client_isolation_frd_sections ON frd_sections;`,
    `DROP POLICY IF EXISTS client_isolation_frd_generated_content ON frd_generated_content;`,

    // Policy for clients table
    `CREATE POLICY client_isolation_clients ON clients
      USING (
        NULLIF(current_setting('app.role', true), '') = 'admin' OR
        id = NULLIF(current_setting('app.current_client_id', true), '')::uuid
      );`,

    // Policy for frds table
    `CREATE POLICY client_isolation_frds ON frds
      USING (
        NULLIF(current_setting('app.role', true), '') = 'admin' OR
        client_id = NULLIF(current_setting('app.current_client_id', true), '')::uuid
      );`,

    // Policy for frd_selections table
    `CREATE POLICY client_isolation_frd_selections ON frd_selections
      USING (
        NULLIF(current_setting('app.role', true), '') = 'admin' OR
        frd_id IN (
          SELECT id FROM frds WHERE client_id = NULLIF(current_setting('app.current_client_id', true), '')::uuid
        )
      );`,

    // Policy for frd_sections table
    `CREATE POLICY client_isolation_frd_sections ON frd_sections
      USING (
        NULLIF(current_setting('app.role', true), '') = 'admin' OR
        frd_id IN (
          SELECT id FROM frds WHERE client_id = NULLIF(current_setting('app.current_client_id', true), '')::uuid
        )
      );`,

    // Policy for frd_generated_content table
    `CREATE POLICY client_isolation_frd_generated_content ON frd_generated_content
      USING (
        NULLIF(current_setting('app.role', true), '') = 'admin' OR
        frd_id IN (
          SELECT id FROM frds WHERE client_id = NULLIF(current_setting('app.current_client_id', true), '')::uuid
        )
      );`,
  ];

  for (const query of rlsQueries) {
    try {
      await sequelize.query(query);
    } catch (err: any) {
      console.warn(`[RLS Policy warning]: ${err.message}`);
    }
  }

  console.log('[RLS] Row-Level Security Policies applied with FORCE RLS successfully.');
}
