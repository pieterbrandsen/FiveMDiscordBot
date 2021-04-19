const { ChildLogger } = require('leekslazylogger');

const log = new ChildLogger();

module.exports = {
  name: 'error',
  execute(client, [e]) {
    log.error(e);
  },
};
