const { ChildLogger } = require('leekslazylogger');

const log = new ChildLogger();

const eventObject = require('../modules/languageConfig').get('events', 'message');

const { logText } = eventObject;

module.exports = {
  name: 'message',
  async execute(client, [message]) {
    const member = message.member;
    if (member.id == client.user.id) return;    

    if (message.channel.type === 'dm') {
      log.console(logText.dmMessage
        .replace('{{ username }}', message.author.tag)
        .replace('{{ cleanMessage }}', message.cleanContent));
    }
    else {
      log.console(logText.normalMessage
        .replace('{{ username }}', message.author.tag)
        .replace('{{ cleanMessage }}', message.cleanContent));
    }
  },
};
