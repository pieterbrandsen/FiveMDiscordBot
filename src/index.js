const Discord = require('discord.js');
const Logger = require('leekslazylogger');
const { Sequelize, Model, DataTypes } = require('sequelize');
const fs = require('fs');
const config = require('../user/config');

require('./modules/languageConfig').set(config.language);
require('./modules/banner');
require('dotenv').config({ path: 'user/.env' });

const executeCommand = require('./modules/executeCommand');

const client = new Discord.Client();
client.events = new Discord.Collection();
client.commands = new Discord.Collection();
client.queue = new Map();
require('./modules/api')(config, client);

const log = new Logger({
  name: config.name,
  logToFile: config.logs.files.enabled,
  maxAge: config.logs.files.keep_for,
  debug: config.debug,
});

/**
 * storage
 */
log.info('Using SQLite storage');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'user/storage.db',
  logging: log.debug,
});

class Setting extends Model {}
Setting.init({
  key: DataTypes.STRING,
  value: DataTypes.STRING,
}, {
  sequelize,
  modelName: 'setting',
});

Setting.sync();

/**
 * event loader
 */
fs.readdirSync('src/events').filter((file) => file.endsWith('.js')).forEach((file) => {
  // eslint-disable-next-line
  const event = require(`./events/${file}`);
  client.events.set(event.name, event);
  client.on(event.name, (e1, e2) => client.events.get(event.name).execute(client, [e1, e2], {
    config, Setting,
  }));
  log.console(log.format(`> Loaded &7${event.name}&f event`));
});

log.info(`Loaded ${client.events.size} events`);

client.ws.on('INTERACTION_CREATE', async (interaction) => {
  executeCommand.execute(interaction, client, { config });
});

process.on('unhandledRejection', (error) => {
  log.warn('An error was not caught');
  log.warn(`Uncaught ${error.name}: ${error.message}`);
  log.error(error);
});

client.login(process.env.discordToken);
