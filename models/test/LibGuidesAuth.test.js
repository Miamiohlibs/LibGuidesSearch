const config = require('config');
realConfig = config.get('libGuides');

describe('LibGuidesAuth', () => {
  let LibGuidesAuth;
  let libGuidesAuth;

  beforeAll(() => {
    jest.resetModules();
    LibGuidesAuth = require('../../models/LibGuidesAuth');
    libGuidesAuth = new LibGuidesAuth(realConfig);
  });

  it('should initialize with correct configuration', () => {
    expect(libGuidesAuth.clientId).toBeDefined();
    expect(libGuidesAuth.clientSecret).toBeDefined();
    expect(libGuidesAuth.baseUrl).toBeDefined();
  });

  it('should have a getAuthToken method', () => {
    expect(typeof libGuidesAuth.getAuthToken).toBe('function');
  });
});
