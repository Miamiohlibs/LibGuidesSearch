const LibGuidesAuth = require('./models/LibGuidesAuth');
const config = require('config');
const libGuidesConfig = config.get('libGuides');
const libGuidesAuth = new LibGuidesAuth(libGuidesConfig);
const axios = require('axios');

(async () => {
  try {
    const token = await libGuidesAuth.getAuthToken();
    console.log('LibGuides Auth Token:', token.access_token);

    // Fetch librarians
    const response = await axios.get(
      `${libGuidesConfig.baseUrl}/1.2/accounts`,
      {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      }
    );

    const librarians = response.data;
    console.log(JSON.stringify(librarians, null, 2));
  } catch (error) {
    console.error('Error fetching librarians:', error.message);
  }
})();
