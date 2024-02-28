import t from 'tap';
import { GetNumaricEnvWithDefault } from './helpers.js';

t.test('GetNumaricEnvWithDefault - should return default value if environment variable is undefined', (t) => {
  const defaultValue = 10;
  const result = GetNumaricEnvWithDefault('TEST_VAR', defaultValue);
  t.equal(result, defaultValue);
  t.end();
});

t.test('GetNumaricEnvWithDefault - should return default value if environment variable is not a number', (t) => {
  process.env.TEST_VAR = 'abc';
  const defaultValue = 10;
  const result = GetNumaricEnvWithDefault('TEST_VAR', defaultValue);
  t.equal(result, defaultValue);
  t.end();
});

t.test('GetNumaricEnvWithDefault - should return parsed numeric value from environment variable', (t) => {
  process.env.TEST_VAR = '20';
  const defaultValue = 10;
  const result = GetNumaricEnvWithDefault('TEST_VAR', defaultValue);
  t.equal(result, 20);
  t.end();
});