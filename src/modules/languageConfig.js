const fs = require('fs');

let languageObject = null;

module.exports = {
  set(language) {
    const languageJsonString = fs.readFileSync(`user/languages/${language}.json`, 'utf8');
    languageObject = JSON.parse(languageJsonString);
  },
  get: (category, commandName) => languageObject[category][commandName],
};
