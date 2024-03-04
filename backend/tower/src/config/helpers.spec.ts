import t from 'tap';
import { GetNumaricEnvWithDefault, GetEnvWithDefault } from './helpers.js';

t.before(() => {
  process.env.TEST_VAR = 'Before';
})

t.test('GetNumaricEnvWithDefault - should return default value if environment variable is undefined', (t) => {
  delete process.env.TEST_VAR;
  const defaultValue = 10;
  const result = GetNumaricEnvWithDefault('TEST_VAR', defaultValue);
  t.equal(result, defaultValue);
  process.env.TEST_VAR = 'Before';
  t.end();
});

t.test('GetNumaricEnvWithDefault - should return default value if environment variable is not a number', (t) => {
  t.sinon.replace(process.env, 'TEST_VAR', 'abc');
  const defaultValue = 10;
  const result = GetNumaricEnvWithDefault('TEST_VAR', defaultValue);
  t.equal(result, defaultValue);
  t.end();
});

t.test('GetNumaricEnvWithDefault - should return parsed numeric value from environment variable', (t) => {
  t.sinon.replace(process.env, 'TEST_VAR', '20');
  const defaultValue = 10;
  const result = GetNumaricEnvWithDefault('TEST_VAR', defaultValue);
  t.equal(result, 20);
  t.end();
});

t.test('GetEnvWithDefault - should return default value if environment variable is undefined', (t) => {
  delete process.env.TEST_VAR;
  const defaultValue = 'default';
  const result = GetEnvWithDefault('TEST_VAR', defaultValue);
  t.equal(result, defaultValue);
  process.env.TEST_VAR = 'Before';
  t.end();
});

t.test('GetEnvWithDefault - should return value from environment variable', (t) => {
  t.sinon.replace(process.env, 'TEST_VAR', 'value');
  const defaultValue = 'default';
  const result = GetEnvWithDefault('TEST_VAR', defaultValue);
  t.equal(result, 'value');
  t.end();
});