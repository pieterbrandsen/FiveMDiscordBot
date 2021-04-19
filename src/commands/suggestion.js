const { MessageEmbed } = require('discord.js');

const commandObject = require('../modules/languageConfig').get('commands', 'suggestion');

const { commandText } = commandObject;
const { returnText } = commandObject;

module.exports = {
  name: commandText.name,
  description: commandText.description,
  permission: commandText.permission,
  options: commandText.options,
  async execute(client, args, interaction, { member, config }) {
    if (config.suggestion.enabled.toLowerCase() !== 'true') {
      return new MessageEmbed().setTitle(returnText.suggestionNotEnabled.title);
    }

    const suggestionChannel = client.channels.cache.get(config.suggestionChannelId);

    if (suggestionChannel === null) {
      return new MessageEmbed()
        .setTitle(returnText.noSuggestionChannelEmbed.title)
        .setDescription(returnText.noSuggestionChannelEmbed.description);
    }

    if (args[0].name === commandText.subNames[0]) {
      const title = args[0].options[0].value;
      const message = args[0].options[1].value;
      const suggestionEmbed = new MessageEmbed()
        .setTitle(title)
        .setDescription(message)
        .setFooter(returnText.suggestionFrom.replace('{{ displayName }}', member.displayName))
        .setColor(config.colour);

      const msg = await suggestionChannel.send(suggestionEmbed);
      await msg.react('👍');
      await msg.react('👎');

      const embed = new MessageEmbed().setTitle(returnText.createdSuggestion.title).setDescription(returnText.createdSuggestion.description.replace('{{ suggestionChannelId }}', config.suggestionChannelId));
      return embed;
    }

    return undefined;
  },
};
