const { MessageEmbed } = require('discord.js');

const commandObject = require('../../modules/languageConfig').get('commands', 'ip');

const { commandText } = commandObject;
const { returnText } = commandObject;

module.exports = {
  name: commandText.name,
  description: commandText.description,
  permission: commandText.permission,
  execute(client, args, interaction, { guildConfig }) {
    const embed = new MessageEmbed()
    .setTitle(returnText.pingEmbed.title.replace('{{ serverIp }}', guildConfig.serverIp))
    .setDescription(returnText.pingEmbed.description)
      .setFooter(guildConfig.footerText)
      .setColor(guildConfig.embedColor);
    return embed;
  },
};
