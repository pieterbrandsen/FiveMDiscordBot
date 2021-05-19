const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

const commandObject = require('../modules/languageConfig').get('commands', 'verify');

const { text, commandText, returnText } = commandObject;

async function verifyUser(userId) {
  const link = 'https://api.weatherstack.com/current';
  const response = await fetch(`${link}?userId=${userId}`);
  const data = await response.json();
  return data;
}

module.exports = {
  name: commandText.name,
  description: commandText.description,
  options: commandText.options,
  async execute(client, args, interaction, { member, guildConfig, channel }) {
    let userIdToVerify = 0;
    if (guildConfig.verifySystem.selfVerifyingAllowed.ToLowerCase() === 'false' && args.length === 0) {
      userIdToVerify = member.id;
    } else if (!member.hasPermission(commandText.permission)) {
      return new MessageEmbed()
        .setTitle(returnText.noPermsEmbed.title)
        .setDescription(returnText.noPermsEmbed.description);
    } else if (args.length > 0) {
      userIdToVerify = args[0].value;
    }

    const result = await verifyUser(userIdToVerify);
    if (result.code !== 200) {
      return new MessageEmbed().setTitle(returnText.responseCodeIsNotOk);
    }

    const userToVerify = await channel.guild.members.fetch(userIdToVerify);
    const dmChannel = userToVerify.dmChannel || await userToVerify.createDM();
    try {
      await dmChannel.send(new MessageEmbed().setTitle(text.codeInDmMessageEmbed.title.replace('{{ code }}', userIdToVerify)));
      return new MessageEmbed().setTitle(returnText.successfullyStartedProcessDmEmbed.title);
    } catch (error) {
      return new MessageEmbed().setTitle(returnText.successfullyStartedProcessEmbed.title).setDescription(returnText.successfullyStartedProcessEmbed.description.replace('{{ code }}', userIdToVerify));
    }
  },
};
