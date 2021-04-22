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
let sequelize;
if(config.storage.type === 'mssql') {
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
		logging: log.debug
	});
}

class SuggestionConfig extends Model {}
SuggestionConfig.init({
  enabled: DataTypes.STRING,
  channelId: DataTypes.STRING,
  discussionChannelEnabled: DataTypes.STRING,
  discussionChannelId: DataTypes.STRING,
}, {
	sequelize,
	modelName: 'suggestionConfig'
})

class VerifyConfig extends Model {}
VerifyConfig.init({
  unverifiedRoleId: DataTypes.BIGINT,
  verifiedRoleId: DataTypes.BIGINT
}, {
	sequelize,
	modelName: 'verifyConfig'
})

class WelcomingConfig extends Model {}
WelcomingConfig.init({
  enabled: DataTypes.STRING,
  messageType: DataTypes.STRING,
  channelId: DataTypes.STRING,
  message: DataTypes.STRING,
}, {
	sequelize,
	modelName: 'welcomingConfig'
})

class Config extends Model {}
Config.init({
  guildId: DataTypes.BIGINT,
  guildName: DataTypes.STRING,
  embedColor: DataTypes.STRING,
  suggestionConfigId: DataTypes.BIGINT,
  verifyConfigId: DataTypes.BIGINT,
  welcomingConfigId: DataTypes.BIGINT,
  suggestionConfigId: DataTypes.BIGINT,
}, {
  sequelize,
  modelName: 'config',
});
Config.sync();
SuggestionConfig.sync();
VerifyConfig.sync();
WelcomingConfig.sync();

/**
 * event loader
 */
fs.readdirSync('src/events').filter((file) => file.endsWith('.js')).forEach((file) => {
  // eslint-disable-next-line
  const event = require(`./events/${file}`);
  client.events.set(event.name, event);
  client.on(event.name, (e1, e2) => client.events.get(event.name).execute(client, [e1, e2], {
    config,Config
  }));
  log.console(log.format(`> Loaded &7${event.name}&f event`));
});

log.info(`Loaded ${client.events.size} events`);

client.ws.on('INTERACTION_CREATE', async (interaction) => {
  executeCommand.execute(interaction, client, { config, Config });
});

process.on('unhandledRejection', (error) => {
  log.warn('An error was not caught');
  log.warn(`Uncaught ${error.name}: ${error.message}`);
  log.error(error);
});

client.login(process.env.discordToken);
