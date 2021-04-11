const { ChildLogger } = require('leekslazylogger');

const log = new ChildLogger();

module.exports = {
  event: 'error',
  execute(client, [e]) {
    log.error(e);
  },
};
