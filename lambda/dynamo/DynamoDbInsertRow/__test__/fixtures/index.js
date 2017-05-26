const normalizedPath = require('path').join(__dirname, '');
require('fs').readdirSync(normalizedPath).forEach((file) => {
  if (!file !== 'index.js') {
    global[file.replace('.js', '')] = require(normalizedPath + '/' + file);
  }
});
