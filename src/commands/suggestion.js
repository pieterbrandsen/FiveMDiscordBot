const { MessageEmbed } = require('discord.js');

const languageConfig = require(`../../user/languages/${require('../../user/config').language}`);

const commandObject = languageConfig.commands.suggestion;
const { commandText } = commandObject;
const { text } = commandObject;
const { returnText } = commandObject;
const { logText } = commandObject;

module.exports = {
  name: commandText.name,
  description: commandText.description,
  permission: commandText.permission,
  options: commandText.options,
  execute(client, args, interaction, {member, config}) {
    if (args[0].name == commandText.subNames[0]) {
      const title = args[0].options[0].value;
      const message = args[0].options[1].value;
      const embed = new MessageEmbed()
      .setTitle(title)
      .setDescription(message)
      .setFooter(returnText.suggestionFrom.replace("{{ displayName }}", member.displayName))
      .setColor(config.colour);
      return embed;
    }
  },
};
