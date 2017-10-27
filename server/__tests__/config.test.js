import { assert } from 'chai';

// load the config file that will be tested
import configuration from 'server/config.js';

// Units that are allowed to be present in the config
const allowedDepthUnits = ['mm', '32th'];
const allowedPressureUnits = ['kpa', 'bar', 'psi'];
const allowedStorageToUse = ['local', 'session'];
const allowedLanguagesToUse = ['en', 'de'];

describe('Server: environment configuration', () => {
  let config;

  // load the service
  beforeEach(() => {
    config = configuration;
  });

  // storageToUse
  // depth: 'mm',
  // pressure: 'bar',
  // language: 'de',
  // minTread: 6,
  describe('options', () => {
    beforeEach(() => {
      config = configuration.options;
    });

    test('options should be defined', () => {
      expect(config).toBeDefined();
    });

    test('options should contain storageToUse', () => {
      expect(config.storageToUse).toBeDefined();
      assert.isString(config.storageToUse, 'is a string');
      expect(allowedStorageToUse).toContain(config.storageToUse); // one of 'local, session'
    });

    test('options should define language', () => {
      expect(config.language).toBeDefined();
      assert.isString(config.language, 'is a string');
      expect(allowedLanguagesToUse).toContain(config.language); // one of 'en, de'
    });

    test('options should define depth', () => {
      expect(config.depth).toBeDefined();
      assert.isString(config.depth, 'is a string');
      expect(allowedDepthUnits).toContain(config.depth); // one of 'mm, 32th'
    });

    test('options should define pressure', () => {
      expect(config.pressure).toBeDefined();
      assert.isString(config.pressure, 'is a string');
      expect(allowedPressureUnits).toContain(config.pressure); // one of 'kpa, bar, psi'
    });

    test('options should define minTread', () => {
      expect(config.minTread).toBeDefined();
      assert.isNumber(config.minTread, 'is a number');
      expect(config.minTread).toBeGreaterThanOrEqual(3);
      expect(config.minTread).toBeLessThanOrEqual(10);
    });
  });

  // offline: false,
  // host: '192.168.16.86',
  // port: 58378,
  // apiRoot: 'api',
  describe('Web API', () => {
    beforeEach(() => {
      config = configuration.webapi;
    });

    test('should be defined', () => {
      expect(config).toBeDefined();
    });
    test('should contain offline', () => {
      expect(config.offline).toBeDefined();
      assert.isBoolean(config.offline, 'is a boolean');
    });
    test('should not be offline', () => {
      expect(config.offline).toBe(false); // , 'is greater or equal to 3000');
    });
    test('should contain host', () => {
      expect(config.host).toBeDefined();
      assert.isString(config.host, 'is a string');
    });
    test('should contain port', () => {
      expect(config.port).toBeDefined();
      assert.isNumber(config.port, 'is a number');
      assert.isAtLeast(config.port, 3000, 'is greater or equal to 3000');
    });
    test('should contain apiRoot', () => {
      expect(config.apiRoot).toBeDefined();
      assert.isString(config.apiRoot, 'is a string');
    });
  });

  // secret: '6FakS4MZoToCrlYxR+dQxgUPBHOSS4R0cW0rwqzev77nWJzZn0nEssqJjKDuvlXj',
  // expire: 24 * 60 * 60,         // 1 day
  // apiExpire: 5 * 60             // 5 minutes
  describe('auth exists', () => {
    beforeEach(() => {
      config = configuration.auth;
    });

    test('should be defined', () => {
      expect(config).toBeDefined();
    });

    test('should contain secret', () => {
      expect(config.secret).toBeDefined();
      assert.isString(config.secret, 'is a string');
      expect(config.secret).toBeDefined(); // .to.have.length.above(50);
      // test for complexity ???
    });
    test('should contain expire', () => {
      expect(config.expire).toBeDefined();
      assert.isNumber(config.expire, 'is a number');
      assert.isAtLeast(config.expire, 86400, 'is greater or equal to 1 day');
    });
    test('should contain apiExpire', () => {
      expect(config.apiExpire).toBeDefined();
      assert.isNumber(config.apiExpire, 'is a number');
      assert.isAtLeast(config.apiExpire, 60, 'is greater or equal to 1 minute');
      assert.isBelow(config.apiExpire, 1800, 'timeout is below 30 minutes');
    });
  });

  // path: './mock',
  describe('mocks exists', () => {
    beforeEach(() => {
      config = configuration.mocks;
    });

    test('should be defined', () => {
      expect(config).toBeDefined();
    });

    test('should contain path', () => {
      expect(config.path).toBeDefined();
      assert.isString(config.path, 'is a string');
      // test for complexity ???
    });
  });

  // mongoURL
  // port
  // analytics
  // version
  describe('general', () => {
    test('mongoURL should be defined', () => {
      expect(config.mongoURL).toBeDefined();
      assert.isString(config.mongoURL, 'is a string');
    });
    test('port should be defined', () => {
      expect(config.port).toBeDefined();
      assert.isNumber(config.port, 'is a number');
    });
    test('analytics should be defined', () => {
      expect(config.analytics).toBeDefined();
      assert.isString(config.analytics, 'is a string');
    });
    test('version should be defined', () => {
      expect(config.version).toBeDefined();
      assert.isString(config.version, 'is a string');
    });
  });
});
