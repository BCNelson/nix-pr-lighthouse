import { TowerConfig } from "./schema.js";
import { GetEnvWithDefault, GetNumaricEnvWithDefault } from "./helpers.js";

let config: Readonly<TowerConfig> | undefined = undefined;

function CreateConfig(): TowerConfig {
  return {
    port: GetNumaricEnvWithDefault("PORT", 3000),
    logLevel: GetEnvWithDefault("LOG_LEVEL", "debug"),
    db: {
      host: GetEnvWithDefault("DB_HOST", "localhost"),
      port: GetNumaricEnvWithDefault("DB_PORT", 5432),
      database: GetEnvWithDefault("DB_DATABASE", "lighthouse"),
      user: GetEnvWithDefault("DB_USER", "tower"),
      password: GetEnvWithDefault("DB_PASSWORD", "password"),
      migrationPath: GetEnvWithDefault("DB_MIGRATION_PATH", "migrations"),
    }
  };
}

export default function GetConfig():  Readonly<TowerConfig> {
  if (config === undefined) {
    config = Object.freeze(CreateConfig());
  }
  return config;
}