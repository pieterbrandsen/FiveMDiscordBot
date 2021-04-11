const { ChildLogger } = require('leekslazylogger');

const log = new ChildLogger();

module.exports = {
  event: 'debug',
  execute(client, [e]) {
    log.debug(e);
  },
};
