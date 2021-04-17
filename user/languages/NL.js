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
          options: '',
        },
        text: {
        },
        returnText: {
          currentPing: 'Mijn huidige ping is **{{ value }}**',
        },
        logText: {

        },
      },
    },
    config: {
      commandText: {
        name: 'config',
        subNames: ['initialiseer', 'configureer', 'overzicht'],
        description: 'Pas de de config aan voor de server',
        permission: 'ADMINISTRATOR',
        options: [{
          name: 'initialiseer',
          description: 'Maak de config compleet opnieuw aan',
          type: 1, // 1 is type SUB_COMMAND
        },
        {
          name: 'configureer',
          description: 'Stel een onderdeel van de config compleet opnieuw aan op basis van je input',
          type: 1, // 1 is type SUB_COMMAND
          options: [
            {
              name: 'onderdeel',
              description: 'Naam van onderdeel in de config',
              type: 3,
              required: true,
            },
          ],
        },
        {
          name: 'overzicht',
          description: 'Bekijk alle aanpasbaare config velden',
          type: 1, // 1 is type SUB_COMMAND
        },
        ],
      },
      text: {
        changeConfigValueMessage: {
          title: "Pas het veld '{{ configValueName }}' aan",
        },
        changeConfigValueOfObjectValueMessage: {
          title: "Pas het veld '{{ configValueName }}' van het object '{{ configObjectName }}' aan",
        },
        // changeableConfigValues: {
        //   'serverName': "Vul de naam in die je wilt gebruiken als 'server naam'.",
        //   suggestion: [
        //     { name: 'enabled', description: "Vul 'TRUE' in als je suggesties wil gebruiken. Alles wat je anders invult zal de suggesties onbruikbaar maken." },
        //     { name: 'channelId', description: 'Als je de suggesties aangezet hebt kan je nu het id van het suggestie kanaal invoeren.' },
        //   ],
        // },
        changeableConfigValues: [
          { name: 'serverName', description: "Vul de naam in die je wilt gebruiken als 'server naam'." },
        ],
        changeableConfigObjects: {

        },
        configOverview: {
          title: 'Alle aanpasbaare config velden',
          description: `Om een veld aan te passen kan je /config **initialiseer** of /config **onderdeel** gebruiken.
          
          Onderdelen:
          `,
        },
      },
      returnText: {
        startedUpdatingConfig: {
          title: 'Pas de config aan',
        },
        messageCollectorEnd: {
          title: 'Succesvol de config aangepast',
          description: 'Vanaf nu zullen de aangepaste velden gebruikt worden',
        },
        messageCollectorExpired: {
          title: 'Je deed er te lang over om de config te updaten!',
          description: 'De wijzingen worden terug gedraaid, probeer later opnieuw',
        },
      },
      logText: {

      },
    },
    suggestion: {
      commandText: {
        name: 'suggestie',
        subNames: ['nieuw'],
        description: 'Check of de bot nog actief is',
        permission: '',
        options: [{
          name: 'nieuw',
          description: 'Maak een nieuwe suggestie aan',
          type: 1, // 1 is type SUB_COMMAND
          options: [
            {
              name: 'titel',
              description: 'De titel boven aan je suggestie',
              type: 3,
              required: true,
            },
            {
              name: 'bericht',
              description: 'Je suggestie uitgelegd',
              type: 3,
              required: true,
            },
          ],
        },
        ],
      },
      text: {
      },
      returnText: {
        suggestionNotEnabled: {
          title: 'De suggesties staan uit, contacteer staff als je denkt dat dit niet correct is!',
        },
        suggestionFrom: 'Suggestie van {{ displayName }}',
        createdSuggestion: {
          title: 'Je suggestie is aangemaakt!',
          description: 'Hij verstuurd in <#{{ suggestionChannelId }}>',
        },
        noSuggestionChannelEmbed: {
          title: 'Ik kon geen suggestie kanaal vinden',
          description: `Het suggestie kanaal is niet juist ingesteld
          
          Contacteer de bot eigenaar voor support of vraag aan staff om hulp`,
        },
      },
      logText: {

      },
    },
  },
  modules: {
    executeCommand: {
      text: {

      },
      returnText: {
        noPermsEmbedTitle: ':x: Geen permissie',
        noPermsEmbedDescription: '**Je hebt geen permissie om `{{ commandName }}` te gebruiken** (bennodigd `{{ commandPerms }}`).',
      },
      logText: {
        userHasNoCommandPerms: "{{ username }} tried to use the '{{ commandName }}' command without permission",
        userUsedCommand: "{{ username }} used the '{{ commandName }}{{ commandArgs }}' command",
        errorWhileExecutingCommand: "An error occurred whilst executing the '{{ commandName }}' command",
      },
    },
  },
  events: {
    message: {
      text: {

      },
      returnText: {

      },
      logText: {
        dmMessage: 'Received a DM from {{ username }}: {{ cleanMessage }}',
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
        administratorGranted: "'ADMINISTRATOR' permission has been granted",
        administratorMissing: "Bot does not have 'ADMINISTRATOR' permission",
      },
    },
  },
};
