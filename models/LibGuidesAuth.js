const config = require('config');
const axios = require('axios');
// const { getLogger } = require('../utils/logger');

class LibGuidesAuth {
  constructor(libGuidesConfig) {
    this.clientId = libGuidesConfig.clientId;
    this.clientSecret = libGuidesConfig.clientSecret;
    this.baseUrl = libGuidesConfig.baseUrl;
    // this.logger = getLogger('LibGuidesAuth');
  }

  async getAuthToken() {
    try {
      console.log(`${this.libGuidesUrl}/1.2/oauth/token`);
      const response = await axios.post(`${this.baseUrl}/1.2/oauth/token`, {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials',
      });
      return response.data;
    } catch (error) {
      console.error('Error getting LibGuides auth token:', error.message);
      throw new Error('Failed to authenticate with LibGuides');
    }
  }
}

module.exports = LibGuidesAuth;
