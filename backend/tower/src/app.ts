import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import type { TowerConfig } from './config/schema.js';
import postgressPlugin from './repositories/postgres.js';

type CreateAppConfig = Pick<TowerConfig, 'logLevel' | 'db'>;

export default function createApp(config: CreateAppConfig): FastifyInstance {
  const app = Fastify({
    logger: {
      level: config.logLevel,
    },
  });
  app.register(postgressPlugin(config.db));
  app.get('/', async () => {
    return { hello: 'world' };
  });
  return app;
}