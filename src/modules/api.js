const express = require('express');
const { ChildLogger } = require('leekslazylogger');

require('dotenv').config({ path: 'user/.env' });

const log = new ChildLogger();

module.exports = (config, client) => {
  // Set up the express app
  const app = express();
  app.post('/api/v1/verifyUser', async (req, res) => {
    try {
      log.console(`> Api request on '/api/v1/verifyUser' with query args: ${JSON.stringify(req.query)}`);
      if (req.query.acces_key !== process.env.apiAccessKey) {
        return res.status(401).send({
          success: 'false',
          message: 'Your not allowed access Api with your ApiAccessKey',
        });
      }

      if (req.query.guild_id === undefined) {
        return res.status(400).send({
          success: 'false',
          message: "The argument 'guild_id' is required",
        });
      }
      if (req.query.user_id === undefined) {
        return res.status(400).send({
          success: 'false',
          message: "The argument 'user_id' is required",
        });
      }

      const guild = client.guilds.cache.get(req.query.guild_id);
      if (guild === undefined) {
        return res.status(404).send({
          success: 'false',
          message: "The was no guild found with your 'guild_id', please try again",
        });
      }

      const unverifiedRole = await guild.roles.fetch(config.verifySystem.unverifiedRoleId);
      const verifiedRole = await guild.roles.fetch(config.verifySystem.verifiedRoleId);
      const member = guild.members.cache.get(req.query.user_id);
      if (member === undefined) {
        return res.status(404).send({
          success: 'false',
          message: "The was no member found with your 'member_id', please try again",
        });
      }
      await member.roles.remove(unverifiedRole);
      await member.roles.add(verifiedRole);
      res.status(200).send({
        success: 'true',
        message: 'Successfully updated roles of your query user',
      });
    } catch (error) {
      res.status(500).send({
        success: 'false',
        message: 'Something went wrong',
      });
      throw error;
    }

    return null;
  });

  app.listen(config.apiPort, () => {
    log.info(`Api running on port ${config.apiPort}`);
  });
};
