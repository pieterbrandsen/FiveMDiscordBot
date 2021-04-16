const fs = require('fs');
const { MessageEmbed } = require('discord.js');

const languageConfig = require(`../../user/languages/${require('../../user/config').language}`);

const commandObject = languageConfig.commands.config;
const { commandText } = commandObject;
const { text } = commandObject;
const { returnText } = commandObject;
const { logText } = commandObject;

const changeConfigValueMessageEmbed = (configName,configColor) => {
  return new MessageEmbed().setTitle(text.changeConfigValueMessage.title.replace("{{ configValueName }}",configName)).setDescription(text.changeConfigValueMessage.description).setColor(configColor);
}

module.exports = {
  name: commandText.name,
  description: commandText.description,
  permission: commandText.permission,
  options: commandText.options,
  async execute(client, args, interaction, {config,member, channel}) {
    if (args[0].name == commandText.subNames[0]) {
      const messageFilter = (msg) => {
        return msg.author.id == member.user.id && msg.channel.id === channel.id
      }
      const collector = channel.createMessageCollector(messageFilter, { time: 1*60*1000 });
      let i = 0;
      await channel.send(changeConfigValueMessageEmbed(text.changeableConfigValues[i],config.colour));

      collector.on('collect', async(msg) => {
        config[text.changeableConfigValues[i]] = msg.content;
        
        i++;
        if (text.changeableConfigValues.length == i) return collector.stop('MAX');
        msg.channel.send(changeConfigValueMessageEmbed(text.changeableConfigValues[i],config.colour));
    });

    collector.on('end', (collected, reason) => {
        if (reason == 'MAX') {
          const configFilePath = "./user/config.json";
          fs.writeFile(configFilePath, JSON.stringify(config, null, 2), function writeJSON(err) {
            if (err) return console.log(err);
          });
          channel.send(new MessageEmbed().setTitle(returnText.messageCollectorEnd.title).setDescription(returnText.messageCollectorEnd.description).setColor(config.colour));
        }
        else if (reason == "time") {
          channel.send(new MessageEmbed().setTitle(returnText.messageCollectorExpired.title).setDescription(returnText.messageCollectorExpired.description).setColor(config.colour))
        }
    });
    }

    const embed = new MessageEmbed()
    .setTitle(returnText.startedUpdatingConfig.title)
    .setColor(config.colour);
  return embed;
  },
};
