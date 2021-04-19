module.exports = {
  name: 'join',
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
