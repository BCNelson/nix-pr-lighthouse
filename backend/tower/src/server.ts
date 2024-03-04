import createApp from "./app.js";
import GetConfig from "./config/index.js";

const config = GetConfig();
const app = createApp(config);


app.listen({
  port: config.port,
}, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  app.log.info(`Server listening at ${address}`);
});

async function shutdown() {
  app.log.info('Shutting down Tower');
  await app.close();
}

process.once('unhandledRejection', async (err) => {
  app.log.error(err, 'Unhandled rejection');
  shutdown();
});

process.once('uncaughtException', async (err) => {
  app.log.error(err, 'Uncaught exception');
  shutdown();
});

process.once('SIGINT', () => {
  app.log.info('Received SIGINT shutting down');
  process.once('SIGINT', () => {
    app.log.error('Second SIGINT received');
    process.exit(1);
  });
  shutdown();
});

process.on('SIGTERM', () => {
  app.log.info('Received SIGTERM');
  setTimeout(() => {
    app.log.error('Shutdown timed out');
    process.exit(1);
  }, 15000).unref();
  shutdown();
});
