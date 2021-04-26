// eslint-disable-next-line max-classes-per-file
const { Model, DataTypes } = require('sequelize');
const { initializeGuildConfig } = require('./guildConfig');

module.exports = (sequelize) => {
    class SuggestionConfig extends Model {}
    SuggestionConfig.init({
      enabled: DataTypes.STRING,
      channelId: DataTypes.STRING,
      discussionChannelEnabled: DataTypes.STRING,
      discussionChannelId: DataTypes.STRING,
    }, {
      sequelize,
      modelName: 'suggestionConfig',
    });

    class VerifyConfig extends Model {}
    VerifyConfig.init({
      unverifiedRoleId: DataTypes.STRING,
      verifiedRoleId: DataTypes.STRING,
    }, {
      sequelize,
      modelName: 'verifyConfig',
    });

    class WelcomingConfig extends Model {}
    WelcomingConfig.init({
      enabled: DataTypes.STRING,
      messageType: DataTypes.STRING,
      channelId: DataTypes.STRING,
      message: DataTypes.STRING,
      dmMessageEnabled: DataTypes.STRING,
      dmMessageText: DataTypes.STRING,
    }, {
      sequelize,
      modelName: 'welcomingConfig',
    });

    class Config extends Model {}
    Config.init({
      guildId: DataTypes.BIGINT,
      guildName: DataTypes.STRING,
      embedColor: DataTypes.STRING,
      suggestionConfigId: DataTypes.BIGINT,
      verifyConfigId: DataTypes.BIGINT,
      welcomingConfigId: DataTypes.BIGINT,
    }, {
      sequelize,
      modelName: 'config',
    });
    Config.sync();
    SuggestionConfig.sync();
    VerifyConfig.sync();
    WelcomingConfig.sync();
    initializeGuildConfig(Config, SuggestionConfig, VerifyConfig, WelcomingConfig);
};
