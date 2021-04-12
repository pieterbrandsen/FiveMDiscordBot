const { Collection, MessageEmbed } = require('discord.js');
const { ChildLogger } = require('leekslazylogger');

const log = new ChildLogger();
const archive = require('../modules/archive');

const languageConfig = require(`../../user/languages/${require('../../user/config').language}`);

const eventObject = languageConfig.events.message;
const { text } = eventObject;
const { returnText } = eventObject;
const { logText } = eventObject;

module.exports = {
  event: 'message',
  async execute(client, [message], {
    config, Ticket, Solicitation, Setting,
  }) {
    if (message.channel.type == "dm") {
      log.console(logText.dmMessage.replace("{{ username }}", message.author.tag).replace("{{ cleanMessage }}", message.cleanContent));
    }

    /**
		 * Ticket transcripts
		 * (bots currently still allowed)
		 */

    const ticket = await Ticket.findOne({ where: { channel: message.channel.id } });
    if (ticket) archive.add(message, 'ticket'); // add message to archive
  },
};
