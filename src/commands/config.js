const fs = require('fs');
const { MessageEmbed } = require('discord.js');

const languageName = require('../../user/config').language;
const languageConfig = require(`../../user/languages/${languageName}`);

const commandObject = languageConfig.commands.config;
const { commandText } = commandObject;
const { text } = commandObject;
const { returnText } = commandObject;
const { logText } = commandObject;

const changeConfigValueMessageEmbed = (configName, description, configColor) => new MessageEmbed().setTitle(text.changeConfigValueMessage.title.replace('{{ configValueName }}', configName)).setDescription(description).setColor(configColor);
const changeConfigValueOfObjectMessageEmbed = (configName, description, configObjectName, configColor) => new MessageEmbed().setTitle(text.changeConfigValueOfObjectValueMessage.title.replace('{{ configValueName }}', configName).replace('{{ configObjectName }}', configObjectName)).setDescription(description).setColor(configColor);

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
      await channel.send(changeConfigValueMessageEmbed(text.changeableConfigValues[i].name, text.changeableConfigValues[i].description, config.colour));

      collector.on('collect', async (msg) => {
        let configObject = configObjects[a];
        if (i < text.changeableConfigValues.length) {
          config[text.changeableConfigValues[i].name] = msg.content;
          i++;
          if (i < text.changeableConfigValues.length) {
            msg.channel.send(changeConfigValueMessageEmbed(text.changeableConfigValues[i].name, text.changeableConfigValues[i].description, config.colour));
          } else {
            msg.channel.send(changeConfigValueOfObjectMessageEmbed(configObject[1][b].name, configObject[1][b].description, configObject[0], config.colour));
          }
        } else {
          config[configObject[0]][configObject[1][b].name] = msg.content;
          b++;
          if (a < configObjects.length && configObject[1].length == b) {
            a++;
            b = 0;
            configObject = configObjects[a];
          }
          if (configObject) msg.channel.send(changeConfigValueOfObjectMessageEmbed(configObject[1][b].name, configObject[1][b].description, configObject[0], config.colour));
          else return collector.stop('MAX');
        }
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
    } else if (args[0].name == commandText.subNames[1]) {
      const messageFilter = (msg) => msg.author.id == member.user.id && msg.channel.id === channel.id;
      const collector = channel.createMessageCollector(messageFilter, { time: 10 * 60 * 1000 });
      const configObjects = Object.entries(text.changeableConfigObjects).concat(text.changeableConfigValues);
      const configObjectName = args[0].options[0].value.toLowerCase();
      const configObject = configObjects.find((s) => (s.name ? s.name.toLowerCase() === configObjectName : s[0].toLowerCase() === configObjectName));
      let b = 0;
      if (configObject.name) await channel.send(changeConfigValueMessageEmbed(configObject.name, configObject.description, config.colour));
      else await channel.send(changeConfigValueOfObjectMessageEmbed(configObject[0], configObject[1][b].description, configObject[1][b].name, config.colour));

      collector.on('collect', async (msg) => {
        if (configObject.name) {
          config[configObject.name] = msg.content;
          return collector.stop('MAX');
        }

        config[configObject[0]][configObject[1][b].name] = msg.content;
        b++;
        if (b < configObject[1].length) msg.channel.send(changeConfigValueOfObjectMessageEmbed(configObject[1][b].name, configObject[1][b].description, configObject[0], config.colour));
        else return collector.stop('MAX');
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
    } else if (args[0].name == commandText.subNames[2]) {
      const configObjects = Object.entries(text.changeableConfigObjects).concat(text.changeableConfigValues);
      const overviewEmbed = new MessageEmbed().setTitle(text.configOverview.title).setDescription(text.configOverview.description);
      configObjects.forEach((element) => {
        if (element.name) {
          overviewEmbed.addField(element.name, config[element.name], true);
        } else {
          for (let i = 0; i < element[1].length; i++) {
            overviewEmbed.addField(element[0], `${element[1][i].name}**=**${config[element[0]][element[1][i].name]}`, true);
          }
        }
      });
      return overviewEmbed;
    }

    const embed = new MessageEmbed()
      .setTitle(returnText.startedUpdatingConfig.title)
      .setColor(config.colour);
    return embed;
  },
};
