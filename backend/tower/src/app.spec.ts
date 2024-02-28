import t from 'tap';
import createApp from './app.js';


t.test('GET /', async (t) => {
  const app = createApp({ logLevel: 'silent'});
  const response = await app.inject({
    method: 'GET',
    url: '/',
  });
  t.equal(response.statusCode, 200);
  t.same(response.json(), { hello: 'world' });
});