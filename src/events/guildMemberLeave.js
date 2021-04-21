const { ChildLogger } = require('leekslazylogger');

const log = new ChildLogger();
const eventObject = require('../modules/languageConfig').get('events', 'guildMemberRemove');

const { logText } = eventObject;

module.exports = {
  name: 'guildMemberRemove',
  execute(client, [member]) {
    log.info(logText.userLeftGuild.replace('{{ userTag }}', member.user.tag));
  },
};
