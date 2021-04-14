const { MessageEmbed } = require('discord.js');

const languageConfig = require(`../../../user/languages/${require('../../../user/config').language}`);

const commandObject = languageConfig.commands.basic.ping;
const { commandText } = commandObject;
const { text } = commandObject;
const { returnText } = commandObject;
const { logText } = commandObject;

module.exports = {
  name: commandText.name,
  description: commandText.description,
  permission: commandText.permission,
  execute(client, args, interaction, {config}) {
    const embed = new MessageEmbed()
      .setTitle('Pong!')
      .setDescription(returnText.currentPing.replace("{{ value }}", client.ws.ping))
      .setColor(config.colour);
    return embed;
  },
};
