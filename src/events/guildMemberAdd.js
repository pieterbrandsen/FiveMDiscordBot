const { ChildLogger } = require('leekslazylogger');
const { MessageEmbed } = require('discord.js');

const log = new ChildLogger();
const eventObject = require('../modules/languageConfig').get('events', 'guildMemberAdd');

const { logText,text } = eventObject;

module.exports = {
  name: 'guildMemberAdd',
  async execute(client, [member], {config}) {
    log.info(logText.userJoinedGuild.replace("{{ userTag }}", member.user.tag));
    if (member.user.bot || config.welcomeSystem.enabled.toLowerCase() !== 'true') return;

    const welcomeChannel = await client.channels.fetch(config.welcomeSystem.channelId);
    if (config.welcomeSystem.messageType.toLowerCase().includes("text")) {
      const message = new MessageEmbed().setTitle(text.userJoinedGuild.title.replace("{{ username }}",member.user.username).replace("{{ serverName }}",config.serverName)).setDescription(config.welcomeSystem.message).setColor(config.colour);
      await welcomeChannel.send(message);
    }
    else if (config.welcomeSystem.messageType.toLowerCase().includes("photo")){
      const message = new MessageEmbed().setTitle("IK BEN EEN TITEL!").setImage("https://cdn.discordapp.com/attachments/824048331557699644/833803877593776138/5f06ee6e9ae59dd0fef9d078f46e7fe4.png").setColor("#36393F");
      await welcomeChannel.send(message);
    }
  },
};