const fs = require('fs');
const { MessageEmbed } = require('discord.js');

const languageConfig = require(`../../user/languages/${require('../../user/config').language}`);

const commandObject = languageConfig.commands.config;
const { commandText } = commandObject;
const { text } = commandObject;
const { returnText } = commandObject;
const { logText } = commandObject;

const changeConfigValueMessageEmbed = (configName, description, configColor) => new MessageEmbed().setTitle(text.changeConfigValueMessage.title.replace('{{ configValueName }}', configName)).setDescription(description).setColor(configColor);
const changeConfigValueOfObjectMessageEmbed = (configName,description, configObjectName, configColor) => new MessageEmbed().setTitle(text.changeConfigValueOfObjectValueMessage.title.replace('{{ configValueName }}', configName).replace('{{ configObjectName }}', configObjectName)).setDescription(description).setColor(configColor);

module.exports = {
  name: commandText.name,
  description: commandText.description,
  permission: commandText.permission,
  options: commandText.options,
  async execute(client, args, interaction, { config, member, channel }) {
    if (args[0].name == commandText.subNames[0]) {
      const messageFilter = (msg) => msg.author.id == member.user.id && msg.channel.id === channel.id;
      const collector = channel.createMessageCollector(messageFilter, { time: 10 * 60 * 1000 });
      let i = 0;
      const configObjects = Object.entries(text.changeableConfigObjects);
      let a = 0;
      let b = 0;
      await channel.send(changeConfigValueMessageEmbed(text.changeableConfigValues[i].name,text.changeableConfigValues[i].description, config.colour));

      collector.on('collect', async (msg) => {
        let configObject = configObjects[a];
        if (i < text.changeableConfigValues.length) {
          config[text.changeableConfigValues[i].name] = msg.content;
          i++;
          if (i < text.changeableConfigValues.length) {
            msg.channel.send(changeConfigValueMessageEmbed(text.changeableConfigValues[i].name,text.changeableConfigValues[i].description, config.colour));
          }
          else {
          msg.channel.send(changeConfigValueOfObjectMessageEmbed(configObject[1][b].name,configObject[1][b].description, configObject[0], config.colour));
          }
        }
        else {
          config[configObject[0]][configObject[1][b].name] = msg.content;
          b++;
          if (a < configObjects.length && configObject[1].length == b) {
            a++;
            b = 0; 
            configObject = configObjects[a];
          }
          if (configObject) msg.channel.send(changeConfigValueOfObjectMessageEmbed(configObject[1][b].name,configObject[1][b].description, configObject[0], config.colour));
          else return collector.stop('MAX');
        }

        if (text.changeableConfigValues.length == i && configObjects.length < a) return collector.stop('MAX');
      });

      collector.on('end', (collected, reason) => {
        if (reason == 'MAX') {
          const configFilePath = './user/config.json';
          fs.writeFile(configFilePath, JSON.stringify(config, null, 2), (err) => {
            if (err) return console.log(err);
          });
          channel.send(new MessageEmbed().setTitle(returnText.messageCollectorEnd.title).setDescription(returnText.messageCollectorEnd.description).setColor(config.colour));
        } else if (reason == 'time') {
          channel.send(new MessageEmbed().setTitle(returnText.messageCollectorExpired.title).setDescription(returnText.messageCollectorExpired.description).setColor(config.colour));
        }
      });
    }

    const embed = new MessageEmbed()
      .setTitle(returnText.startedUpdatingConfig.title)
      .setColor(config.colour);
    return embed;
  },
};
