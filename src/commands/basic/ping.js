const { MessageEmbed } = require('discord.js');

const commandObject = require('../../modules/languageConfig').get('commands', 'ping');

const { commandText } = commandObject;
const { returnText } = commandObject;

module.exports = {
  name: commandText.name,
  description: commandText.description,
  permission: commandText.permission,
  execute(client, args, interaction, { config }) {
    const embed = new MessageEmbed()
      .setTitle('Pong!')
      .setDescription(returnText.currentPing.replace('{{ value }}', client.ws.ping))
      .setColor(config.colour);
    return embed;
  },
};
