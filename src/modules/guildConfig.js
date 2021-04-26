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
  });
  const welcomingConfig = await WelcomingConfig.create({
    enabled: 'false',
    messageType: 'photo',
    channelId: '',
    message: '',
  });
  const config = await Config.create({
    guildId,
    guildName: 'USE CONFIG COMMAND TO SET THIS',
    embedColor: '#FF0000',
    suggestionConfigId: suggestionConfig.id,
    verifyConfigId: verifyConfig.id,
    welcomingConfigId: welcomingConfig.id,
  });

  guildConfig.guildName = config.guildName;
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
    guildConfig.suggestionSystem = {
      id: suggestionConfig.id,
      enabled: suggestionConfig.enabled,
      channelId: suggestionConfig.channelId,
      discussionChannelEnabled: suggestionConfig.discussionChannelEnabled,
      discussionChannelId: suggestionConfig.discussionChannelId,
    };

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
    guildConfig.embedColor = config.embedColor;
    return guildConfig;
  },
  updateGuildConfig: async (guildConfig) => {
    await Config.update({
      guildName: guildConfig.guildName,
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
    }, {
      where: {
        id: guildConfig.welcomingSystem.id,
      },
    });
  },
};
