const { Events, ActivityType } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`Logged in as ${client.user.tag} at ${new Date().toISOString()}`);
    client.user.setActivity({ name: 'with the API', type: ActivityType.Playing });
  },
};
