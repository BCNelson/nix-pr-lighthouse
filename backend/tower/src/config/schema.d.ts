interface TowerConfigInterface {
    port: number;
    logLevel: string;
    db: {
        host: string;
        port: number;
        database: string;
        user: string;
        password: string;
        migrationPath: string;
    };
}

export type TowerConfig = Readonly<TowerConfigInterface>;