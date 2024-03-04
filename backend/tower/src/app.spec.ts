import t from 'tap';


t.test('GET /', async (t) => {
  const createApp = await t.mockImport<typeof import('./app.js')>('./app.js', {
    './repositories/postgres.js': () => (f: never, o: never, done: () => void) => done(),
  });
  const db = {};
  const app = createApp.default({ logLevel: 'silent', db:(db as never)});
  const response = await app.inject({
    method: 'GET',
    url: '/',
  });
  t.equal(response.statusCode, 200);
  t.same(response.json(), { hello: 'world' });
});