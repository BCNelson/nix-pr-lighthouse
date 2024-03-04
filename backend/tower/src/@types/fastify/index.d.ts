import type postgres from 'postgres';

declare module 'fastify' {
  export interface FastifyInstance {
    sql: postgres.Sql<NonNullable<unknown>>;
  }
}