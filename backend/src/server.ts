import app from './app';
import { ensurePostgresRunning } from './config/embeddedPg';
import { sequelize } from './config/database';
import { applyRLSPolicies } from './config/rlsMigrations';

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    await ensurePostgresRunning();
    await sequelize.sync();
    await applyRLSPolicies();

    app.listen(PORT, () => {
      console.log(
        `[FRD Backend] Running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`
      );
    });
  } catch (error) {
    console.error('[FRD Backend Startup Error]:', error);
    process.exit(1);
  }
}

startServer();
