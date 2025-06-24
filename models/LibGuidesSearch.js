const config = require('config');
const axios = require('axios');

class LibGuidesSearch {
  constructor(token) {
    this.token = token;
    this.baseUrl = config.get('libGuides.baseUrl');
  }

  async searchGuides(query) {
    try {
      const response = await axios.get(`${this.baseUrl}/1.2/guides`, {
        params: { search_terms: query, sort_by: 'relevance' },
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching LibGuides:', error.message);
      throw new Error('Failed to search LibGuides');
    }
  }
}
module.exports = LibGuidesSearch;
