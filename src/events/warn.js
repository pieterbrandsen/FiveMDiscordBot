const { ChildLogger } = require('leekslazylogger');

const log = new ChildLogger();

module.exports = {
  name: 'warn',
  execute(client, [e]) {
    log.warn(e);
  },
};
