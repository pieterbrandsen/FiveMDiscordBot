module.exports = {
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

  errors: {
    noStaffRole: {
    },
  },

  commands: {
    basic: {
      ip: {
        commandText: {
          name: 'ping',
          description: 'Check of de bot nog werkt',
          usage: '',
          aliases: [''],
          example: 'ping',
          args: false,
          permission: '',
        },
        text: {
        },
        returnText: {

        },
        logText: {

        },
      },
    },
  },
  modules: {
    executeCommand: {
      message: {
        text: {
  
        },
        returnText: {
  
        },
        logText: {
          userUsedCommand: "{{ username }} used the '{{ commandName }}' command",
          errorWhileExecutingCommand: "An error occurred whilst executing the '{{ commandName }}' command"
        },
      },
    }
  },
  events: {
    message: {
      text: {

      },
      returnText: {

      },
      logText: {
        dmMessage: "Received a DM from {{ username }}: {{ cleanMessage }}",
      },
    },
    rateLimit: {
      text: {
      },
      returnText: {
      },
      logText: {
        rateLimited: 'Rate-limited! (Enable debug mode in config for details)',
      },
    },
    ready: {
      text: {
      },
      returnText: {
      },
      logText: {
        succesfullyAuthenticated: 'Authenticated as {{ botTag }}',
        updatedPressence: 'Updated presence: {{ activityType }} {{ activityText }}',
        administratorGranted: "\'ADMINISTRATOR\' permission has been granted",
        administratorMissing: "Bot does not have \'ADMINISTRATOR\' permission",
      },
    },
  },
};
