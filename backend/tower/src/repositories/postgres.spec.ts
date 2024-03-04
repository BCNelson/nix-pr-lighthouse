import t from 'tap';


t.test('Postgres Plugin', async (t) => {
  t.test('should register the sql decorator', async (t) => {
    const fakeReserve = {
      release: t.sinon.fake.returns(Promise.resolve()),
      unsafe: t.sinon.fake.returns(Promise.resolve())
    };
    const returnedSQL = {
      end: t.sinon.fake.returns(Promise.resolve()),
      reserve: t.sinon.fake.returns(Promise.resolve(fakeReserve))
    };
    const postgresFake = t.sinon.fake.returns(returnedSQL);
    const fastifyInstanceFake = {
      decorate: t.sinon.fake(),
      addHook: t.sinon.fake(),
      log: {
        debug: t.sinon.fake()
      }
    };

    const migrateP = Promise.resolve();

    const MockStaticMigrator = t.sinon.fake()
    MockStaticMigrator.prototype.migrate = t.sinon.fake.returns(migrateP);

    const doneFake = t.sinon.fake();

    const migrations: Array<never> = [];
    
    const postgressPlugin = await t.mockImport<typeof import('./postgres.js')>('./postgres.js', {
      postgres: postgresFake,
      "@static/migrations/index.js": migrations,
      "./staticMigrator.js": MockStaticMigrator
    });
    postgressPlugin.default({} as never)(fastifyInstanceFake as never, {}, doneFake);

    t.ok(postgresFake.calledOnce, 'postgres should be called once');
    t.ok(fastifyInstanceFake.decorate.calledOnceWith('sql', returnedSQL), 'decorate should be called once with sql');
    t.ok(fastifyInstanceFake.addHook.calledOnce, 'addHook should be called once');
    t.ok(returnedSQL.reserve.calledOnce, 'sql.reserve should be called once');
    await Promise.resolve().then(()=> returnedSQL.reserve.firstCall.returnValue);
    await Promise.resolve().then(()=> migrateP);


    t.ok(MockStaticMigrator.calledOnce, 'StaticMigrator should be called once');
    t.ok(MockStaticMigrator.firstCall.args[0] === migrations, 'StaticMigrator should be called with migrations');
    t.ok(MockStaticMigrator.firstCall.args[1].driver === 'pg', 'StaticMigrator should be called with driver pg');
    t.ok(MockStaticMigrator.firstCall.args[1].database === undefined, 'StaticMigrator should be called with database undefined');
    t.ok(typeof MockStaticMigrator.firstCall.args[1].execQuery === 'function', 'StaticMigrator should be called with execQuery function');
    t.ok(MockStaticMigrator.firstCall.args[1].execQuery('query') instanceof Promise, 'execQuery should return a promise');
    t.ok(fakeReserve.unsafe.calledOnceWith('query'), 'unsafe should be called once with query');

    

    
    t.ok(fakeReserve.release.calledOnce, 'sql.release should be called once');

    await fakeReserve.release.firstCall.returnValue;
    t.ok(doneFake.calledOnce, 'done should be called once');
    t.ok(fastifyInstanceFake.addHook.firstCall.args[0] === 'onClose', 'addHook should be called with onClose');
    t.ok(typeof fastifyInstanceFake.addHook.firstCall.args[1] === 'function', 'addHook should be called with a function');
    t.ok(returnedSQL.end.notCalled, 'sql.end should not be called before the onClose hook is called');
    fastifyInstanceFake.addHook.firstCall.args[1](null, doneFake);
    t.ok(returnedSQL.end.calledOnce, 'sql.end should be called once');
    await returnedSQL.end.firstCall.returnValue;
    t.ok(doneFake.calledTwice, 'done should be called after in the onClose hook');
  });

  t.test('should throw an error if sql has already been registered', async (t) => {
    const retrunedSQL = {};
    const postgresFake = t.sinon.fake.returns(retrunedSQL);
    const fastifyInstanceSpy = {
      sql: true,
      log:{
        error: t.sinon.fake()
      },
      decorate: t.sinon.spy(),
      addHook: t.sinon.spy()
    };

    const doneFake = t.sinon.fake();
    
    const postgressPlugin = await t.mockImport<typeof import('./postgres.js')>('./postgres.js', {
      postgres: postgresFake,
      "@static/migrations/index.js": [],
      "./staticMigrator.js": {}
    });
    postgressPlugin.default({} as never)(fastifyInstanceSpy as never, {}, doneFake);

    t.ok(postgresFake.notCalled, 'postgres should not be setup if sql has already been registered');
    t.ok(fastifyInstanceSpy.decorate.notCalled, 'decorate should not be called');
    t.ok(fastifyInstanceSpy.addHook.notCalled, 'addHook should not be called');
    t.ok(fastifyInstanceSpy.log.error.calledOnce, 'log.error should be called once');
  });
});
