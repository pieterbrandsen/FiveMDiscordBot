const { ChildLogger } = require('leekslazylogger');

const log = new ChildLogger();

const languageConfig = require(`../../user/languages/${require('../../user/config').language}`);

const commandObject = languageConfig.events.message;
const commandText = commandObject.command;
const { text } = commandObject;
const { returnText } = commandObject;
const { logText } = commandObject;
const Discord = require('discord.js');

module.exports = {
  async execute(interaction, client) {
    async function createApiMessage(interaction, content) {
      const apiMessage = await Discord.APIMessage.create(client.channels.resolve(interaction.channel_id), content)
        .resolveData()
        .resolveFiles();

      return { ...apiMessage.data, files: apiMessage.files };
    }

    const commandName = interaction.data.name;
    const args = interaction.data.options;

    const command = client.commands.get(commandName)
    || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

    try {
      const message = command.execute(client, args, interaction);
      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: await createApiMessage(interaction, message),
        },
      });
      log.console(logText.userUsedCommand.replace('{{ username }}', interaction.member.user.username).replace('{{ commandName }}', commandName));
    } catch (error) {
      log.warn(logText.errorWhileExecutingCommand.replace('{{ commandName }}', commandName));
      log.error(error);
    }
  },
};
