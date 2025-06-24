/* 
    This script fetches librarians from LibGuides using the LibGuides API
    and saves the results to a file: ./cache/Librarians.json
*/

const LibGuidesAuth = require('./models/LibGuidesAuth');
const config = require('config');
const libGuidesConfig = config.get('libGuides');
const libGuidesAuth = new LibGuidesAuth(libGuidesConfig);
const axios = require('axios');
const fs = require('fs');

(async () => {
  try {
    const token = await libGuidesAuth.getAuthToken();
    // console.log('LibGuides Auth Token:', token.access_token);

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
    // Save librarians to a file
    const librariansFile = './cache/Librarians.json';
    fs.writeFileSync(librariansFile, JSON.stringify(librarians, null, 2));
    console.log(`Librarians saved to ${librariansFile}`);
  } catch (error) {
    console.error('Error fetching librarians:', error.message);
  }
})();
