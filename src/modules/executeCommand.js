const { ChildLogger } = require('leekslazylogger');

const log = new ChildLogger();

const languageConfig = require(`../../user/languages/${require('../../user/config').language}`);

const commandObject = languageConfig.modules.executeCommand;
const { text } = commandObject;
const { returnText } = commandObject;
const { logText } = commandObject;
const {APIMessage} = require('discord.js');

module.exports = {
  async execute(interaction, client, {config}) {
    async function createApiMessage(interaction, content) {
      const apiMessage = await APIMessage.create(client.channels.resolve(interaction.channel_id), content)
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
      const member = await guild.members.fetch(interaction.member.user.id)
      let message = "";
      if (command.permission && !member.hasPermission(command.permission)) {
        log.console(logText.userHasNoCommandPerms.replace("{{ username }}", interaction.member.user.username).replace("{{ commandName }}", commandName));
        message =
          new Discord.MessageEmbed()
            .setColor(config.err_colour)
            .setTitle(returnText.noPermsEmbedTitle)
            .setDescription(returnText.noPermsEmbedDescription.replace("{{ commandName }}", command.name).replace("{{ commandPerms }}", command.permission))
        return;
          }
      else {
        message = command.execute(client, args, interaction, {member, config});
      }

      if (message !== undefined) {
    client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 4,
        data: await createApiMessage(interaction, message),
      },
    });
  }
  log.console(logText.userUsedCommand.replace('{{ username }}', interaction.member.user.username).replace('{{ commandName }}', commandName));
    } catch (error) {
      log.warn(logText.errorWhileExecutingCommand.replace('{{ commandName }}', commandName));
      log.error(error);
    }
  },
};
