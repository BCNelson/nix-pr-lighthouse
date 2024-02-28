interface TowerConfigInterface {
    port: number;
    logLevel: string;
}

export type TowerConfig = Readonly<TowerConfigInterface>;