import { TowerConfig } from "./schema.js";
import { GetNumaricEnvWithDefault } from "./helpers.js";

let config: Readonly<TowerConfig> | undefined = undefined;

function CreateConfig(): TowerConfig {
  return {
    port: GetNumaricEnvWithDefault("PORT", 3000),
    logLevel: process.env.LOG_LEVEL || "info",
  };
}

export default function GetConfig():  Readonly<TowerConfig> {
  if (config === undefined) {
    config = Object.freeze(CreateConfig());
  }
  return config;
}