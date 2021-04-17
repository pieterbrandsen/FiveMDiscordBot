const fs = require('fs');
const config = require('../user/config');

require('dotenv').config({ path: 'user/.env' });

const Discord = require('discord.js');

const client = new Discord.Client();
// const client = new Discord.Client({
// 	autoReconnect: true,
// 	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
// });
client.events = new Discord.Collection();
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
client.queue = new Map();

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const utils = require('./modules/utils');
const leeks = require('leeks.js');

require('./modules/banner')(leeks); // big coloured text thing

const Logger = require('leekslazylogger');

const log = new Logger({
  name: config.name,
  logToFile: config.logs.files.enabled,
  maxAge: config.logs.files.keep_for,
  debug: config.debug,
});

/**
 * storage
 */
const { Sequelize, Model, DataTypes } = require('sequelize');

let sequelize;
log.info('Using SQLite storage');
sequelize = new Sequelize({
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
const events = fs.readdirSync('src/events').filter((file) => file.endsWith('.js'));
for (const file of events) {
  const event = require(`./events/${file}`);
  client.events.set(event.event, event);
  client.on(event.event, (e1, e2) => client.events.get(event.event).execute(client, [e1, e2], {
    config, Setting,
  }));
  log.console(log.format(`> Loaded &7${event.event}&f event`));
}

log.info(`Loaded ${events.length} events`);

client.ws.on('INTERACTION_CREATE', async (interaction) => {
  require('./modules/executeCommand').execute(interaction, client, { config });
});

process.on('unhandledRejection', (error) => {
  log.warn('An error was not caught');
  log.warn(`Uncaught ${error.name}: ${error.message}`);
  log.error(error);
});

client.login(config.token);
