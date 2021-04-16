const { Collection, MessageEmbed } = require('discord.js');
const { ChildLogger } = require('leekslazylogger');

const log = new ChildLogger();

const config = require('../../user/config');
const languageConfig = require(`../../user/languages/${config.language}`);

const eventObject = languageConfig.events.message;
const { text } = eventObject;
const { returnText } = eventObject;
const { logText } = eventObject;

module.exports = {
  event: 'message',
  async execute(client, [message], {
    config, Setting,
  }) {
    if (message.channel.type == "dm") {
      log.console(logText.dmMessage.replace("{{ username }}", message.author.tag).replace("{{ cleanMessage }}", message.cleanContent));
    }
  },
};
