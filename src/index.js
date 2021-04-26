const Discord = require('discord.js');
const Logger = require('leekslazylogger');
const { Sequelize } = require('sequelize');
const fs = require('fs');
const globalConfig = require('../user/config');
const guildConfigHelper = require('./modules/guildConfig');

require('./modules/languageConfig').set(globalConfig.language);
require('./modules/banner');
require('dotenv').config({ path: 'user/.env' });

const executeCommand = require('./modules/executeCommand');

const client = new Discord.Client();
client.events = new Discord.Collection();
client.commands = new Discord.Collection();
client.queue = new Map();
require('./modules/api')(globalConfig, client);

const log = new Logger({
  name: globalConfig.name,
  logToFile: globalConfig.logs.files.enabled,
  maxAge: globalConfig.logs.files.keep_for,
  debug: globalConfig.debug,
});

/**
 * storage
 */
let sequelize;
if (globalConfig.storage.type === 'mssql') {
  log.info('Connecting to MySQL database...');
  sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    dialect: 'mssql',
    host: process.env.DB_HOST,
    logging: log.debug,
    enableArithAbort: true,
  });
} else {
  log.info('Using SQLite storage');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'user/storage.db',
    logging: log.debug,
  });
}
require('./modules/syncDatabase')(sequelize);

/**
 * event loader
 */
fs.readdirSync('src/events').filter((file) => file.endsWith('.js')).forEach((file) => {
  // eslint-disable-next-line
  const event = require(`./events/${file}`);
  client.events.set(event.name, event);
  client.on(event.name, async (e1, e2) => {
    const guildConfig = (e1 && e1.guild)
      ? await guildConfigHelper.getGuildConfig(e1.guild.id, globalConfig)
      : globalConfig;
    client.events.get(event.name).execute(client, [e1, e2], {
      guildConfig,
    });
  });
  log.console(log.format(`> Loaded &7${event.name}&f event`));
});

log.info(`Loaded ${client.events.size} events`);

client.ws.on('INTERACTION_CREATE', async (interaction) => {
  const guildConfig = await guildConfigHelper.getGuildConfig(interaction.guild_id, globalConfig);
  executeCommand.execute(interaction, client, { guildConfig });
});

process.on('unhandledRejection', (error) => {
  log.warn('An error was not caught');
  log.warn(`Uncaught ${error.name}: ${error.message}`);
  log.error(error);
});

client.login(process.env.discordToken);
