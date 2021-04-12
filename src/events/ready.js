const { ChildLogger } = require('leekslazylogger');
const fs = require('fs');

const log = new ChildLogger();

const languageConfig = require(`../../user/languages/${require('../../user/config').language}`);

const eventObject = languageConfig.events.ready;
const { text } = eventObject;
const { returnText } = eventObject;
const { logText } = eventObject;

function registerCommand(client, guildId, filePath) {
  const command = require(`../commands/${filePath}`);
  client.commands.set(command.name, command);
  client.api.applications(client.user.id).guilds(guildId).commands.post({
    data: {
      name: command.name,
      description: command.description,
      options: command.options,
    },
  });
  log.console(log.format(`> Loaded &7${command.name}&f command`));
}

module.exports = {
  event: 'ready',
  execute(client, args, { config }) {
    log.success(logText.succesfullyAuthenticated.replace('{{ botTag }}', client.user.tag));

    const updatePresence = () => {
      client.user.setPresence({
        activity: {
          name: config.activity,
          type:  config.activityType,
        },
      }).catch(log.error);
      log.debug(logText.updatedPressence.replace('{{ activityType }}', config.activityType).replace('{{ activityText }}', config.activity));
    };

    updatePresence();

    /**
 * command loader
 */
    const commands = fs.readdirSync('src/commands').filter((file) => file.endsWith('.js'));
    for (const file of commands) {
          registerCommand(client, config.guildId, `${file}`);
    }

    fs.readdirSync('src/commands').forEach((item) => {
      if (!item.includes('.')) {
        const commands = fs.readdirSync(`src/commands/${item}`).filter((file) => file.endsWith('.js'));
        for (const file of commands) {
          registerCommand(client, config.guildId, `${item}/${file}`);
        }
      }
    });
  },
};
