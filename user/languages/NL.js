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
      ping: {
        commandText: {
          name: 'ping',
          description: 'Check of de bot nog actief is',
          permission: '',
        options: ""
      },
        text: {
        },
        returnText: {
          currentPing: "Mijn huidige ping is **{{ value }}**"
        },
        logText: {

        },
      },
    },
    suggestion: {
      commandText: {
        name: 'suggestie',
        subNames: ["nieuw"],
        description: 'Check of de bot nog actief is',
        permission: '',
        options: [                {
          "name": "nieuw",
          "description": "Maak een nieuwe suggestie aan",
          "type": 1, // 1 is type SUB_COMMAND
          "options": [
            {
                "name": "titel",
                "description": "De titel boven aan je suggestie",
                "type": 3,
                "required": true
            },
            {
              "name": "bericht",
              "description": "Je suggestie uitgelegd",
              "type": 3,
              "required": true
          }
        ]
      },
    ]
      },
      text: {
      },
      returnText: {
        suggestionFrom: "Suggestie van {{ displayName }}",
        createdSuggestion: {
          title: "Je suggestie is aangemaakt!",
          description: "Hij verstuurd in <#{{ suggestionChannelId }}>"
        }
      },
      logText: {

      },
    }
  },
  modules: {
    executeCommand: {
        text: {
  
        },
        returnText: {
          noPermsEmbedTitle: ":x: Geen permissie",
          noPermsEmbedDescription: "**Je hebt geen permissie om \`{{ commandName }}\` te gebruiken** (bennodigd \`{{ commandPerms }}\`).",
        },
        logText: {
          userHasNoCommandPerms: "{{ username }} tried to use the '{{ commandName }}' command without permission",
          userUsedCommand: "{{ username }} used the '{{ commandName }}' command",
          errorWhileExecutingCommand: "An error occurred whilst executing the '{{ commandName }}' command"
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
