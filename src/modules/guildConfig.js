let Config = null;
let SuggestionConfig = null;
let VerifyConfig = null;
let WelcomingConfig = null;

const setGuildConfig = async (guildId, globalConfig) => {
  const guildConfig = globalConfig;
  const suggestionConfig = await SuggestionConfig.create({
    enabled: 'false',
    channelId: '',
    discussionChannelEnabled: 'false',
    discussionChannelId: '',
  });
  const verifyConfig = await VerifyConfig.create({
    unverifiedRoleId: '',
    verifiedRoleId: '',
    selfVerifyingAllowed: 'false',
  });
  const welcomingConfig = await WelcomingConfig.create({
    enabled: 'false',
    messageType: 'photo',
    channelId: '',
    message: '',
    dmMessageEnabled: 'false',
    dmMessageText: '',
  });
  const config = await Config.create({
    guildId,
    guildName: 'USE CONFIG COMMAND TO SET THIS',
    serverIp: '12.345.678.90:12345',
    embedColor: '#FF0000',
    suggestionConfigId: suggestionConfig.id,
    verifyConfigId: verifyConfig.id,
    welcomingConfigId: welcomingConfig.id,
  });

  guildConfig.guildName = config.guildName;
  guildConfig.serverIp = config.serverIp;
  guildConfig.embedColor = config.embedColor;
  guildConfig.suggestionSystem = suggestionConfig;
  guildConfig.verifySystem = verifyConfig;
  guildConfig.welcomingSystem = welcomingConfig;
  return guildConfig;
};

module.exports = {
  initializeGuildConfig: (
    ConfigModel, SuggestionConfigModel, VerifyConfigModel, WelcomingConfigModel,
  ) => {
    Config = ConfigModel;
    SuggestionConfig = SuggestionConfigModel;
    VerifyConfig = VerifyConfigModel;
    WelcomingConfig = WelcomingConfigModel;
  },
  getGuildConfig: async (guildId, globalConfig) => {
    const guildConfig = globalConfig;
    const config = await Config.findOne({
      where: {
        guildId,
      },
    });

    if (config == null) {
      return setGuildConfig(guildId, globalConfig, {
        Config, SuggestionConfig, VerifyConfig, WelcomingConfig,
      });
    }

    const suggestionConfig = await SuggestionConfig.findOne({
      where: {
        id: config.suggestionConfigId,
      },
    });
    guildConfig.suggestionSystem = suggestionConfig;

    const verifyConfig = await VerifyConfig.findOne({
      where: {
        id: config.verifyConfigId,
      },
    });
    guildConfig.verifySystem = verifyConfig;

    const welcomingConfig = await WelcomingConfig.findOne({
      where: {
        id: config.welcomingConfigId,
      },
    });
    guildConfig.welcomingSystem = welcomingConfig;

    guildConfig.id = config.id;
    guildConfig.guildName = config.guildName;
    guildConfig.serverIp = config.serverIp;
    guildConfig.embedColor = config.embedColor;
    return guildConfig;
  },
  updateGuildConfig: async (guildConfig) => {
    await Config.update({
      guildName: guildConfig.guildName,
      serverIp: guildConfig.serverIp,
      embedColor: guildConfig.embedColor,
    }, {
      where: {
        id: guildConfig.id,
      },
    });

    await SuggestionConfig.update({
      enabled: guildConfig.suggestionSystem.enabled,
      channelId: guildConfig.suggestionSystem.channelId,
      discussionChannelEnabled: guildConfig.suggestionSystem.discussionChannelEnabled,
      discussionChannelId: guildConfig.suggestionSystem.discussionChannelId,
    }, {
      where: {
        id: guildConfig.suggestionSystem.id,
      },
    });

    await VerifyConfig.update({
      unverifiedRoleId: guildConfig.verifySystem.unverifiedRoleId,
      verifiedRoleId: guildConfig.verifySystem.verifiedRoleId,
      selfVerifyingAllowed: guildConfig.verifySystem.selfVerifyingAllowed,
    }, {
      where: {
        id: guildConfig.verifySystem.id,
      },
    });

    await WelcomingConfig.update({
      enabled: guildConfig.welcomingSystem.enabled,
      messageType: guildConfig.welcomingSystem.messageType,
      channelId: guildConfig.welcomingSystem.channelId,
      message: guildConfig.welcomingSystem.message,
      dmMessageEnabled: guildConfig.welcomingSystem.dmMessageEnabled,
      dmMessageText: guildConfig.welcomingSystem.dmMessageText,
    }, {
      where: {
        id: guildConfig.welcomingSystem.id,
      },
    });
  },
};
