import config from 'config';

export default class Results {
  constructor() {
    this.results = [];
  }

  addResult(result, term) {
    // console.log(`Adding result for term: ${term}`);
    // Check if the result already exists in the results array
    // If it exists, add the term to the existing result
    // If it does not exist, add it as a new result
    let existingResultId = this.findExistingResult(result.id);

    if (existingResultId >= 0) {
      // If the result already exists, add the term to it
      this.addTermToResult(existingResultId, term);
    } else {
      // If the result does not exist, add it as a new result
      result.terms = [term]; // Initialize terms array with the first term
      this.addNewResult(result);
    }
  }
  addNewResult(result) {
    this.results.push(result);
  }

  addTermToResult(existingResultId, term) {
    if (!this.results[existingResultId].terms.includes(term)) {
      this.results[existingResultId].terms.push(term);
    }

    // console.log(
    //   `Added term "${term}" to existing result with ID: ${this.results[existingResultId].id}`
    // );
  }

  findExistingResult(id) {
    return this.results.findIndex((result) => result.id === id);
  }

  getResults() {
    return this.results;
  }

  clearResults() {
    this.results = [];
  }
}
