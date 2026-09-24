import { Sequelize, Transaction } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl =
  process.env.DATABASE_URL || 'postgresql://frd_user:frd_password@localhost:5432/frd_db';

export const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 15,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: true,
  },
});

/**
 * Executes a database operation within a transaction that sets RLS local session variables.
 * @param clientId UUID of the current authenticated client (if client role)
 * @param role 'client' | 'admin'
 * @param callback Async function executing queries inside the RLS-scoped transaction
 */
export async function withRLSTransaction<T>(
  clientId: string | null,
  role: 'client' | 'admin',
  callback: (transaction: Transaction) => Promise<T>
): Promise<T> {
  return await sequelize.transaction(async (transaction) => {
    // Set RLS variables inside this specific local transaction
    if (clientId) {
      await sequelize.query(`SET LOCAL app.current_client_id = '${clientId}';`, { transaction });
    } else {
      await sequelize.query(
        `SET LOCAL app.current_client_id = '00000000-0000-0000-0000-000000000000';`,
        { transaction }
      );
    }
    await sequelize.query(`SET LOCAL app.role = '${role}';`, { transaction });

    return await callback(transaction);
  });
}
