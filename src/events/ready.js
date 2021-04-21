const { ChildLogger } = require('leekslazylogger');
const { readdirSync } = require('fs');

const log = new ChildLogger();

const eventObject = require('../modules/languageConfig').get('events', 'ready');

const { logText } = eventObject;

function registerCommand(client, guildArray, filePath) {
  // eslint-disable-next-line
  const command = require(`../commands/${filePath}`);
  client.commands.set(command.name, command);
  guildArray.forEach((guild) => {
    client.api.applications(client.user.id).guilds(guild.id).commands.post({
      data: {
        name: command.name,
        description: command.description,
        options: command.options,
      },
    });
  });
  log.console(log.format(`> Loaded &7${command.name}&f command`));
}

module.exports = {
  name: 'ready',
  execute(client, args, { config }) {
    log.success(logText.succesfullyAuthenticated.replace('{{ botTag }}', client.user.tag));

    client.user.setPresence({
      activity: {
        name: config.activity,
        type: config.activityType,
      },
    }).catch(log.error);
    log.debug(logText.updatedPressence.replace('{{ activityType }}', config.activityType).replace('{{ activityText }}', config.activity));

    /**
* command loader
*/
readdirSync('src/commands').filter((file) => file.endsWith('.js')).forEach((file) => {
  registerCommand(client, client.guilds.cache, `${file}`);
    });

    readdirSync('src/commands').forEach((dir) => {
      if (!dir.includes('.')) {
        readdirSync(`src/commands/${dir}`).filter((file) => file.endsWith('.js')).forEach((file) => {
          registerCommand(client, client.guilds.cache, `${dir}/${file}`);
        });
      }
    });

    log.info(`Loaded ${client.commands.size} commands`);
  },
};
