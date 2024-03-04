import postgres from "postgres";
import type fastify from "fastify";
import StaticMigrator from "./staticMigrator.js";

import migrations from "@static/migrations/index.js";


export type PostgressConfig = {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
};


export default function (options: PostgressConfig): fastify.FastifyPluginCallback {
 return (fastify: fastify.FastifyInstance, opts: fastify.FastifyPluginOptions, done: fastify.HookHandlerDoneFunction) => {
    if (!fastify.sql) {
        const sql = postgres({
            ssl: "prefer",
            connection : {
                application_name: "tower",
            },
            ...options
        });
        
        fastify.decorate("sql", sql);
        fastify.addHook("onClose", (instance, done) => {
            sql.end().finally(done);
        });
        sql.reserve().then((reservedConn) => {
            const migrator = new StaticMigrator(migrations, {
                driver: 'pg',
                database: options.database,
                execQuery: async (query) => {
                    fastify.log.debug("Migration Query: %s", query);
                    return {
                        rows: await reservedConn.unsafe(query)
                    }
                },
            });
            return migrator.migrate().finally(() => reservedConn.release());
        }).then(() => done()).catch((e) => done(e));
    } else {
        fastify.log.error("sql has already been registered");
        done();
    }
    
}}
