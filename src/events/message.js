const { Collection, MessageEmbed } = require('discord.js');
const { ChildLogger } = require('leekslazylogger');

const log = new ChildLogger();

const languageName = require('../../user/config').language;

const languageConfig = require(`../../user/languages/${languageName}`);

const eventObject = languageConfig.events.message;
const { text } = eventObject;
const { returnText } = eventObject;
const { logText } = eventObject;

module.exports = {
  event: 'message',
  async execute(client, [message]) {
    if (message.channel.type == 'dm') {
      log.console(logText.dmMessage.replace('{{ username }}', message.author.tag).replace('{{ cleanMessage }}', message.cleanContent));
    }
  },
};
