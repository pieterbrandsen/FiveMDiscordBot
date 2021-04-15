const { MessageEmbed } = require('discord.js');

const languageConfig = require(`../../../user/languages/${require('../../../user/config').language}`);

const commandObject = languageConfig.commands.config;
const { commandText } = commandObject;
const { text } = commandObject;
const { returnText } = commandObject;
const { logText } = commandObject;

module.exports = {
  name: commandText.name,
  description: commandText.description,
  permission: commandText.permission,
  execute(client, args, interaction, {config}) {
    if (args[0].name == commandText.subNames[0]) {
    const embed = new MessageEmbed()
      .setTitle('Pong!')
      .setColor(config.colour);
    return embed;
    }
  },
};
