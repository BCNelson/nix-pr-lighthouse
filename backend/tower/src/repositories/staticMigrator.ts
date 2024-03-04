import Postgrator from 'postgrator';

interface StaticMigration extends Omit<Postgrator.Migration, 'getSql'> {
    sql: string;
}

export default class StaticMigrator extends Postgrator {
    migrations: Array<Postgrator.Migration>;

    constructor(migrationScripts: Array<StaticMigration>, options: Postgrator.Options) {
        super(options);
        this.migrations = migrationScripts.map((migration) => {
            const ret:Postgrator.Migration = {
                ...migration,
                getSql: () => migration.sql
            }
            // @ts-expect-error: It is safe to delete a propery that is not in the interface
            delete ret.sql;
            return ret;
        });
    }

    async getMigrations(): Promise<Postgrator.Migration[]> {
        return this.migrations;
    }
}