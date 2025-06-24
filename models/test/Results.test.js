const Results = require('../Results');
const mapsResult = require('./sample-data/search-results-maps.json');
const geospatialResult = require('./sample-data/search-results-geospatial.json');

// use jest to test the Results model
describe('Results Model: addNewResult', () => {
  let results;

  beforeEach(() => {
    results = new Results();
  });

  it('should add a new result', () => {
    results.addNewResult({ id: 1, title: 'Test Result' });
    expect(results.getResults()).toHaveLength(1);
    expect(results.getResults()[0].id).toBe(1);
  });

  it('should add multiple new results', () => {
    results.addNewResult({ id: 1, title: 'Test Result' });
    results.addNewResult({ id: 2, title: 'Another Test Result' });
    expect(results.getResults()).toHaveLength(2);
  });
});

//addTermToResult(existingResultId, term) {

describe('Results Model: addTermToResult', () => {
  let results;

  beforeEach(() => {
    results = new Results();
    results.addNewResult({
      id: 1,
      title: 'Test Result',
      terms: ['predetermined'],
    });
  });

  afterEach(() => {
    results.clearResults();
  });

  it('should add a term to an existing result', () => {
    results.addTermToResult(0, 'maps');
    expect(results.getResults()[0].terms).toHaveLength(2);
    expect(results.getResults()[0].terms).toContain('maps');
    expect(results.getResults()[0].terms).toContain('predetermined');
  });

  it('should not duplicate terms in an existing result', () => {
    results.addTermToResult(0, 'maps');
    results.addTermToResult(0, 'maps');
    expect(results.getResults()[0].terms).toHaveLength(2);
    expect(results.getResults()[0].terms).toContain('maps');
    expect(results.getResults()[0].terms).toContain('predetermined');
  });
});

describe('Results Model: findExistingResult', () => {
  let results;

  beforeEach(() => {
    results = new Results();
    results.addNewResult({ id: 1, title: 'Test Result' });
    results.addNewResult({ id: 2, title: 'Another Test Result' });
  });

  it('should find an existing result by ID', () => {
    const index = results.findExistingResult(1);
    expect(index).toBe(0);
  });

  it('should return -1 for a non-existing result', () => {
    const index = results.findExistingResult(3);
    expect(index).toBe(-1);
  });
});

describe('Results Model: addResult', () => {
  it('should add a new result with terms', () => {
    const results = new Results();
    const result = { id: 1, title: 'Test Result' };
    results.addResult(result, 'maps');
    expect(results.getResults()).toHaveLength(1);
    expect(results.getResults()[0].id).toBe(1);
    expect(results.getResults()[0].terms).toContain('maps');
  });
  it('should add a term to an existing result', () => {
    const results = new Results();
    const result = { id: 1, title: 'Test Result' };
    results.addResult(result, 'maps');
    results.addResult(result, 'geospatial');
    expect(results.getResults()).toHaveLength(1);
    expect(results.getResults()[0].terms).toContain('maps');
    expect(results.getResults()[0].terms).toContain('geospatial');
  });
});
