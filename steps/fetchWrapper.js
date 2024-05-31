// fetchWrapper.js
const fetch = import('node-fetch').then(module => module.default);
module.exports = fetch;