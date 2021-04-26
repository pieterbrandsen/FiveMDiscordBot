const { MessageEmbed } = require('discord.js');
const { cloneDeep } = require('lodash');
const { updateGuildConfig } = require('../modules/guildConfig');
const commandObject = require('../modules/languageConfig').get('commands', 'config');

const { commandText } = commandObject;
const { text } = commandObject;
const { returnText } = commandObject;

const changeConfigValueMessageEmbed = (configName, description, configColor, footer) => new MessageEmbed().setTitle(text.changeConfigValueMessage.title.replace('{{ configValueName }}', configName)).setDescription(description).setColor(configColor)
  .setFooter(footer);
const changeConfigValueOfObjectMessageEmbed = (configName, description, configObjectName, configColor, footer) => new MessageEmbed().setTitle(text.changeConfigValueOfObjectValueMessage.title.replace('{{ configValueName }}', configName).replace('{{ configObjectName }}', configObjectName)).setDescription(description).setColor(configColor)
  .setFooter(footer);

module.exports = {
  name: commandText.name,
  description: commandText.description,
  permission: commandText.permission,
  options: commandText.options,
  async execute(client, args, interaction, { guildConfig, member, channel }) {
    const updatedConfig = cloneDeep(guildConfig);

    if (args[0].name === commandText.subNames[0]) {
      const userId = member.user.id;
      const messageFilter = (msg) => msg.author.id === userId && msg.channel.id === channel.id;
      const collector = channel.createMessageCollector(messageFilter, { time: 10 * 60 * 1000 });
      const configObjects = Object.entries(text.changeableConfigValues);
      let i = 0;
      let y = 0;
      if (typeof configObjects[0][1] === 'string') {
        await channel.send(changeConfigValueMessageEmbed(configObjects[0][0],
          configObjects[0][1],
          guildConfig.colour, guildConfig.footerText));
      } else {
        await channel.send(
          changeConfigValueOfObjectMessageEmbed(configObjects[0][0],
            configObjects[0][1][y].description,
            configObjects[0][1][y].name,
            guildConfig.colour, guildConfig.footerText),
        );
      }

      // eslint-disable-next-line consistent-return
      collector.on('collect', async (msg) => {
        let configObject = configObjects[i];
        if (i < configObjects.length) {
          if (typeof configObject[1] === 'string') {
            updatedConfig[configObject[0]] = msg.content;
            i += 1;
            configObject = configObjects[i];
            if (typeof configObject[1] === 'string') await channel.send(changeConfigValueMessageEmbed(configObject[0], configObject[1], guildConfig.colour, guildConfig.footerText));
            else {
              await channel.send(changeConfigValueOfObjectMessageEmbed(configObject[0],
                configObject[1][y].description,
                configObject[1][y].name,
                guildConfig.colour, guildConfig.footerText));
            }
          } else {
            updatedConfig[configObject[0]][configObject[1][y].name] = msg.content;
            y += 1;
            if (configObject[1].length === y) {
              i += 1;
              y = 0;
              configObject = configObjects[i];
            }
            if (configObject) {
              msg.channel.send(
                changeConfigValueOfObjectMessageEmbed(configObject[1][y].name,
                  configObject[1][y].description,
                  configObject[0],
                  guildConfig.colour, guildConfig.footerText),
              );
            } else return collector.stop('MAX');
          }
        }
      });

      collector.on('end', async (collected, reason) => {
        if (reason === 'MAX') {
          try {
            await updateGuildConfig(updatedConfig);
            channel.send(new MessageEmbed()
              .setTitle(returnText.messageCollectorEnd.success.title)
              .setDescription(returnText.messageCollectorEnd.success.description)
              .setColor(guildConfig.colour)
              .setFooter(guildConfig.footerText));
          } catch (error) {
            channel.send(new MessageEmbed()
              .setTitle(returnText.messageCollectorEnd.error.title)
              .setDescription(returnText.messageCollectorEnd.error.description)
              .setColor(guildConfig.colour)
              .setFooter(guildConfig.footerText));
          }
        } else if (reason === 'time') {
          channel.send(new MessageEmbed()
            .setTitle(returnText.messageCollectorExpired.title)
            .setDescription(returnText.messageCollectorExpired.description)
            .setColor(guildConfig.colour)
            .setFooter(guildConfig.footerText));
        }

        return undefined;
      });
    } else if (args[0].name === commandText.subNames[1]) {
      const userId = member.user.id;
      const messageFilter = (msg) => msg.author.id === userId && msg.channel.id === channel.id;
      const collector = channel.createMessageCollector(messageFilter, { time: 10 * 60 * 1000 });
      const configObjects = Object.entries(text.changeableConfigValues);
      const configObjectName = args[0].options[0].value.toLowerCase();
      const configObject = configObjects.find((s) => (s[0].toLowerCase() === configObjectName));

      if (configObject === undefined) {
        return new MessageEmbed()
          .setTitle(returnText.objectNotFound.title)
          .setDescription(returnText.objectNotFound.description.replace('{{ name }}', configObjectName))
          .setFooter(guildConfig.footerText);
      }

      let b = 0;
      if (typeof configObject[1] === 'string') {
        await channel.send(changeConfigValueMessageEmbed(configObject[0],
          configObject[1],
          guildConfig.colour, guildConfig.footerText));
      } else {
        await channel.send(changeConfigValueOfObjectMessageEmbed(configObject[0],
          configObject[1][b].description,
          configObject[1][b].name,
          guildConfig.colour, guildConfig.footerText));
      }

      // eslint-disable-next-line consistent-return
      collector.on('collect', async (msg) => {
        if (typeof configObject[1] === 'string') {
          updatedConfig[configObject[0]] = msg.content;
          return collector.stop('MAX');
        }

        updatedConfig[configObject[0]][configObject[1][b].name] = msg.content;
        b += 1;
        if (b < configObject[1].length) {
          msg.channel.send(changeConfigValueOfObjectMessageEmbed(configObject[1][b].name,
            configObject[1][b].description,
            configObject[0],
            guildConfig.colour, guildConfig.footerText));
        } else return collector.stop('MAX');
      });

      collector.on('end', async (collected, reason) => {
        if (reason === 'MAX') {
          try {
            await updateGuildConfig(updatedConfig);
            channel.send(new MessageEmbed()
              .setTitle(returnText.messageCollectorEnd.success.title)
              .setDescription(returnText.messageCollectorEnd.success.description)
              .setColor(guildConfig.colour)
              .setFooter(guildConfig.footerText));
          } catch (error) {
            channel.send(new MessageEmbed()
              .setTitle(returnText.messageCollectorEnd.error.title)
              .setDescription(returnText.messageCollectorEnd.error.description)
              .setColor(guildConfig.colour)
              .setFooter(guildConfig.footerText));
          }
        } else if (reason === 'time') {
          channel.send(new MessageEmbed()
            .setTitle(returnText.messageCollectorExpired.title)
            .setDescription(returnText.messageCollectorExpired.description)
            .setColor(guildConfig.colour)
            .setFooter(guildConfig.footerText));
        }

        return undefined;
      });
    } else if (args[0].name === commandText.subNames[2]) {
      const configObjects = Object.entries(text.changeableConfigValues);
      const overviewEmbed = new MessageEmbed()
        .setTitle(text.configOverview.title)
        .setDescription(text.configOverview.description).setFooter(guildConfig.footerText);
      configObjects.forEach((element) => {
        if (typeof element[1] === 'string') {
          overviewEmbed.addField(element[0], guildConfig[element[0]], true);
        } else {
          let fieldText = '';
          for (let i = 0; i < element[1].length; i += 1) {
            fieldText += `${element[1][i].name} **=** ${guildConfig[element[0]][element[1][i].name]} \n`;
          }
          overviewEmbed.addField(element[0], fieldText, false);
        }
      });
      return overviewEmbed;
    }

    const embed = new MessageEmbed()
      .setTitle(returnText.startedUpdatingConfig.title)
      .setColor(guildConfig.colour).setFooter(guildConfig.footerText);
    return embed;
  },
};
