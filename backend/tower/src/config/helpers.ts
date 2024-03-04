

export function GetNumaricEnvWithDefault(name: string, defaultValue: number): number {
  const value = process.env[name];
  if (value === undefined) {
    return defaultValue;
  }
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    return defaultValue;
  }
  return parsed;
}

export function GetEnvWithDefault(name: string, defaultValue: string): string {
  const value = process.env[name];
  if (value === undefined) {
    return defaultValue;
  }
  return value;
}