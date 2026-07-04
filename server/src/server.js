const { createApp } = require('./app');
const env = require('./config/env');
const { connectDB, mongoose } = require('./config/db');

async function start() {
  await connectDB(env.mongoUri);
  const app = createApp();

  const server = app.listen(env.port, () => {
    console.log(`HRMS API server running on port ${env.port} [${env.nodeEnv}]`);
  });

  process.on('SIGTERM', () => shutdown(server));
  process.on('SIGINT', () => shutdown(server));
}

async function shutdown(server) {
  console.log('Shutting down gracefully...');
  server.close(async () => {
    await mongoose.disconnect();
    process.exit(0);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
