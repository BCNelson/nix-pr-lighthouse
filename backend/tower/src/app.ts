import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import type { TowerConfig } from './config/schema.js';

type CreateAppConfig = Pick<TowerConfig, 'logLevel'>;

export default function createApp(config: CreateAppConfig): FastifyInstance {
  const app = Fastify({
    logger: {
      level: config.logLevel,
    },
  });
  app.get('/', async () => {
    return { hello: 'world' };
  });
  return app;
}