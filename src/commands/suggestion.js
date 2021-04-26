const { MessageEmbed } = require('discord.js');

const commandObject = require('../modules/languageConfig').get('commands', 'suggestion');

const { text, commandText, returnText } = commandObject;

module.exports = {
  name: commandText.name,
  description: commandText.description,
  permission: commandText.permission,
  options: commandText.options,
  async execute(client, args, interaction, { member, guildConfig, channel }) {
    if (guildConfig.suggestionSystem.enabled.toLowerCase() !== 'true') return new MessageEmbed().setTitle(returnText.suggestionNotEnabled.title);

    const suggestionChannel = client.channels.cache.get(guildConfig.suggestionSystem.channelId);

    if (suggestionChannel === null) {
      return new MessageEmbed()
        .setTitle(returnText.noSuggestionChannelEmbed.title)
        .setDescription(returnText.noSuggestionChannelEmbed.description)
        .setColor(guildConfig.embedColor)
        .setFooter(guildConfig.footerText);
    }

    if (args[0].name === commandText.subNames[0]) {
      const title = args[0].options[0].value;
      const message = args[0].options[1].value;
      const suggestionEmbed = new MessageEmbed()
        .setTitle(title)
        .setDescription(message)
        .setAuthor(returnText.suggestionFrom.replace('{{ displayName }}', member.displayName))
        .setColor(guildConfig.embedColor)
        .setFooter(guildConfig.footerText);

      const msg = await suggestionChannel.send(suggestionEmbed);
      await msg.react('👍');
      await msg.react('👎');

      if (guildConfig.suggestionSystem.discussionChannelEnabled) {
        const suggestionDiscussionChannel = client.channels.cache.get(
          guildConfig.suggestionSystem.discussionChannelId,
        );
        if (suggestionDiscussionChannel == null) {
          channel.send(new MessageEmbed()
            .setTitle(returnText.noSuggestionDiscussionChannelEmbed.title)
            .setDescription(returnText.noSuggestionDiscussionChannelEmbed.description)
            .setColor(guildConfig.embedColor)
            .setFooter(guildConfig.footerText));
        } else {
          const discussionChannelMsg = new MessageEmbed()
            .setTitle(text.suggestionDiscussion.title)
            .setDescription(text.suggestionDiscussion.description.replace('{{ messageTitle }}', title).replace('{{ messageDescription }}', message))
            .setAuthor(returnText.suggestionFrom.replace('{{ displayName }}', member.displayName))
            .setColor(guildConfig.embedColor)
            .setFooter(guildConfig.footerText);
          await suggestionDiscussionChannel.send(discussionChannelMsg);
        }
      }

      const embed = new MessageEmbed().setTitle(returnText.createdSuggestion.title).setDescription(returnText.createdSuggestion.description.replace('{{ suggestionChannelId }}', guildConfig.suggestionSystem.channelId)).setFooter(guildConfig.footerText);
      return embed;
    }

    return undefined;
  },
};
