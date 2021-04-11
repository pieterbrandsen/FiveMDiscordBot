const { MessageEmbed } = require('discord.js');

const languageConfig = require(`../../../user/languages/${require('../../../user/config').language}`);

const commandObject = languageConfig.commands.basic.ip;
const { commandText } = commandObject;
const { text } = commandObject;
const { returnText } = commandObject;
const { logText } = commandObject;

module.exports = {
  name: commandText.name,
  description: commandText.description,
  usage: commandText.usage,
  example: commandText.example,
  args: commandText.args,
  permission: commandText.permission,
  execute(client, args, interaction) {
    const embed = new MessageEmbed()
      .setTitle('Test')
      .setDescription(args)
      .setAuthor(interaction.member.user.username);
    return embed;
  },
};
