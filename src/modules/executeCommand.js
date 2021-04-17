const { APIMessage, MessageEmbed } = require('discord.js');
const { ChildLogger } = require('leekslazylogger');

const log = new ChildLogger();

const languageName = require('../../user/config').language;

const languageConfig = require(`../../user/languages/${languageName}`);

const commandObject = languageConfig.modules.executeCommand;
const { text } = commandObject;
const { returnText } = commandObject;
const { logText } = commandObject;

module.exports = {
  async execute(interaction, client, { config }) {
    async function createApiMessage(channel, content) {
      const apiMessage = await APIMessage.create(channel, content)
        .resolveData()
        .resolveFiles();

      return { ...apiMessage.data, files: apiMessage.files };
    }

    const commandName = interaction.data.name;
    const args = interaction.data.options;

    const command = client.commands.get(`${commandName}.`) || client.commands.get(commandName);

    if (!command) return;

    try {
      const guild = await client.guilds.fetch(interaction.guild_id);
      const channel = await client.channels.fetch(interaction.channel_id);
      const member = await guild.members.fetch(interaction.member.user.id);
      let message = '';
      if (command.permission && !member.hasPermission(command.permission)) {
        log.console(logText.userHasNoCommandPerms.replace('{{ username }}', interaction.member.user.username).replace('{{ commandName }}', commandName));
        message = new MessageEmbed()
          .setColor(config.err_colour)
          .setTitle(returnText.noPermsEmbedTitle)
          .setDescription(returnText.noPermsEmbedDescription.replace('{{ commandName }}', command.name).replace('{{ commandPerms }}', command.permission));
      } else {
        message = await command.execute(client, args, interaction, { member, channel, config });
        // * LOG ARGS VAN SLASH COMMAND
        const argNames = args.reduce((acc, arg) => {
          acc += ` ${arg.name}`;
          return acc;
        }, '');
        log.console(logText.userUsedCommand.replace('{{ username }}', interaction.member.user.username).replace('{{ commandName }}', commandName).replace('{{ commandArgs }}', argNames));
      }

      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: await createApiMessage(channel, message),
        },
      });
    } catch (error) {
      log.warn(logText.errorWhileExecutingCommand.replace('{{ commandName }}', commandName));
      log.error(error);
    }
  },
};
