import path from 'path';
import { Client } from 'pg';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('embedded-postgres');
const EmbeddedPostgres = pkg.default || pkg.EmbeddedPostgres || pkg;

export async function ensurePostgresRunning(): Promise<void> {
  const port = 5432;
  const targetDb = 'frd_db';
  const targetUser = 'frd_user';
  const targetPassword = 'frd_password';
  const currentUser = process.env.USER || 'srk';

  const pgDataPath = path.join(process.cwd(), 'scratch_pgdata');

  const pg = new EmbeddedPostgres({
    port,
    user: currentUser,
    database: 'postgres',
    dataDir: pgDataPath,
    persistent: true,
  });

  try {
    await pg.initialise();
  } catch (err: any) {
    // Already initialized
  }

  try {
    await pg.start();
  } catch (err: any) {
    // Already running
  }

  // Connect as superuser currentUser to default 'postgres' database
  const client = new Client({
    host: '/tmp',
    port: 5432,
    user: currentUser,
    database: 'postgres',
  });

  try {
    await client.connect();

    // Check if target user exists
    const userRes = await client.query(`SELECT 1 FROM pg_roles WHERE rolname='${targetUser}'`);
    if (userRes.rowCount === 0) {
      // Create frd_user as a NON-SUPERUSER so PostgreSQL RLS policies are strictly enforced!
      await client.query(
        `CREATE USER ${targetUser} WITH PASSWORD '${targetPassword}' NOSUPERUSER NOCREATEDB NOCREATEROLE;`
      );
      console.log(`[EmbeddedPG] Created non-superuser database role: ${targetUser}`);
    } else {
      // Ensure existing frd_user is NOSUPERUSER
      await client.query(`ALTER USER ${targetUser} NOSUPERUSER;`);
    }

    // Check if target db exists
    const dbRes = await client.query(`SELECT 1 FROM pg_database WHERE datname='${targetDb}'`);
    if (dbRes.rowCount === 0) {
      await client.query(`CREATE DATABASE ${targetDb} OWNER ${targetUser};`);
      console.log(`[EmbeddedPG] Created database: ${targetDb}`);
    }

    // Grant schema privileges to frd_user on frd_db
    const dbClient = new Client({
      host: '/tmp',
      port: 5432,
      user: currentUser,
      database: targetDb,
    });
    await dbClient.connect();
    await dbClient.query(`GRANT ALL ON SCHEMA public TO ${targetUser};`);
    await dbClient.query(`GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ${targetUser};`);
    await dbClient.query(
      `GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ${targetUser};`
    );
    await dbClient.query(
      `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${targetUser};`
    );
    await dbClient.end();
  } catch (err: any) {
    console.warn('[EmbeddedPG Init DB Warning]:', err.message);
  } finally {
    await client.end().catch(() => {});
  }
}
