const { ChildLogger } = require('leekslazylogger');

const log = new ChildLogger();

module.exports = {
  name: 'debug',
  execute(client, [e]) {
    log.debug(e);
  },
};
