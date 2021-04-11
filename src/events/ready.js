const { ChildLogger } = require('leekslazylogger');
const fs = require('fs');

const log = new ChildLogger();

const languageConfig = require(`../../user/languages/${require('../../user/config').language}`);

const eventObject = languageConfig.events.ready;
const { text } = eventObject;
const { returnText } = eventObject;
const { logText } = eventObject;

module.exports = {
  event: 'ready',
  execute(client, args, { config }) {
    log.success(logText.succesfullyAuthenticated.replace('{{ botTag }}', client.user.tag));

    const updatePresence = () => {
      const num = Math.floor(Math.random() * config.activities.length);
      client.user.setPresence({
        activity: {
          name: `${config.activities[num]}  |  ${config.prefix}help`,
          type: config.activity_types[num],
        },
      }).catch(log.error);
      log.debug(logText.updatedPressence.replace('{{ activityType }}', config.activity_types[num]).replace('{{ activityText }}', config.activities[num]));
    };

    updatePresence();
    setInterval(() => {
      updatePresence();
    }, 15000);

    if (client.guilds.cache.get(config.guildId).member(client.user).hasPermission('ADMINISTRATOR', false)) log.success(logText.administratorGranted);
    else log.warn(logText.administratorMissing);

    /**
 * command loader
 */
    const commands = fs.readdirSync('src/commands').filter((file) => file.endsWith('.js'));
    for (const file of commands) {
      const command = require(`../commands/${file}`);
      client.commands.set(command.name, command);
      log.console(log.format(`> Loaded &7${command.name}&f command`));
    }

    fs.readdirSync('src/commands').forEach((item) => {
      if (!item.includes('.')) {
        const commands = fs.readdirSync(`src/commands/${item}`).filter((file) => file.endsWith('.js'));
        for (const file of commands) {
          const command = require(`../commands/${item}/${file}`);
          client.commands.set(command.name, command);
          client.api.applications(client.user.id).guilds(config.guildId).commands.post({
            data: {
              name: command.name,
              description: command.description,
            },
          });
          log.console(log.format(`> Loaded &7${config.prefix}${command.name}&f command`));
        }
      }
    });
  },
};
