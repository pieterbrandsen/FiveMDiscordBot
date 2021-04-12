module.exports = {
  token: 'zUwMDM3MjE2MTE3MzkxMzgw.X00slw.P2Z3zTT1d0jbwAPM3PA0u027hSw',
  language: 'NL',

  serverName: 'PandaBot',
  activities: ['PandaBot'],
  activity_types: ['WATCHING'],
  colour: '#009999',
  err_colour: '#E74C3C',
  cooldown: 5,

  reloadTime: 600 * 1000, // in ms

  guildId: '830788726111338527',
  staffRoleId: '725241568302333973',

  serverIp: '45.146.252.9:30238',

  transcripts: {
    text: {
      enabled: true,
      keep_for: 90,
    },
    web: {
      enabled: false,
      server: 'https://tickets.example.com',
    },
  },

  storage: {
    type: 'sqlite',
  },

  logs: {
    files: {
      enabled: true,
      keep_for: 7,
    },
    discord: {
      enabled: true,
      channel: '763092029458612254', // ID of your log channel
    },
  },

  debug:false
};
