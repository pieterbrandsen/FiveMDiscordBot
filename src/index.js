const fs = require('fs');
const path = require('path');
const fetchTimeout = require('fetch-timeout');

const dev = fs.existsSync('user/dev.env') && fs.existsSync('user/dev.config.js');

require('dotenv').config({ path: path.join('user/', dev ? 'dev.env' : '.env') });

module.exports.config = dev ? 'dev.config.js' : 'config.js';
const config = require(path.join('../user/', module.exports.config));

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

log.multi(log); // required to allow other files to access the logger

// require('./modules/updater').execute(client, config); // check for updates

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
  // client.on(event.event, e => client.events.get(event.event).execute(client, e, Ticket, Setting));
  client.on(event.event, (e1, e2) => client.events.get(event.event).execute(client, [e1, e2], {
    config, Setting,
  }));
  log.console(log.format(`> Loaded &7${event.event}&f event`));
}

log.info(`Loaded ${events.length} events`);

client.ws.on('INTERACTION_CREATE', async (interaction) => {
  require('./modules/executeCommand').execute(interaction, client, {config});
});

process.on('unhandledRejection', (error) => {
  log.warn('An error was not caught');
  log.warn(`Uncaught ${error.name}: ${error.message}`);
  log.error(error);
});

client.login(config.token);
