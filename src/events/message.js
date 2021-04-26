const { ChildLogger } = require('leekslazylogger');

const log = new ChildLogger();

const eventObject = require('../modules/languageConfig').get('events', 'message');

const { logText } = eventObject;

module.exports = {
  name: 'message',
  async execute(client, [message]) {
    let invite = await message.channel.createInvite(
      {
        maxAge: 10 * 60 * 1000, // maximum time for the invite, in milliseconds
        maxUses: 1 // maximum times it can be used
      },
    );
    console.log(invite);

    if (message.author.id === client.user.id) return;

    if (message.channel.type === 'dm') {
      log.console(logText.dmMessage
        .replace('{{ username }}', message.author.tag)
        .replace('{{ cleanMessage }}', message.cleanContent));
    } else {
      log.console(logText.normalMessage
        .replace('{{ username }}', message.author.tag)
        .replace('{{ cleanMessage }}', message.cleanContent));
    }
  },
};
